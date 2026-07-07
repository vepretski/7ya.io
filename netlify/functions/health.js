const securityHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
}

const corsHeaders = {
  "access-control-allow-origin": process.env.SEVENYA_ALLOWED_ORIGIN || "https://7ya.io",
  "access-control-allow-methods": "GET, OPTIONS",
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

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { ...securityHeaders, ...corsHeaders }, body: "" }
  }

  if (event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "method_not_allowed" }, { allow: "GET, OPTIONS" })
  }

  return json(200, {
    ok: true,
    service: "7ya-netlify-api",
    status: "healthy",
    runtime: "netlify-functions",
    timestamp: new Date().toISOString(),
  })
}
