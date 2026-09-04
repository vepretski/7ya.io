import fs from "node:fs"

const checks = [
  [
    "cloudflare/7ya-edge/wrangler.jsonc",
    [
      '"name": "7ya-edge-staging"',
      '"workers_dev": true',
      '"directory": "../../packages/app/public"',
      '"binding": "ASSETS"',
      '"run_worker_first": ["/api/*"]',
      '"NVIDIA_GUIDE_MODEL": "nvidia/nemotron-3.5-lightning-30b-a3b"',
      '"ALLOW_OPENAI_FALLBACK": "false"',
    ],
  ],
  [
    "cloudflare/7ya-edge/worker.js",
    [
      "https://integrate.api.nvidia.com/v1/chat/completions",
      "env.NVIDIA_API_KEY",
      'pathname === "/api/health"',
      'pathname === "/api/nvidia-health"',
      'pathname === "/api/bro"',
      'pathname === "/api/voice"',
      "env.ASSETS.fetch(request)",
      'provider: "nvidia-nim"',
      'provider: "deterministic-corpus-fallback"',
      'answer:',
      'runtime: "cloudflare-workers"',
      'secret_exposed: false',
    ],
  ],
  [
    "packages/app/public/igor-vepretski/nvidia-chat.js",
    [
      'fetch("/api/nvidia-health"',
      'fetch("/api/bro"',
      "messages:",
      "data.answer",
      'data.provider === "nvidia-nim"',
    ],
  ],
  [
    ".github/workflows/cloudflare-7ya-edge-staging.yml",
    [
      "CLOUDFLARE_API_TOKEN",
      "NVIDIA_API_KEY",
      "wrangler deploy",
      "wrangler secret put NVIDIA_API_KEY",
      "/api/health",
      "/api/nvidia-health",
      "/api/bro",
      "/voice/",
      "spoken-corpus.json",
      'provider == "nvidia-nim"',
    ],
  ],
]

const failures = []
for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    failures.push(`missing file: ${file}`)
    continue
  }
  const text = fs.readFileSync(file, "utf8")
  for (const needle of needles) {
    if (!text.includes(needle)) failures.push(`${file}: missing marker ${needle}`)
  }
}

const client = fs.readFileSync("packages/app/public/igor-vepretski/nvidia-chat.js", "utf8")
if (client.includes('fetch("/api/guide"')) failures.push("public client still routes through /api/guide")

if (failures.length) {
  console.error("CLOUDFLARE_NVIDIA_EDGE_GATE: FAIL")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("CLOUDFLARE_NVIDIA_EDGE_GATE: PASS")
