import { randomUUID } from "node:crypto"

const MAX_BODY_BYTES = 12_000
const MAX_FIELD_LENGTH = 2_000
const WEBHOOK_TIMEOUT_MS = 4_000

const securityHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
}

const corsHeaders = {
  "access-control-allow-origin": process.env.SEVENYA_ALLOWED_ORIGIN || "https://7ya.io",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "vary": "Origin",
}

function json(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...securityHeaders, ...corsHeaders, ...extraHeaders },
    body: JSON.stringify(payload),
  }
}

function truncate(value) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, MAX_FIELD_LENGTH)
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function assertJsonRequest(event) {
  const contentType = event.headers?.["content-type"] || event.headers?.["Content-Type"] || ""
  if (!contentType.toLowerCase().includes("application/json")) {
    const error = new Error("json_required")
    error.statusCode = 415
    throw error
  }
}

function readJsonBody(event) {
  const rawBody = event.body || ""
  const bytes = Buffer.byteLength(rawBody, event.isBase64Encoded ? "base64" : "utf8")
  if (bytes > MAX_BODY_BYTES) {
    const error = new Error("payload_too_large")
    error.statusCode = 413
    throw error
  }

  if (!rawBody) return {}
  const decoded = event.isBase64Encoded ? Buffer.from(rawBody, "base64").toString("utf8") : rawBody
  return JSON.parse(decoded)
}

function normalizeSubmission(body) {
  const submission = {
    name: truncate(body.name),
    email: truncate(body.email),
    topic: truncate(body.topic || body.subject || "7YA intake"),
    message: truncate(body.message || body.ask || body.context),
    source: truncate(body.source || "7ya.io"),
    company: truncate(body.company),
    website: truncate(body.website),
  }

  const honeypot = truncate(body.website_url || body.url || body.hp)
  if (honeypot) {
    const error = new Error("spam_rejected")
    error.statusCode = 400
    throw error
  }

  if (!submission.name) {
    const error = new Error("name_required")
    error.statusCode = 400
    throw error
  }

  if (!submission.email || !isEmail(submission.email)) {
    const error = new Error("valid_email_required")
    error.statusCode = 400
    throw error
  }

  if (!submission.message || submission.message.length < 8) {
    const error = new Error("message_required")
    error.statusCode = 400
    throw error
  }

  return submission
}

async function deliverToWebhook(submission, requestId) {
  const webhookUrl = process.env.SEVENYA_INTAKE_WEBHOOK_URL
  if (!webhookUrl) {
    return { delivered: false, reason: "webhook_not_configured" }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        requestId,
        receivedAt: new Date().toISOString(),
        service: "7ya-netlify-api",
        submission,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      return { delivered: false, reason: "webhook_failed", status: response.status }
    }

    return { delivered: true }
  } finally {
    clearTimeout(timeout)
  }
}

export async function handler(event) {
  const requestId = randomUUID()

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { ...securityHeaders, ...corsHeaders }, body: "" }
  }

  if (event.httpMethod === "GET") {
    return json(200, {
      ok: true,
      service: "7ya-intake-api",
      methods: ["GET", "POST", "OPTIONS"],
      fields: ["name", "email", "topic", "message", "source"],
      webhookConfigured: Boolean(process.env.SEVENYA_INTAKE_WEBHOOK_URL),
      timestamp: new Date().toISOString(),
    })
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" }, { allow: "GET, POST, OPTIONS" })
  }

  try {
    assertJsonRequest(event)
    const body = readJsonBody(event)
    const submission = normalizeSubmission(body)
    const delivery = await deliverToWebhook(submission, requestId)

    console.log(JSON.stringify({
      level: "info",
      event: "intake_submission",
      requestId,
      delivered: delivery.delivered,
      reason: delivery.reason,
      topic: submission.topic,
      source: submission.source,
    }))

    return json(delivery.delivered ? 202 : 200, {
      ok: true,
      requestId,
      delivered: delivery.delivered,
      status: delivery.delivered ? "accepted" : "received_not_delivered",
      next: delivery.delivered ? "submission_delivered" : "configure_SEVENYA_INTAKE_WEBHOOK_URL",
    })
  } catch (error) {
    const statusCode = error.statusCode || (error.name === "SyntaxError" ? 400 : 500)
    const safeError = statusCode >= 500 ? "internal_error" : error.message

    console.error(JSON.stringify({
      level: "error",
      event: "intake_error",
      requestId,
      statusCode,
      error: safeError,
    }))

    return json(statusCode, { ok: false, requestId, error: safeError })
  }
}
