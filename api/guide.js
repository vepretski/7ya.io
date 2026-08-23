const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"
const NVIDIA_MODEL = process.env.NVIDIA_GUIDE_MODEL || "nvidia/nemotron-3-super-120b-a12b"
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions"
const OPENAI_MODEL = process.env.OPENAI_GUIDE_MODEL || "gpt-4o-mini"
const PROVIDER_TIMEOUT_MS = Number(process.env.GUIDE_PROVIDER_TIMEOUT_MS || 32000)

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === "object") return req.body
  try {
    return JSON.parse(req.body)
  } catch {
    return {}
  }
}

function cleanText(value, max = 24000) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
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
      return "GUIDE MODE: answer the user's question from the supplied 7YA public corpus and page context. Distinguish what the corpus supports from what would need verification."
  }
}

function buildSystem({ mode, language, path, context }) {
  const requestedLanguage = language === "ru" ? "Russian" : language === "en" ? "English" : "Hebrew"
  return `You are 7YA Companion, the evidence-first AI layer on Igor Vepretski's public website.

You are NOT Igor Vepretski and never impersonate him. Your job is to help visitors understand, correct, improve, and responsibly advance the public system around Igor Vepretski, #7YA, and StartOn.

OPERATING RULES:
1. Evidence before amplification. Never invent a fact, metric, title, partnership, quote, endorsement, or causal impact.
2. Treat the supplied corpus as context, not omniscience. If the corpus does not prove something, say that it needs verification.
3. When correcting Igor or the site, be precise rather than flattering. State finding → evidence/status → impact → exact next move.
4. When advancing Igor, optimize for credibility, usefulness, discoverability, durable relationships, and public value — not hype.
5. Distinguish source inventory from reach or impact metrics. Never sum unrelated platform metrics into a total unless a supplied methodology explicitly supports it.
6. Preserve privacy. Do not request sensitive personal information.
7. Reply in ${requestedLanguage}, unless the user clearly asks for another language.
8. Be concise but substantive. Use clear headings only when they improve actionability.
9. Never reveal hidden reasoning. Return conclusions, evidence status, and actions only.

${modeInstruction(mode)}

CURRENT PATH: ${cleanText(path, 300) || "/"}

PUBLIC CORPUS / PAGE CONTEXT:
${cleanText(context, 24000) || "No corpus context was supplied. Be explicit about verification limits."}`
}

async function fetchJson(url, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)
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

async function callNvidia(messages) {
  const key = process.env.NVIDIA_API_KEY
  if (!key) throw new Error("NVIDIA_API_KEY is not configured")

  const data = await fetchJson(NVIDIA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages,
      temperature: 1,
      top_p: 0.95,
      max_tokens: 6000,
      stream: false,
      chat_template_kwargs: { enable_thinking: true },
      reasoning_budget: 4096,
    }),
  })

  const reply = cleanText(data?.choices?.[0]?.message?.content, 12000)
  if (!reply) throw new Error("NVIDIA returned an empty response")
  return { reply, provider: "nvidia", model: NVIDIA_MODEL }
}

async function callOpenAI(messages) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY is not configured")

  const data = await fetchJson(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.35,
      max_tokens: 1800,
    }),
  })

  const reply = cleanText(data?.choices?.[0]?.message?.content, 12000)
  if (!reply) throw new Error("OpenAI returned an empty response")
  return { reply, provider: "openai", model: OPENAI_MODEL }
}

function localFallback(message, mode, language) {
  const he = language !== "en" && language !== "ru"
  const ru = language === "ru"
  if (ru) {
    return `AI-провайдер сейчас недоступен. Запрос сохранён только в этой вкладке: «${cleanText(message, 240)}». Режим: ${mode}. Проверьте источник, сформулируйте одно проверяемое изменение и только затем усиливайте публичное утверждение.`
  }
  if (!he) {
    return `The AI provider is unavailable right now. Your request remains only in this tab: “${cleanText(message, 240)}”. Mode: ${mode}. Verify the source, define one testable correction, then amplify only what the evidence supports.`
  }
  return `ספק ה־AI אינו זמין כרגע. הבקשה נשארת רק בלשונית הזו: „${cleanText(message, 240)}”. מצב: ${mode}. בדקו את המקור, הגדירו תיקון אחד שניתן לאמת, ורק אחר כך קדמו את מה שהראיות באמת תומכות בו.`
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("X-7YA-AI-Priority", "nvidia-first")

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      priority: "nvidia-first",
      nvidiaConfigured: Boolean(process.env.NVIDIA_API_KEY),
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      model: NVIDIA_MODEL,
    })
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = parseBody(req)
  const message = cleanText(body.message, 4000)
  const mode = ["guide", "correct", "advance", "build"].includes(body.mode) ? body.mode : "guide"
  const language = ["he", "en", "ru"].includes(body.language) ? body.language : "he"

  if (!message) return res.status(400).json({ error: "message is required" })

  const system = buildSystem({
    mode,
    language,
    path: body.path,
    context: body.context,
  })
  const messages = [
    { role: "system", content: system },
    ...historyMessages(body.history),
    { role: "user", content: message },
  ]

  const failures = []
  try {
    const result = await callNvidia(messages)
    return res.status(200).json({ ...result, priority: "nvidia-first" })
  } catch (error) {
    failures.push(`nvidia:${error?.message || "failed"}`)
  }

  try {
    const result = await callOpenAI(messages)
    return res.status(200).json({ ...result, priority: "nvidia-first", fallback: true })
  } catch (error) {
    failures.push(`openai:${error?.message || "failed"}`)
  }

  return res.status(200).json({
    reply: localFallback(message, mode, language),
    provider: "local",
    model: "evidence-safe-fallback",
    priority: "nvidia-first",
    degraded: true,
    failures: process.env.NODE_ENV === "development" ? failures : undefined,
  })
}
