const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"
const RELEASE = "cloudflare-nvidia-edge-20260905-v2"

function cleanText(value, max = 24000) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-7YA-Runtime": "cloudflare-workers",
      "X-7YA-AI-Priority": "nvidia-first",
      ...extraHeaders,
    },
  })
}

function detectLanguage(value) {
  if (/[\u0590-\u05FF]/.test(value)) return "he"
  if (/[\u0400-\u04FF]/.test(value)) return "ru"
  return "en"
}

function normalizeLanguage(value, fallbackText = "") {
  return ["he", "en", "ru"].includes(value) ? value : detectLanguage(fallbackText)
}

function normalizeMode(value) {
  return ["guide", "correct", "advance", "build"].includes(value) ? value : "guide"
}

function cleanMessages(body) {
  if (Array.isArray(body?.messages)) {
    return body.messages
      .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      .slice(-8)
      .map((item) => ({ role: item.role, content: cleanText(item.content, 12000) }))
      .filter((item) => item.content)
  }

  const history = Array.isArray(body?.history)
    ? body.history
        .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
        .slice(-7)
        .map((item) => ({ role: item.role, content: cleanText(item.content, 1800) }))
        .filter((item) => item.content)
    : []
  const message = cleanText(body?.message, 12000)
  return message ? [...history, { role: "user", content: message }] : history
}

function modeInstruction(mode) {
  if (mode === "correct") return "Correction mode: identify weak or unsupported claims and give an evidence-safe correction."
  if (mode === "advance") return "Advancement mode: propose the highest-leverage credible next move without manufacturing reach, endorsements, roles, or achievements."
  if (mode === "build") return "Build mode: turn the request into the smallest executable improvement, including evidence gates and success criteria."
  return "Guide mode: answer from supplied public evidence and state verification limits."
}

function buildSystem({ mode, language, path, context }) {
  const requestedLanguage = language === "ru" ? "Russian" : language === "en" ? "English" : "Hebrew"
  return `You are Bro Chat, the source-grounded public assistant for 7YA / Igor Vepretski.

OPERATING RULES:
1. Evidence before amplification. Never invent facts, metrics, titles, partnerships, quotes, endorsements, or causal impact.
2. Use only supplied public corpus evidence for claims about Igor. If it does not support an assertion, say so.
3. A paraphrase is not a verbatim quote. Automatic captions remain ASR. Host metadata is not a transcript.
4. Multi-speaker material cannot be attributed to Igor unless the supplied evidence already has sufficient attribution.
5. Preserve privacy. Never request or expose credentials, secret values, identity numbers, addresses, banking data, or non-public personal data.
6. Reply in ${requestedLanguage}, unless the user clearly asks for another language.
7. Never reveal hidden reasoning. Return conclusions, evidence status, and actions only.

${modeInstruction(mode)}
CURRENT PATH: ${cleanText(path, 300) || "/"}

PUBLIC SPOKEN CORPUS EXCERPTS:
${cleanText(context, 24000) || "No matching public corpus excerpt was found. State that limitation explicitly."}`
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function fetchJson(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const detail = data?.error?.message || data?.message || `${response.status} ${response.statusText}`
      throw new Error(detail)
    }
    return data
  } finally {
    clearTimeout(timer)
  }
}

async function callNvidia(env, messages) {
  if (!env.NVIDIA_API_KEY) throw new Error("NVIDIA_API_KEY is not configured")
  const model = env.NVIDIA_GUIDE_MODEL || DEFAULT_NVIDIA_MODEL
  const timeoutMs = Number(env.GUIDE_PROVIDER_TIMEOUT_MS || 25000)
  const data = await fetchJson(
    NVIDIA_ENDPOINT,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 1400,
        stream: false,
      }),
    },
    timeoutMs,
  )
  const answer = cleanText(data?.choices?.[0]?.message?.content, 12000)
  if (!answer) throw new Error("NVIDIA returned an empty response")
  return { answer, provider: "nvidia-nim", model }
}

