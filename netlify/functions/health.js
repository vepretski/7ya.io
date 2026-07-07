const securityHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...securityHeaders,
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
      body: "",
    }
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        ...securityHeaders,
        allow: "GET, OPTIONS",
      },
      body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
    }
  }

  return {
    statusCode: 200,
    headers: securityHeaders,
    body: JSON.stringify({
      ok: true,
      service: "7ya-netlify-api",
      status: "healthy",
      runtime: "netlify-functions",
      timestamp: new Date().toISOString(),
    }),
  }
}
