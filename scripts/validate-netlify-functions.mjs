import { readFileSync, existsSync } from "node:fs"

const requiredFiles = [
  "netlify.toml",
  "netlify/functions/health.js",
  "netlify/functions/intake.js",
  "netlify/functions/contact.js",
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

const intake = readFileSync("netlify/functions/intake.js", "utf8")
const requiredIntakeTokens = [
  "MAX_BODY_BYTES",
  "SEVENYA_INTAKE_WEBHOOK_URL",
  "SEVENYA_ALLOWED_ORIGIN",
  "valid_email_required",
  "payload_too_large",
  "requestId",
]

for (const token of requiredIntakeTokens) {
  if (!intake.includes(token)) {
    console.error(`Missing intake guard: ${token}`)
    process.exit(1)
  }
}

if (/sk-[A-Za-z0-9]|AIza[0-9A-Za-z_-]{20,}|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/.test(intake + netlifyToml)) {
  console.error("Potential secret committed in Netlify API files")
  process.exit(1)
}

console.log("Netlify Functions API scaffold validated")
