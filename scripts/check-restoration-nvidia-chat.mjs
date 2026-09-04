import fs from "node:fs"

const required = [
  ["api/guide.js", ["NVIDIA_API_KEY", "https://integrate.api.nvidia.com/v1", "nvidia/nemotron-3.5-lightning-30b-a3b", "deterministic-corpus-fallback", "provider: \"nvidia\""]],
  ["packages/app/api/bro.js", ["NVIDIA_API_KEY", "https://integrate.api.nvidia.com/v1", "nvidia/nemotron-3.5-lightning-30b-a3b", "deterministic-corpus-fallback", "SPOKEN_CORPUS_RELEASE"]],
  ["packages/app/api/nvidia-health.js", ["nvidia-nim", "secret_exposed: false", "WAITING_FOR_NVIDIA_API_KEY"]],
  ["packages/app/api/_spoken-corpus.js", ["spoken-corpus-20260904-v1", "searchSpokenClaims", "PARAPHRASE"]],
  ["packages/app/public/igor-vepretski/nvidia-chat.js", ["/api/guide", "conversation", "provider", "NVIDIA"]],
  ["scripts/inject-restoration-nvidia-chat.mjs", ["nvidia-chat.js", "igor-vepretski/index.html"]],
]

const failures = []
for (const [path, needles] of required) {
  if (!fs.existsSync(path)) {
    failures.push(`${path}: missing`)
    continue
  }
  const text = fs.readFileSync(path, "utf8")
  for (const needle of needles) {
    if (!text.includes(needle)) failures.push(`${path}: missing ${needle}`)
  }
}

const secretScan = ["api/guide.js", "packages/app/api/bro.js", "packages/app/api/nvidia-health.js", "packages/app/NVIDIA_NIM.md"]
  .map((path) => fs.readFileSync(path, "utf8"))
  .join("\n")
if (/nvapi-[A-Za-z0-9_-]{10,}/.test(secretScan)) failures.push("hard-coded NVIDIA API key detected")

if (failures.length) {
  console.error("NVIDIA companion wiring check failed:\n- " + failures.join("\n- "))
  process.exit(1)
}

console.log("NVIDIA companion wiring check passed")
