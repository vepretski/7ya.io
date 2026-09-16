import fs from "node:fs"

const path = "packages/app/public/igor-vepretski/nvidia-chat.js"
const text = fs.readFileSync(path, "utf8")
const failures = []

const requireText = (needle, message) => {
  if (!text.includes(needle)) failures.push(message)
}

requireText('fetch("/api/nvidia-health"', "provider health must use /api/nvidia-health")
requireText('fetch("/api/bro"', "Bro Chat messages must use /api/bro")
requireText("messages:", "Bro Chat request must send conversation messages")
requireText("data.answer", "Bro Chat client must consume the /api/bro answer contract")
requireText('data.provider === "nvidia-nim"', "Bro Chat client must recognize nvidia-nim as the live provider")

if (text.includes('fetch("/api/guide"')) failures.push("legacy /api/guide client routing is still present")
if (text.includes("data.reply")) failures.push("legacy reply response contract is still present")

if (failures.length) {
  console.error("Bro Chat client wiring check failed:\n- " + failures.join("\n- "))
  process.exit(1)
}

console.log("Bro Chat client wiring check passed")
