import { claimSourceLink, claimText, searchSpokenClaims, SPOKEN_CORPUS_RELEASE } from "../packages/app/api/_spoken-corpus.js"

const BASE_URL = (process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "")
const MODEL = process.env.NVIDIA_NIM_MODEL || process.env.NVIDIA_GUIDE_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b"
const TIMEOUT_MS = Number(process.env.GUIDE_PROVIDER_TIMEOUT_MS || 25000)

const clean = (value, max = 4000) => typeof value === "string" ? value.trim().slice(0, max) : ""

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === "object") return req.body
  try { return JSON.parse(req.body) } catch { return {} }
}

function modeInstruction(mode) {
  if (mode === "correct") return "Correction mode: identify weak or unsupported claims and give an evidence-safe correction."
  if (mode === "advance") return "Advancement mode: propose the highest-leverage credible next move without manufacturing reach, endorsements, roles, or achievements."
  if (mode === "build") return "Build mode: turn the request into the smallest executable improvement, including evidence gates and success criteria."
  return "Guide mode: answer from the supplied verified public spoken-corpus evidence and state verification limits."
}

function historyMessages(history) {
  if (!Array.isArray(history)) return []
  return history.slice(-8)
    .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .map((item) => ({ role: item.role, content: clean(item.content, 1800) }))
    .filter((item) => item.content)
}

function fallback(language, claims) {
  const lines = claims.map((claim, index) => `${index + 1}. ${claimText(claim, language)} — ${claim.source}, ${claim.timestamp}`)
  if (language === "ru") return lines.length
    ? `NVIDIA сейчас недоступна. Вместо выдуманного AI-ответа — наиболее релевантные записи из проверенного корпуса:\n\n${lines.join("\n")}`
    : "В проверенном устном корпусе пока нет достаточно точного совпадения с этим запросом."
  if (language === "en") return lines.length
    ? `NVIDIA is unavailable right now. Instead of inventing an AI answer, here are the strongest matches from the verified corpus:\n\n${lines.join("\n")}`
    : "The verified spoken corpus does not contain a sufficiently close match for this request yet."
  return lines.length
    ? `NVIDIA אינו זמין כרגע. במקום להמציא תשובת AI, אלה ההתאמות החזקות ביותר מהקורפוס המאומת:\n\n${lines.join("\n")}`
    : "לא מצאתי כרגע התאמה מספקת לשאלה הזאת בקורפוס המדובר המאומת."
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("X-7YA-AI-Priority", "nvidia-first")
  res.setHeader("X-7YA-AI-Provider", "nvidia-nim")

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      priority: "nvidia-first",
      provider: "nvidia-nim",
      nvidiaConfigured: Boolean(process.env.NVIDIA_API_KEY?.trim()),
      openaiConfigured: false,
      model: MODEL,
      corpusRelease: SPOKEN_CORPUS_RELEASE,
      fallback: "deterministic-corpus",
    })
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = parseBody(req)
  const message = clean(body.message)
  const mode = ["guide", "correct", "advance", "build"].includes(body.mode) ? body.mode : "guide"
  const language = ["he", "en", "ru"].includes(body.language) ? body.language : "he"
  if (!message) return res.status(400).json({ error: "message is required" })

  const claims = searchSpokenClaims(message, 5)
  const sources = claims.map((claim) => ({
    source_id: claim.sourceId,
    source: claim.source,
    timestamp: claim.timestamp,
    topic: claim.topic,
    confidence: claim.confidence,
    paraphrase: claimText(claim, language),
    url: claimSourceLink(claim),
  }))

  const key = process.env.NVIDIA_API_KEY?.trim()
  if (!key || !claims.length) {
    return res.status(200).json({
      reply: fallback(language, claims),
      provider: "local",
      provider_id: "deterministic-corpus-fallback",
      model: MODEL,
      priority: "nvidia-first",
      degraded: true,
      nvidiaConfigured: Boolean(key),
      corpusRelease: SPOKEN_CORPUS_RELEASE,
      sources,
    })
  }

  const requestedLanguage = language === "ru" ? "Russian" : language === "en" ? "English" : "Hebrew"
  const grounding = claims.map((claim, index) =>
    `[${index + 1}] ${claim.source} ${claim.timestamp} | ${claim.topic} | confidence=${claim.confidence}\nPARAPHRASE, NOT VERBATIM: ${claimText(claim, language)}`
  ).join("\n\n")

  const system = `You are Bro Chat, the evidence-first public AI layer for 7YA and Igor Vepretski. You are not Igor and must never impersonate him. Reply in ${requestedLanguage}. ${modeInstruction(mode)}\n\nHard rules: evidence before amplification; use only the supplied public corpus for factual claims about Igor; paraphrase is never a verbatim quote; automatic captions remain ASR; host metadata is not a transcript; multi-speaker material is attribution-gated; never invent a URL, date, metric, affiliation, partnership, quote, endorsement, or private fact; if evidence is insufficient say so.\n\nVERIFIED PUBLIC SPOKEN CORPUS:\n${grounding}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...historyMessages(body.history), { role: "user", content: message }],
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 1400,
        stream: false,
      }),
      signal: controller.signal,
    })

    const data = await upstream.json().catch(() => null)
    const reply = clean(data?.choices?.[0]?.message?.content, 12000)
    if (!upstream.ok || !reply) throw new Error(`NVIDIA_UPSTREAM_${upstream.status}`)

    return res.status(200).json({
      reply,
      provider: "nvidia",
      provider_id: "nvidia-nim",
      model: MODEL,
      priority: "nvidia-first",
      corpusRelease: SPOKEN_CORPUS_RELEASE,
      sources,
    })
  } catch (error) {
    return res.status(200).json({
      reply: fallback(language, claims),
      provider: "local",
      provider_id: "deterministic-corpus-fallback",
      model: MODEL,
      priority: "nvidia-first",
      degraded: true,
      nvidia_error: error?.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE",
      corpusRelease: SPOKEN_CORPUS_RELEASE,
      sources,
    })
  } finally {
    clearTimeout(timer)
  }
}
