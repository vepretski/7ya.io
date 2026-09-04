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
      '"NVIDIA_GUIDE_MODEL": "nvidia/nemotron-3-super-120b-a12b"',
    ],
  ],
  [
    "cloudflare/7ya-edge/worker.js",
    [
      "https://integrate.api.nvidia.com/v1/chat/completions",
      "env.NVIDIA_API_KEY",
      'pathname === "/api/health"',
      'pathname === "/api/guide"',
      'pathname === "/api/voice"',
      "env.ASSETS.fetch(request)",
      'provider: "nvidia"',
      'runtime: "cloudflare-workers"',
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
      "/api/guide",
      "/voice/",
      "spoken-corpus.json",
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

if (failures.length) {
  console.error("CLOUDFLARE_NVIDIA_EDGE_GATE: FAIL")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("CLOUDFLARE_NVIDIA_EDGE_GATE: PASS")
