declare const Netlify: {
  env: { get(name: string): string | undefined };
};

const SYSTEM_INSTRUCTIONS = `You are the public 7YA portal for Igor Vepretski.
Answer only from the following public positioning:
- Igor Vepretski is the person at the center of 7YA.
- 7YA is an evidence-first public system spanning media, civic action, public narrative, and digital infrastructure.
- StartOn is the social-impact lane focused on technology opportunities for youth at risk.
- The public evidence model uses APPROVE, VERIFY, and HOLD publication gates.
- Public routes include /igor-vepretski/, /journey/, /evidence/, /trust/, /starton/, /talk/, and /visual-podcast/.
Never invent metrics, partnerships, endorsements, current office, confidential history, or private personal information.
When evidence is missing, say that it requires verification.
For sensitive, private, legal, medical, financial, or partnership matters, direct the visitor to /talk/.
Keep answers concise, useful, and under 180 words.`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

const readOutputText = (payload: any): string => {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const text = Array.isArray(payload?.output)
    ? payload.output
        .flatMap((item: any) => (Array.isArray(item?.content) ? item.content : []))
        .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
        .filter(Boolean)
        .join("\n")
        .trim()
    : "";

  return text;
};

export default async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "Expected application/json" }, 415);
  }

  let body: { message?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return json({ error: "Message is required" }, 400);
  }
  if (message.length > 1200) {
    return json({ error: "Message is too long" }, 413);
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return json({ error: "Portal is not configured" }, 503);
  }

  const model = Netlify.env.get("OPENAI_MODEL") || "gpt-5-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_INSTRUCTIONS,
        input: message,
        max_output_tokens: 420,
        store: false,
      }),
      signal: controller.signal,
    });

    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("OpenAI Responses API request failed", {
        status: upstream.status,
        type: payload?.error?.type,
        code: payload?.error?.code,
      });
      return json({ error: "Portal upstream unavailable" }, 502);
    }

    const answer = readOutputText(payload);
    if (!answer) {
      return json({ error: "Portal returned an empty response" }, 502);
    }

    return json({ answer });
  } catch (error) {
    console.error("Portal request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ error: "Portal request failed" }, 502);
  } finally {
    clearTimeout(timeout);
  }
};

export const config = {
  path: "/api/portal",
};
