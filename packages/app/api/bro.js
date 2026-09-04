import { claimSourceLink, claimText, searchSpokenClaims, SPOKEN_CORPUS_RELEASE } from "./_spoken-corpus.js"

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"
const MAX_INPUT_CHARS = 12000

const json = (response, status, payload) => {
  response.statusCode = status
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "no-store")
  response.setHeader("X-Content-Type-Options", "nosniff")
  response.setHeader("X-7YA-AI-Provider", payload?.provider || "nvidia-nim")
  response.end(JSON.stringify(payload))
}

const language = (text) => {
  if (/[\u0590-\u05FF]/.test(text)) return "he"
  if (/[\u0400-\u04FF]/.test(text)) return "ru"
  return "en"
}

const fallbackText = (lang, claims) => {
  if (!claims.length) {
    if (lang === "he") return "לא מצאתי כרגע התאמה מספקת בקורפוס המדובר המאומת. עדיף להרחיב את השאלה או לעבור ל־Voice כדי לראות את המקורות הקיימים."
    if (lang === "ru") return "В проверенном устном корпусе пока нет достаточно точного совпадения. Расширьте вопрос или откройте Voice, чтобы посмотреть доступные источники."
    return "I do not have a sufficiently close match in the verified spoken corpus yet. Broaden the question or open Voice to inspect the available sources."
  }

  const lines = claims.map((claim, index) => `${index + 1}. ${claimText(claim, lang)} — ${claim.source}, ${claim.timestamp}`)
  if (lang === "he") return `NVIDIA עדיין לא זמין כרגע, לכן אני לא ממציא תשובת AI. אלה ההתאמות החזקות ביותר מהקורפוס המאומת:\n\n${lines.join("\n")}`
  if (lang === "ru") return `NVIDIA сейчас недоступна, поэтому я не буду выдумывать AI-ответ. Вот наиболее релевантные записи из проверенного корпуса:\n\n${lines.join("\n")}`
  return `NVIDIA is not available right now, so I will not invent an AI answer. These are the strongest matches from the verified corpus:\n\n${lines.join("\n")}`
}

const cleanMessages = (body) => {
  if (typeof body?.message === "string") return [{ role: "user", content: body.message.slice(0, MAX_INPUT_CHARS) }]
  if (!Array.isArray(body?.messages)) return []

  return body.messages
    .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .slice(-8)
    .map((item) => ({ role: item.role, content: item.content.slice(0, MAX_INPUT_CHARS) }))
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.statusCode = 204
    response.setHeader("Allow", "POST, OPTIONS")
    response.end()
    return
  }

  if (request.method !== "POST") {
    response.statusCode = 405
    response.setHeader("Allow", "POST, OPTIONS")
    response.end()
    return
  }

  let body = request.body
  if (typeof body === "string") {
    try {
      body = JSON.parse(body)
    } catch {
      return json(response, 400, { provider: "nvidia-nim", error: "INVALID_JSON" })
    }
  }

  const messages = cleanMessages(body || {})
  const latestUser = [...messages].reverse().find((message) => message.role === "user")?.content?.trim() || ""
  if (!latestUser) return json(response, 400, { provider: "nvidia-nim", error: "MESSAGE_REQUIRED" })

  const lang = language(latestUser)
  const selectedClaims = searchSpokenClaims(latestUser, 5)
  const sources = selectedClaims.map((claim) => ({
    source_id: claim.sourceId,
    source: claim.source,
    timestamp: claim.timestamp,
    topic: claim.topic,
    confidence: claim.confidence,
    paraphrase: claimText(claim, lang),
    url: claimSourceLink(claim),
  }))

  const apiKey = process.env.NVIDIA_API_KEY?.trim()
  const baseUrl = (process.env.NVIDIA_NIM_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "")
  const model = process.env.NVIDIA_NIM_MODEL || DEFAULT_MODEL

  if (!apiKey || !selectedClaims.length) {
    return json(response, 200, {
      provider: "deterministic-corpus-fallback",
      nvidia_configured: Boolean(apiKey),
      model,
      corpus_release: SPOKEN_CORPUS_RELEASE,
      answer: fallbackText(lang, selectedClaims),
      sources,
    })
  }

  const grounding = selectedClaims
    .map((claim, index) => `[${index + 1}] ${claim.source} ${claim.timestamp} | ${claim.topic} | ${claim.confidence}\nPARAPHRASE, NOT VERBATIM: ${claimText(claim, lang)}`)
    .join("\n\n")

  const system = `You are Bro Chat, the source-grounded public assistant for 7YA / Igor Vepretski. Answer in the user's language. Be concise but substantive. Use only the supplied public corpus evidence for claims about Igor. Never turn a paraphrase into a verbatim quote. Automatic captions remain ASR. Host metadata is not a transcript. Multi-speaker material cannot be attributed to Igor unless the supplied claim already has sufficient attribution. If the corpus does not support an assertion, say so. Never invent source URLs, dates, metrics, affiliations, or private facts. Prefer explaining uncertainty over filling gaps.\n\nPUBLIC SPOKEN CORPUS EXCERPTS:\n${grounding}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 1400,
        stream: false,
      }),
      signal: controller.signal,
    })

    const data = await upstream.json().catch(() => null)
    const answer = data?.choices?.[0]?.message?.content?.trim()

    if (!upstream.ok || !answer) {
      return json(response, 200, {
        provider: "deterministic-corpus-fallback",
        nvidia_configured: true,
        nvidia_status: upstream.status,
        model,
        corpus_release: SPOKEN_CORPUS_RELEASE,
        answer: fallbackText(lang, selectedClaims),
        sources,
      })
    }

    return json(response, 200, {
      provider: "nvidia-nim",
      nvidia_configured: true,
      model,
      corpus_release: SPOKEN_CORPUS_RELEASE,
      answer,
      sources,
    })
  } catch (error) {
    return json(response, 200, {
      provider: "deterministic-corpus-fallback",
      nvidia_configured: true,
      nvidia_error: error?.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE",
      model,
      corpus_release: SPOKEN_CORPUS_RELEASE,
      answer: fallbackText(lang, selectedClaims),
      sources,
    })
  } finally {
    clearTimeout(timeout)
  }
}
