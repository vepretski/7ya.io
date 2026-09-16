# 7YA NVIDIA-first runtime

7YA uses NVIDIA NIM as the **primary AI inference provider** for Bro Chat and the public spoken-corpus layer. NVIDIA is not treated as a replacement for static web hosting; it is the model/inference layer behind a same-origin server endpoint.

## Runtime contract

- Browser calls `POST /api/bro`.
- The API key is server-side only and is never returned to the client.
- Primary endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`.
- Default model: `nvidia/nemotron-3.5-lightning-30b-a3b`.
- Public Igor claims are grounded in the curated spoken-corpus seed.
- Paraphrases are never promoted to verbatim quotes.
- Multi-speaker evidence remains attribution-gated.
- Missing public URLs are never invented.
- If NVIDIA is unconfigured, unavailable, rate-limited, or times out, `/api/bro` falls back to deterministic corpus retrieval instead of failing the user journey.

## Environment

Set these on the server/hosting environment. Never commit the key.

```text
NVIDIA_API_KEY=<secret generated in NVIDIA Build>
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

`NVIDIA_NIM_BASE_URL` and `NVIDIA_NIM_MODEL` are optional because safe defaults exist in code. `NVIDIA_API_KEY` is the only required secret for live NVIDIA inference.

## Verification

- `GET /api/nvidia-health` reports whether the secret is configured without exposing it.
- `POST /api/bro` must return `provider: nvidia-nim` when the NVIDIA call succeeds.
- Without the secret, `POST /api/bro` must still return HTTP 200 with `provider: deterministic-corpus-fallback` and source records.
- A deployment is not considered NVIDIA-connected until a live `/api/nvidia-health` probe reports `configured: true` and a real `/api/bro` request reports `provider: nvidia-nim`.
