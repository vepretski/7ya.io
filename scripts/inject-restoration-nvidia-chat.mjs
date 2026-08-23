import fs from "node:fs"

const target = "packages/app/public/igor-vepretski/index.html"
const marker = "/igor-vepretski/nvidia-chat.js"

if (!fs.existsSync(target)) throw new Error(`Missing Restoration+ page: ${target}`)

const html = fs.readFileSync(target, "utf8")
if (html.includes(marker)) {
  console.log("NVIDIA companion already injected")
  process.exit(0)
}

if (!html.includes("</body>")) throw new Error(`Cannot inject NVIDIA companion: ${target} has no </body>`)

const script = `  <script src="${marker}" defer></script>\n`
fs.writeFileSync(target, html.replace("</body>", `${script}</body>`))
console.log(`Injected NVIDIA companion into ${target}`)