async function loadCorpus(env, requestUrl) {
  const url = new URL("/data/spoken-corpus-v1.json", requestUrl)
  const response = await env.ASSETS.fetch(new Request(url.toString(), { headers: { Accept: "application/json" } }))
  if (!response.ok) throw new Error(`spoken corpus asset returned ${response.status}`)
  return response.json()
}

function sourceSearchText(source, language) {
  const title = source?.title?.[language] || source?.title?.en || source?.title?.he || ""
  const claims = Array.isArray(source?.claims)
    ? source.claims.map((claim) => claim?.paraphrase?.[language] || claim?.paraphrase?.en || claim?.paraphrase?.he || "")
    : []
  return [source?.id, title, source?.platform, source?.provenance, ...(source?.topics || []), ...claims]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

function scoreCorpus(corpus, message, language, limit = 6) {
  const terms = cleanText(message, 1000)
    .toLowerCase()
    .split(/[^\p{L}\p{N}#]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3)
    .slice(0, 14)

  if (!terms.length) return []
  return (corpus?.sources || [])
    .map((source) => {
      const haystack = sourceSearchText(source, language)
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
      return { source, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.source)
}

function groundingFromSources(sources, language) {
  const lines = []
  for (const source of sources) {
    const title = source?.title?.[language] || source?.title?.en || source?.title?.he || source?.id || "source"
    lines.push(`SOURCE: ${title} | status=${source?.status || "unknown"} | provenance=${source?.provenance || "unknown"} | year=${source?.year || "unknown"}`)
    for (const claim of (source?.claims || []).slice(0, 4)) {
      const paraphrase = claim?.paraphrase?.[language] || claim?.paraphrase?.en || claim?.paraphrase?.he
      if (paraphrase) lines.push(`- ${claim?.timestamp || "timestamp unavailable"} | ${claim?.confidence || "unknown"} | PARAPHRASE: ${paraphrase}`)
    }
  }
  return lines.join("\n")
}

function publicSources(sources, language) {
  return sources.map((source) => ({
    source_id: source?.id || null,
    title: source?.title?.[language] || source?.title?.en || source?.title?.he || source?.id || "source",
    status: source?.status || null,
    provenance: source?.provenance || null,
    year: source?.year || null,
    topics: Array.isArray(source?.topics) ? source.topics : [],
  }))
}

function fallbackText(language, sources) {
  if (!sources.length) {
    if (language === "he") return "לא מצאתי כרגע התאמה מספקת בקורפוס המדובר המאומת. עדיף להרחיב את השאלה או לעבור ל־Voice כדי לראות את המקורות הקיימים."
    if (language === "ru") return "В проверенном устном корпусе пока нет достаточно точного совпадения. Расширьте вопрос или откройте Voice, чтобы посмотреть доступные источники."
    return "I do not have a sufficiently close match in the verified spoken corpus yet. Broaden the question or open Voice to inspect the available sources."
  }
  if (language === "he") return "NVIDIA אינה זמינה כרגע. החזרתי רק התאמות מהקורפוס הציבורי המאומת ולא המצאתי תשובת AI."
  if (language === "ru") return "NVIDIA сейчас недоступна. Я вернул только совпадения из проверенного публичного корпуса и не выдумывал AI-ответ."
  return "NVIDIA is unavailable right now. I returned only matches from the verified public corpus and did not invent an AI answer."
}

function nvidiaHealth(env) {
  const configured = Boolean(env.NVIDIA_API_KEY)
  return {
    provider: "nvidia-nim",
    configured,
    runtime: "cloudflare-workers",
    priority: "nvidia-first",
    model: env.NVIDIA_GUIDE_MODEL || DEFAULT_NVIDIA_MODEL,
    corpus_release: RELEASE,
    secret_exposed: false,
    status: configured ? "READY_FOR_LIVE_PROBE" : "WAITING_FOR_NVIDIA_API_KEY",
  }
}

function health(env) {
  const nvidia = nvidiaHealth(env)
  return {
    ok: true,
    runtime: "cloudflare-workers",
    release: RELEASE,
    priority: "nvidia-first",
    nvidiaConfigured: nvidia.configured,
    nvidiaModel: nvidia.model,
    corpusAsset: "/data/spoken-corpus-v1.json",
  }
}

function searchCorpus(corpus, { q = "", topic = "", language = "he", limit = 12 } = {}) {
  const needle = cleanText(q, 400).toLowerCase()
  const topicNeedle = cleanText(topic, 120).toLowerCase()
  return (corpus?.sources || [])
    .filter((source) => {
      if (topicNeedle && !(source?.topics || []).some((value) => String(value).toLowerCase() === topicNeedle)) return false
      if (!needle) return true
      return sourceSearchText(source, language).includes(needle)
    })
    .slice(0, Math.max(1, Math.min(Number(limit) || 12, 25)))
}

async function handleVoice(request, env) {
  const corpus = await loadCorpus(env, request.url)
  const url = new URL(request.url)
  const language = normalizeLanguage(url.searchParams.get("lang"))
  const sources = searchCorpus(corpus, {
    q: url.searchParams.get("q") || "",
    topic: url.searchParams.get("topic") || "",
    language,
    limit: url.searchParams.get("limit") || 12,
  })
  return json({ ok: true, release: corpus.release, summary: corpus.summary, count: sources.length, sources })
}

async function handleBro(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, { Allow: "POST" })
  const body = await readJson(request)
  const messages = cleanMessages(body)
  const latestUser = [...messages].reverse().find((message) => message.role === "user")?.content || ""
  if (!latestUser) return json({ provider: "nvidia-nim", error: "MESSAGE_REQUIRED" }, 400)

  const language = normalizeLanguage(body.language, latestUser)
  const mode = normalizeMode(body.mode)
  const model = env.NVIDIA_GUIDE_MODEL || DEFAULT_NVIDIA_MODEL
  let matchedSources = []
  try {
    const corpus = await loadCorpus(env, request.url)
    matchedSources = scoreCorpus(corpus, latestUser, language)
  } catch {
    matchedSources = []
  }

  const sources = publicSources(matchedSources, language)
  const grounding = groundingFromSources(matchedSources, language)
  if (!env.NVIDIA_API_KEY || !matchedSources.length) {
    return json({
      provider: "deterministic-corpus-fallback",
      nvidia_configured: Boolean(env.NVIDIA_API_KEY),
      model,
      runtime: "cloudflare-workers",
      release: RELEASE,
      priority: "nvidia-first",
      answer: fallbackText(language, matchedSources),
      sources,
    })
  }

  const system = buildSystem({ mode, language, path: body.path, context: grounding })
  try {
    const result = await callNvidia(env, [{ role: "system", content: system }, ...messages])
    return json({ ...result, nvidia_configured: true, runtime: "cloudflare-workers", release: RELEASE, priority: "nvidia-first", sources })
  } catch (error) {
    return json({
      provider: "deterministic-corpus-fallback",
      nvidia_configured: true,
      nvidia_error: error?.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE",
      model,
      runtime: "cloudflare-workers",
      release: RELEASE,
      priority: "nvidia-first",
      answer: fallbackText(language, matchedSources),
      sources,
    })
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url
    if (pathname === "/api/health") return json(health(env))
    if (pathname === "/api/nvidia-health") return json(nvidiaHealth(env))
    if (pathname === "/api/bro") return handleBro(request, env)
    if (pathname === "/api/voice") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, { Allow: "GET" })
      try {
        return await handleVoice(request, env)
      } catch (error) {
        return json({ error: "Voice corpus unavailable", detail: cleanText(error?.message, 300) }, 503)
      }
    }
    if (pathname.startsWith("/api/")) return json({ error: "API route not found", path: pathname }, 404)
    return env.ASSETS.fetch(request)
  },
}