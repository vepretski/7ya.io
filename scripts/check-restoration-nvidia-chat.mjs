import fs from "node:fs"

const required = [
  ["api/guide.js", ["NVIDIA_API_KEY", "https://integrate.api.nvidia.com/v1/chat/completions", "nvidia/nemotron-3-super-120b-a12b", "provider: \"nvidia\""]],
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

if (failures.length) {
  console.error("NVIDIA companion wiring check failed:\n- " + failures.join("\n- "))
  process.exit(1)
}

console.log("NVIDIA companion wiring check passed")
