import { readFileSync, existsSync } from "node:fs"

const requiredFiles = [
  "netlify.toml",
  "netlify/functions/health.js",
  "netlify/functions/intake.js",
  "netlify/functions/contact.js",
  "packages/app/public/contact/index.html",
  "packages/app/public/assets/7ya-forms.css",
  "packages/app/public/assets/7ya-intake.js",
  "docs/NETLIFY_FUNCTIONS_API.md",
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.error(`Missing required file: ${file}`)
    process.exit(1)
  }
}

const netlifyToml = readFileSync("netlify.toml", "utf8")
const requiredRoutes = ["/api/health", "/api/intake", "/api/contact"]

for (const route of requiredRoutes) {
  if (!netlifyToml.includes(route)) {
    console.error(`Missing Netlify route: ${route}`)
    process.exit(1)
  }
}

const health = readFileSync("netlify/functions/health.js", "utf8")
const intake = readFileSync("netlify/functions/intake.js", "utf8")
const contact = readFileSync("packages/app/public/contact/index.html", "utf8")
const client = readFileSync("packages/app/public/assets/7ya-intake.js", "utf8")

const requiredIntakeTokens = ["randomUUID", "assertJsonRequest", "json_required", "MAX_BODY_BYTES", "SEVENYA_INTAKE_WEBHOOK_URL", "SEVENYA_ALLOWED_ORIGIN", "valid_email_required", "payload_too_large", "requestId", "vary"]

for (const token of requiredIntakeTokens) {
  if (!intake.includes(token)) {
    console.error(`Missing intake guard: ${token}`)
    process.exit(1)
  }
}

const requiredHealthTokens = ["corsHeaders", "vary", "method_not_allowed"]

for (const token of requiredHealthTokens) {
  if (!health.includes(token)) {
    console.error(`Missing health guard: ${token}`)
    process.exit(1)
  }
}

const requiredUiTokens = ["data-intake-form", "data-intake-status", "/api/intake", "Email fallback", "website_url"]

for (const token of requiredUiTokens) {
  if (!(contact + client).includes(token)) {
    console.error(`Missing intake UI wiring: ${token}`)
    process.exit(1)
  }
}

console.log("Netlify Functions API runtime and intake UI validated")
