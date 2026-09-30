import { SPOKEN_CORPUS_RELEASE } from "./_spoken-corpus.js"

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"

export default function handler(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.statusCode = 405
    response.setHeader("Allow", "GET, HEAD")
    response.end()
    return
  }

  const configured = Boolean(process.env.NVIDIA_API_KEY?.trim())
  const payload = {
    provider: "nvidia-nim",
    configured,
    mode: configured ? "nvidia-primary-with-corpus-fallback" : "deterministic-corpus-fallback",
    base_url: process.env.NVIDIA_NIM_BASE_URL || DEFAULT_BASE_URL,
    model: process.env.NVIDIA_NIM_MODEL || DEFAULT_MODEL,
    corpus_release: SPOKEN_CORPUS_RELEASE,
    secret_exposed: false,
    status: configured ? "READY_FOR_LIVE_PROBE" : "WAITING_FOR_NVIDIA_API_KEY",
  }

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "no-store")
  response.setHeader("X-Content-Type-Options", "nosniff")
  response.setHeader("X-7YA-AI-Provider", "nvidia-nim")

  if (request.method === "HEAD") response.end()
  else response.end(JSON.stringify(payload, null, 2))
}
