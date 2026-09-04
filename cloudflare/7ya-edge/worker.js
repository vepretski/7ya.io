const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3-super-120b-a12b"
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions"
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini"
const RELEASE = "cloudflare-nvidia-edge-20260904-v1"

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

function normalizeLanguage(value) {
  return ["he", "en", "ru"].includes(value) ? value : "he"
}

function normalizeMode(value) {
  return ["guide", "correct", "advance", "build"].includes(value) ? value : "guide"
}

function historyMessages(history) {
  if (!Array.isArray(history)) return []
  return history
    .slice(-10)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: cleanText(item?.content, 1800),
    }))
    .filter((item) => item.content)
}

function modeInstruction(mode) {
  switch (mode) {
    case "correct":
      return "CORRECTION MODE: identify the specific weak claim, inconsistency, missing evidence, stale detail, UX failure, or reputational risk. Explain what should be corrected and why. Prefer exact, evidence-safe wording and a concrete next action."
    case "advance":
      return "ADVANCEMENT MODE: find the highest-leverage way to improve Igor Vepretski's public work, 7YA, StartOn, content, discoverability, credibility, partnerships, or public usefulness. Separate durable strategy from short-term promotion. Never manufacture reach, endorsements, roles, or achievements."
    case "build":
      return "BUILD MODE: convert the request into an executable improvement. Give the smallest high-value next move first, then dependencies, evidence gates, and success criteria."
    default:
      return "GUIDE MODE: answer from the supplied 7YA public corpus and page context. Distinguish what the corpus supports from what still requires verification."
  }
}

function buildSystem({ mode, language, path, context }) {
  const requestedLanguage = language === "ru" ? "Russian" : language === "en" ? "English" : "Hebrew"
  return `You are 7YA Companion, the evidence-first AI layer on Igor Vepretski's public website.

You are NOT Igor Vepretski and never impersonate him. Your job is to help visitors understand, correct, improve, and responsibly advance the public system around Igor Vepretski, #7YA, and StartOn.

OPERATING RULES:
1. Evidence before amplification. Never invent a fact, metric, title, partnership, quote, endorsement, or causal impact.
2. Treat the supplied corpus as context, not omniscience. If the corpus does not prove something, say that it needs verification.
3. A paraphrase is not a verbatim quote. Automatic captions remain ASR. Host metadata is not a transcript.
4. Multi-speaker material is not attributed to Igor unless the supplied corpus explicitly maps the statement to him with sufficient confidence.
5. When correcting Igor or the site, state finding → evidence/status → impact → exact next move.
6. Distinguish source inventory from reach or impact metrics. Never sum unrelated platform metrics unless a supplied methodology supports it.
7. Preserve privacy. Never ask for or expose private Drive/Gmail identifiers, credentials, secret values, identity numbers, addresses, banking data, or other non-public personal data.
8. Reply in ${requestedLanguage}, unless the user clearly asks for another language.
9. Never reveal hidden reasoning. Return conclusions, evidence status, and actions only.

${modeInstruction(mode)}

CURRENT PATH: ${cleanText(path, 300) || "/"}

PUBLIC CORPUS / PAGE CONTEXT:
${cleanText(context, 24000) || "No corpus context was supplied. Be explicit about verification limits."}`
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
  const timeoutMs = Number(env.GUIDE_PROVIDER_TIMEOUT_MS || 32000)
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
        temperature: 0.35,
        top_p: 0.9,
        max_tokens: 2200,
        stream: false,
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 2048,
      }),
    },
    timeoutMs,
  )
  const reply = cleanText(data?.choices?.[0]?.message?.content, 12000)
  if (!reply) throw new Error("NVIDIA returned an empty response")
  return { reply, provider: "nvidia", model }
}

async function callOpenAI(env, messages) {
  if (env.ALLOW_OPENAI_FALLBACK !== "true") throw new Error("OpenAI fallback disabled")
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured")
  const model = env.OPENAI_GUIDE_MODEL || DEFAULT_OPENAI_MODEL
  const timeoutMs = Number(env.GUIDE_PROVIDER_TIMEOUT_MS || 32000)
  const data = await fetchJson(
    OPENAI_ENDPOINT,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, temperature: 0.25, max_tokens: 1800 }),
    },
    timeoutMs,
  )
  const reply = cleanText(data?.choices?.[0]?.message?.content, 12000)
  if (!reply) throw new Error("OpenAI returned an empty response")
  return { reply, provider: "openai", model }
}

