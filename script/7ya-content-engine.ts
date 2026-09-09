#!/usr/bin/env bun
/**
 * 7YA Content Engine
 *
 * Turns a verified source packet into bilingual content, a conversion-aware
 * Telegram distribution package, and a local measurement/learning loop.
 * It is deliberately approval-gated: the engine can prepare and learn, but it
 * never publishes drafts or political/public-affairs content automatically.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, resolve } from "node:path"

type Language = "he" | "en"
type Status = "draft" | "approved" | "published"
type Source = { title: string; text: string; reference: string }
type Asset = { language: Language; telegram: string; article: string; shortPosts: string[] }
type Campaign = {
  id: string
  createdAt: string
  status: Status
  source: Source[]
  framework: string
  goal: string
  cta: { label: string; url: string }
  assets: Asset[]
  publication?: { telegramMessageIds: string[]; publishedAt: string }
  metrics?: Metrics
}
type Metrics = { impressions?: number; views?: number; clicks?: number; subscribers?: number; leads?: number; conversions?: number }
type State = { campaigns: Campaign[] }

const DEFAULT_OUT = "./outputs/content-ops"
const DEFAULT_BASE_URL = "https://7ya.io"
const FRAMEWORK = "PULSE: Problem → User stakes → Lens → Story → Evidence → Next step"
const argv = process.argv.slice(2)

function option(name: string, fallback?: string) {
  const index = argv.indexOf(`--${name}`)
  return index === -1 ? fallback : argv[index + 1]
}
function flag(name: string) { return argv.includes(`--${name}`) }
function required(name: string) {
  const value = option(name)
  if (!value) throw new Error(`Missing --${name}`)
  return value
}
function clean(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/```[\s\S]*?```/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^>\s?/gm, "").replace(/[*_~]/g, "").replace(/[ \t]+/g, " ").trim()
}
function compact(value: string, max = 320) { const v = clean(value); return v.length > max ? `${v.slice(0, max - 1).trim()}…` : v }
function slug(value: string) { return clean(value).toLowerCase().replace(/[^a-z0-9א-ת]+/gi, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "campaign" }
function safeRead(path: string) { if (!existsSync(path)) throw new Error(`File not found: ${path}`); return readFileSync(path, "utf8") }
function json<T>(path: string, fallback: T): T { return existsSync(path) ? JSON.parse(safeRead(path)) as T : fallback }
function write(path: string, value: string) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, value) }
function writeJson(path: string, value: unknown) { write(path, `${JSON.stringify(value, null, 2)}\n`) }
function sourceFrom(path: string): Source {
  const text = safeRead(path)
  const title = text.match(/^#\s+(.+)$/m)?.[1] || basename(path).replace(/\.[^.]+$/, "")
  return { title: compact(title, 120), text, reference: path }
}
function evidence(source: Source) {
  const lines = source.text.split("\n").map(line => compact(line, 260)).filter(line => line.length > 35)
  const numerical = lines.filter(line => /\d|%|https?:\/\//.test(line))
  return [...new Set([...numerical, ...lines])].slice(0, 6)
}
function sourceDigest(sources: Source[]) {
  return sources.map(source => `SOURCE: ${source.title}\nREFERENCE: ${source.reference}\n${clean(source.text)}`).join("\n\n---\n\n")
}
function trackedUrl(baseUrl: string, campaignId: string, language: Language, content: string) {
  const join = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${join}utm_source=telegram&utm_medium=community&utm_campaign=${encodeURIComponent(campaignId)}&utm_content=${encodeURIComponent(`${language}-${content}`)}`
}
function languageList() { const lang = option("lang", "both"); if (!(["he", "en", "both"] as string[]).includes(lang)) throw new Error("--lang must be he, en, or both"); return lang === "both" ? ["he", "en"] as Language[] : [lang as Language] }
function selectLearning(state: State) {
  const published = state.campaigns.filter(c => c.status === "published" && c.metrics)
  const scored = published.map(c => {
    const m = c.metrics || {}; const reach = m.impressions || m.views || 0
    const clickRate = reach ? (m.clicks || 0) / reach : 0
    const conversionRate = (m.clicks || 0) ? (m.conversions || m.leads || 0) / (m.clicks || 1) : 0
    return { c, score: clickRate * 0.55 + conversionRate * 0.45 }
  }).sort((a, b) => b.score - a.score)
  if (!scored[0]) return "No historical campaign data yet. Start with a single, concrete promise and one clear next step."
  return `Use the strongest prior pattern: “${scored[0].c.goal}”. Its measured composite score was ${scored[0].score.toFixed(3)}. Preserve its level of specificity, then test one new hook.`
}

function localAsset(language: Language, sources: Source[], goal: string, ctaUrl: string, learning: string): Asset {
  const primary = sources[0]
  const proof = evidence(primary)
  const claim = proof[0] || compact(primary.text, 220)
  const sourceNotes = sources.map(s => `- ${s.title} (${s.reference})`).join("\n")
  if (language === "he") {
    return {
      language,
      telegram: `*${primary.title}*\n\nלא עוד פוסט שנעלם. זהו מהלך שמחבר סיפור, ראיות וצעד מעשי.\n\n${claim}\n\nהמסגרת: ${FRAMEWORK}\n\nמה חשוב עכשיו: ${goal}\n\n[להמשך המלא](${ctaUrl})`,
      article: `# ${primary.title}\n\n## הבעיה\n\nתוכן מפוזר יוצר רגעים — לא נכס מצטבר.\n\n## למה זה נוגע לאנשים\n\n${goal}\n\n## העדשה\n\n${FRAMEWORK}. כל טענה נשענת על חומר המקור המצורף; אין כאן הוספת עובדות מבחוץ.\n\n## הסיפור והראיות\n\n${proof.map(item => `- ${item}`).join("\n")}\n\n## הצעד הבא\n\n[להעמקה ולפעולה](${ctaUrl})\n\n## מקורות\n\n${sourceNotes}\n\n## למידה מקמפיינים קודמים\n\n${learning}`,
      shortPosts: [
        `רעיון טוב לא אמור להיגמר בפוסט אחד. ${compact(claim, 180)}\n\nההמשך: ${ctaUrl}`,
        `המסגרת שלנו: בעיה → משמעות לאנשים → עדשה → סיפור → ראיות → צעד הבא.\n\n${compact(goal, 170)}\n${ctaUrl}`,
      ],
    }
  }
  return {
    language,
    telegram: `*${primary.title}*\n\nThis is not another isolated post. It connects a story, evidence, and one practical next step.\n\n${claim}\n\nFramework: ${FRAMEWORK}\n\nWhat matters now: ${goal}\n\n[Read the full piece](${ctaUrl})`,
    article: `# ${primary.title}\n\n## The problem\n\nScattered content creates moments, not a compounding asset.\n\n## Why people should care\n\n${goal}\n\n## The lens\n\n${FRAMEWORK}. Every claim below is grounded in the supplied source packet; this engine does not add external facts.\n\n## Story and evidence\n\n${proof.map(item => `- ${item}`).join("\n")}\n\n## Next step\n\n[Read and act](${ctaUrl})\n\n## Sources\n\n${sourceNotes}\n\n## What the measurement loop says\n\n${learning}`,
    shortPosts: [
      `A strong idea should not end as one post. ${compact(claim, 180)}\n\nContinue: ${ctaUrl}`,
      `Our frame: Problem → stakes → lens → story → evidence → next step.\n\n${compact(goal, 170)}\n${ctaUrl}`,
    ],
  }
}

function policyCheck(campaign: Campaign) {
  const allText = campaign.assets.flatMap(a => [a.telegram, a.article, ...a.shortPosts]).join("\n")
  const sourceWords = new Set(clean(sourceDigest(campaign.source)).toLowerCase().split(/\s+/).filter(x => x.length > 5))
  const numbers = allText.match(/\b\d+(?:[.,]\d+)?%?\b/g) || []
  const unknownNumbers = numbers.filter(n => !sourceDigest(campaign.source).includes(n))
  return {
    pass: unknownNumbers.length === 0,
    checks: {
      sources_present: campaign.source.length > 0,
      tracked_cta_present: campaign.assets.every(asset => asset.telegram.includes("utm_source=telegram")),
      no_unattributed_numbers: unknownNumbers.length === 0,
      approval_required_before_publish: true,
    },
    warnings: unknownNumbers.length ? [`Numbers not found in the source packet: ${unknownNumbers.join(", ")}`] : [],
  }
}

async function aiRewrite(campaign: Campaign) {
  if (!process.env.OPENAI_API_KEY || flag("no-ai")) return campaign
  const model = option("model", "gpt-5-mini")
  const prompt = `You are a meticulous bilingual editor for Igor Vepretski / 7YA. Improve only clarity, structure, and platform fit of the JSON campaign assets below. Preserve URLs exactly. Do not introduce facts, people, dates, statistics, legal claims, or sources not contained in SOURCE PACKET. Keep all source notes. Return only valid JSON with an assets array matching this schema: [{language,telegram,article,shortPosts}].\n\nSOURCE PACKET:\n${sourceDigest(campaign.source)}\n\nCAMPAIGN:\n${JSON.stringify(campaign)}`
  const response = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com"}/v1/responses`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, input: prompt, text: { format: { type: "json_object" } } }),
  })
  if (!response.ok) throw new Error(`AI rewrite failed: ${response.status}`)
  const data = await response.json() as { output_text?: string }
  const result = JSON.parse(data.output_text || "{}") as { assets?: Asset[] }
  if (!result.assets?.length || result.assets.some(a => !a.telegram || !a.article || !a.shortPosts?.length)) throw new Error("AI rewrite returned an invalid asset package")
  campaign.assets = result.assets
  return campaign
}

function statePath(out: string) { return resolve(out, "state.json") }
function campaignDir(out: string, id: string) { return resolve(out, "campaigns", id) }
function saveCampaign(out: string, state: State, campaign: Campaign) {
  const index = state.campaigns.findIndex(c => c.id === campaign.id)
  if (index === -1) state.campaigns.push(campaign); else state.campaigns[index] = campaign
  writeJson(statePath(out), state)
  const folder = campaignDir(out, campaign.id)
  writeJson(resolve(folder, "campaign.json"), campaign)
  writeJson(resolve(folder, "quality.json"), policyCheck(campaign))
  for (const asset of campaign.assets) {
    write(resolve(folder, `${asset.language}-telegram.md`), asset.telegram + "\n")
    write(resolve(folder, `${asset.language}-article.md`), asset.article + "\n")
    write(resolve(folder, `${asset.language}-short-posts.md`), asset.shortPosts.join("\n\n---\n\n") + "\n")
  }
}
function findCampaign(state: State, id: string) { const campaign = state.campaigns.find(c => c.id === id); if (!campaign) throw new Error(`Campaign not found: ${id}`); return campaign }

async function sendTelegram(text: string, cta: Campaign["cta"]) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHANNEL_ID
  if (!token || !chatId) throw new Error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID before publishing.")
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: false, reply_markup: { inline_keyboard: [[{ text: cta.label, url: cta.url }]] } }),
  })
  if (!response.ok) throw new Error(`Telegram publish failed: ${response.status}`)
  const data = await response.json() as { ok?: boolean; result?: { message_id?: number } }
  if (!data.ok || !data.result?.message_id) throw new Error("Telegram did not return a message id")
  return String(data.result.message_id)
}

async function prepare(out: string) {
  const sourcePaths = argv.filter((value, index) => argv[index - 1] === "--source")
  if (!sourcePaths.length) throw new Error("Use --source <file>; repeat --source to combine multiple verified sources.")
  const state = json<State>(statePath(out), { campaigns: [] })
  const sources = sourcePaths.map(sourceFrom)
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  const id = option("id", `${date}-${slug(sources[0].title)}`)
  if (state.campaigns.some(c => c.id === id)) throw new Error(`Campaign ${id} already exists. Use --id to choose a new one.`)
  const base = option("base-url", DEFAULT_BASE_URL)!
  const goal = option("goal", "Move the audience from attention to a useful next action on 7ya.io.")!
  const learning = selectLearning(state)
  const assets = languageList().map(language => localAsset(language, sources, goal, trackedUrl(base, id, language, "telegram"), learning))
  let campaign: Campaign = { id, createdAt: new Date().toISOString(), status: "draft", source: sources, framework: FRAMEWORK, goal, cta: { label: option("cta-label", "Continue on 7YA")!, url: trackedUrl(base, id, "en", "telegram") }, assets }
  campaign = await aiRewrite(campaign)
  const quality = policyCheck(campaign)
  if (!quality.pass) throw new Error(`Quality gate failed: ${quality.warnings.join("; ")}`)
  saveCampaign(out, state, campaign)
  console.log(JSON.stringify({ status: "draft_created", id, folder: campaignDir(out, id), approval_required: true, quality }))
}
function approve(out: string) {
  const state = json<State>(statePath(out), { campaigns: [] }); const campaign = findCampaign(state, required("id"))
  const quality = policyCheck(campaign); if (!quality.pass) throw new Error(`Quality gate failed: ${quality.warnings.join("; ")}`)
  campaign.status = "approved"; saveCampaign(out, state, campaign)
  console.log(JSON.stringify({ status: "approved", id: campaign.id }))
}
async function publish(out: string) {
  if (!flag("confirm")) throw new Error("Publishing is intentional. Re-run with --confirm after reviewing the approved package.")
  const state = json<State>(statePath(out), { campaigns: [] }); const campaign = findCampaign(state, required("id"))
  if (campaign.status !== "approved") throw new Error("Only approved campaigns can be published.")
  const messageIds: string[] = []
  for (const asset of campaign.assets) messageIds.push(await sendTelegram(asset.telegram, campaign.cta))
  campaign.status = "published"; campaign.publication = { telegramMessageIds: messageIds, publishedAt: new Date().toISOString() }
  saveCampaign(out, state, campaign); console.log(JSON.stringify({ status: "published", id: campaign.id, messageIds }))
}
function feedback(out: string) {
  const state = json<State>(statePath(out), { campaigns: [] }); const campaign = findCampaign(state, required("id")); const path = required("metrics")
  const metrics = JSON.parse(safeRead(path)) as Metrics
  campaign.metrics = metrics; saveCampaign(out, state, campaign)
  const reach = metrics.impressions || metrics.views || 0
  const report = { id: campaign.id, ctr: reach ? ((metrics.clicks || 0) / reach) : null, click_to_conversion: metrics.clicks ? ((metrics.conversions || metrics.leads || 0) / metrics.clicks) : null, next_test: "Keep the winning subject; test exactly one variable next: first-line hook, CTA label, or destination." }
  writeJson(resolve(campaignDir(out, campaign.id), "measurement.json"), report); console.log(JSON.stringify(report))
}
function report(out: string) {
  const state = json<State>(statePath(out), { campaigns: [] })
  const rows = state.campaigns.map(c => ({ id: c.id, status: c.status, goal: c.goal, metrics: c.metrics || null }))
  writeJson(resolve(out, "portfolio-report.json"), { generatedAt: new Date().toISOString(), learning: selectLearning(state), campaigns: rows })
  console.log(JSON.stringify({ campaigns: rows.length, learning: selectLearning(state), report: resolve(out, "portfolio-report.json") }))
}

const command = argv[0]
const out = resolve(option("out", DEFAULT_OUT)!)
if (command === "prepare") await prepare(out)
else if (command === "approve") approve(out)
else if (command === "publish") await publish(out)
else if (command === "feedback") feedback(out)
else if (command === "report") report(out)
else throw new Error("Usage: content:prepare | content:approve | content:publish | content:feedback | content:report")