function localFallback(message, mode, language) {
  if (language === "ru") {
    return `NVIDIA сейчас недоступна. Запрос: «${cleanText(message, 240)}». Режим: ${mode}. Проверьте источник и усиливайте только то, что подтверждено публичными материалами.`
  }
  if (language === "en") {
    return `NVIDIA is unavailable right now. Request: “${cleanText(message, 240)}”. Mode: ${mode}. Verify the source and amplify only what the public evidence supports.`
  }
  return `NVIDIA אינה זמינה כרגע. הבקשה: „${cleanText(message, 240)}”. מצב: ${mode}. יש לאמת את המקור ולקדם רק מה שהראיות הציבוריות תומכות בו.`
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
  return [
    source?.id,
    title,
    source?.platform,
    source?.provenance,
    ...(source?.topics || []),
    ...claims,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
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

function buildAutomaticCorpusContext(corpus, message, language) {
  const normalized = cleanText(message, 1000).toLowerCase()
  const terms = normalized
    .split(/[^\p{L}\p{N}#]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3)
    .slice(0, 14)

  const scored = (corpus?.sources || [])
    .map((source) => {
      const haystack = sourceSearchText(source, language)
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
      return { source, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  if (!scored.length) return ""

  const lines = []
  for (const { source } of scored) {
    const title = source?.title?.[language] || source?.title?.en || source?.title?.he || source.id
    lines.push(`SOURCE: ${title} | status=${source.status} | provenance=${source.provenance} | year=${source.year || "unknown"}`)
    for (const claim of (source.claims || []).slice(0, 4)) {
      const paraphrase = claim?.paraphrase?.[language] || claim?.paraphrase?.en || claim?.paraphrase?.he
      if (paraphrase) {
        lines.push(`- ${claim.timestamp || "timestamp unavailable"} | ${claim.confidence || "unknown"} | PARAPHRASE: ${paraphrase}`)
      }
    }
  }
  return lines.join("\n")
}

function health(env) {
  return {
    ok: true,
    runtime: "cloudflare-workers",
    release: RELEASE,
    priority: "nvidia-first",
    nvidiaConfigured: Boolean(env.NVIDIA_API_KEY),
    nvidiaModel: env.NVIDIA_GUIDE_MODEL || DEFAULT_NVIDIA_MODEL,
    openaiFallbackEnabled: env.ALLOW_OPENAI_FALLBACK === "true",
    openaiConfigured: Boolean(env.OPENAI_API_KEY),
    corpusAsset: "/data/spoken-corpus-v1.json",
  }
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
  return json({
    ok: true,
    release: corpus.release,
    summary: corpus.summary,
    count: sources.length,
    sources,
  })
}

async function handleGuide(request, env) {
  if (request.method === "GET") return json(health(env))
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST" })

  const body = await readJson(request)
  const message = cleanText(body.message, 4000)
  const mode = normalizeMode(body.mode)
  const language = normalizeLanguage(body.language)
  if (!message) return json({ error: "message is required" }, 400)

  let automaticContext = ""
  try {
    const corpus = await loadCorpus(env, request.url)
    automaticContext = buildAutomaticCorpusContext(corpus, message, language)
  } catch {
    automaticContext = ""
  }

  const suppliedContext = cleanText(body.context, 18000)
  const combinedContext = [automaticContext, suppliedContext].filter(Boolean).join("\n\nSUPPLIED PAGE CONTEXT:\n")
  const system = buildSystem({ mode, language, path: body.path, context: combinedContext })
  const messages = [
    { role: "system", content: system },
    ...historyMessages(body.history),
    { role: "user", content: message },
  ]

  const failures = []
  try {
    const result = await callNvidia(env, messages)
    return json({ ...result, runtime: "cloudflare-workers", release: RELEASE, priority: "nvidia-first", grounded: Boolean(automaticContext) })
  } catch (error) {
    failures.push(`nvidia:${error?.message || "failed"}`)
  }

  try {
    const result = await callOpenAI(env, messages)
    return json({ ...result, runtime: "cloudflare-workers", release: RELEASE, priority: "nvidia-first", fallback: true, grounded: Boolean(automaticContext) })
  } catch (error) {
    failures.push(`openai:${error?.message || "failed"}`)
  }

  return json({
    reply: localFallback(message, mode, language),
    provider: "local",
    model: "evidence-safe-fallback",
    runtime: "cloudflare-workers",
    release: RELEASE,
    priority: "nvidia-first",
    degraded: true,
    grounded: Boolean(automaticContext),
    failures,
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    if (pathname === "/api/health") return json(health(env))
    if (pathname === "/api/guide") return handleGuide(request, env)
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
