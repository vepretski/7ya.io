#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, resolve } from "node:path"

const CTA_PHRASE = "Manage 7ya.io"
const CTA_LINK = "https://7ya.io"
const LANGS = ["en", "he"]
const CHANNELS = [
  ["x-post", "X / Twitter"],
  ["linkedin-post", "LinkedIn"],
  ["instagram-caption", "Instagram"],
  ["tiktok-shorts-script", "TikTok / Shorts"],
  ["newsletter-summary", "Newsletter"],
  ["blog-draft", "Blog draft"],
]
const COPY = {
  en: {
    name: "English",
    angle: "Igor Vepretski turns scattered platform activity into a managed 7ya.io content system.",
    audience: ["founders", "creators", "operators", "personal-brand builders", "bilingual audiences"],
    ctas: ["Bring the campaign back to the source.", "Route the next step through the hub.", "Keep the brand system managed.", "Use the canonical destination.", "Convert attention into owned traffic.", "Make the next action obvious."],
    hooks: ["Stop posting randomly.", "One idea can become a campaign.", "Your content should compound.", "The platform is not the strategy.", "Turn attention into a system.", "A personal brand needs a control plane."],
  },
  he: {
    name: "Hebrew",
    angle: "איגור ופרצקי הופך פעילות מפוזרת בפלטפורמות למערכת תוכן מנוהלת סביב 7ya.io.",
    audience: ["יזמים", "יוצרים", "מפעילים", "בוני מותג אישי", "קהל דו-לשוני"],
    ctas: ["להחזיר את הקמפיין למקור.", "להוביל את הצעד הבא דרך המרכז.", "לשמור על מערכת המותג מנוהלת.", "להשתמש ביעד הקנוני.", "להפוך תשומת לב לתנועה בבעלותך.", "להפוך את הפעולה הבאה לברורה."],
    hooks: ["להפסיק לפרסם באקראי.", "רעיון אחד יכול להפוך לקמפיין.", "התוכן שלך צריך להצטבר.", "הפלטפורמה היא לא האסטרטגיה.", "להפוך תשומת לב למערכת.", "מותג אישי צריך מרכז שליטה."],
  },
}

function args(argv) {
  const out = { lang: "both", out: "./outputs/personal-brand-booster" }
  for (let i = 0; i < argv.length; i++) {
    if (["--source", "--lang", "--out"].includes(argv[i])) out[argv[i].slice(2)] = argv[++i]
  }
  if (!out.source) throw new Error("Missing required --source <path> argument.")
  if (!["en", "he", "both"].includes(out.lang)) throw new Error(`Unsupported --lang value: ${out.lang}. Use en, he, or both.`)
  return out
}
const languages = (lang) => (lang === "both" ? ["en", "he"] : [lang])
const clean = (s) => s.replace(/\r\n/g, "\n").replace(/```[\s\S]*?```/g, " ").replace(/`([^`]+)`/g, "$1").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^>\s?/gm, "").replace(/[*_~]/g, "").replace(/[ \t]+/g, " ").trim()
const short = (s, fallback = "") => {
  const v = clean(s || "").replace(/\s+/g, " ").trim()
  return v.length > 180 ? `${v.slice(0, 177).trim()}...` : v || fallback
}
const uniq = (items) => [...new Map(items.filter(Boolean).map((v) => [v.toLowerCase(), v])).values()]

function titleOf(text, source) {
  const h1 = text.match(/^#\s+(.+)$/m)
  if (h1) return short(h1[1], basename(source))
  return short(text.split("\n").map((x) => short(x)).find(Boolean), basename(source))
}
function claimsOf(text) {
  const bullets = text.split("\n").map((l) => short(l.replace(/^\s*[-*+]\s+/, "").replace(/^\s*\d+[.)]\s+/, ""))).filter((l) => l.length >= 24)
  const sentences = clean(text).split(/(?<=[.!?])\s+|\n+/).map((l) => short(l)).filter((l) => l.length >= 36)
  return uniq([...bullets, ...sentences]).slice(0, 6)
}
function hookBank(title, thesis, lang = "en") {
  const en = [
    `What changes when ${title} becomes the system?`,
    `The hidden cost of treating ${title} as a one-off idea.`,
    "A sharper way to turn one source into many assets.",
    "Most personal brands do not need more noise. They need a control plane.",
    "If your best idea only becomes one post, the system is leaking value.",
    "One source item should create more than one moment of attention.",
    "The fastest way to look consistent is to make the workflow consistent.",
    "A bilingual brand needs bilingual distribution by default.",
    "Every channel should carry the same strategic spine.",
    "The CTA is not decoration. It is the route back to the business.",
    "This is how one note becomes a seven-day campaign.",
    "Repurposing is not copying. It is translating intent by platform.",
    "A content system beats a burst of motivation.",
    "The goal is aggressive visibility without spam.",
    "Your source material already contains the campaign.",
    "The best posts are not isolated. They are connected.",
    "Make the message travel without changing the destination.",
    "The brand gets stronger when the path is predictable.",
    `Turn ${thesis} into a repeatable distribution engine.`,
    "Build once. Publish intelligently. Route everything home.",
    "English and Hebrew should ship together, not as an afterthought.",
    "Six platform assets from one idea is the new minimum viable campaign.",
    "Do not scale posting. Scale the system behind posting.",
    "The audience should always know where to go next.",
  ]
  const he = [
    `איך הופכים את ${title} למערכת הפצה?`, "המחיר הסמוי של רעיון שנשאר כפוסט אחד.", "הדרך להפוך מקור אחד לנכסים לכל פלטפורמה.", "מותג אישי לא צריך יותר רעש. הוא צריך מרכז שליטה.", "אם הרעיון הכי טוב שלך מתפרסם פעם אחת בלבד, הערך בורח.", "מקור אחד צריך ליצור יותר מרגע אחד של תשומת לב.", "עקביות מתחילה בתהליך, לא בהשראה.", "מותג דו-לשוני צריך הפצה דו-לשונית כברירת מחדל.", "כל ערוץ צריך לשאת את אותה אסטרטגיה.", "ה-CTA הוא המסלול העסקי, לא קישוט.", "כך הערה אחת הופכת לקמפיין של שבעה ימים.", "מחזור תוכן הוא תרגום כוונה לפי פלטפורמה.", "מערכת תוכן מנצחת פרץ מוטיבציה.", "המטרה היא נראות אגרסיבית בלי ספאם.", "המקור כבר מכיל את הקמפיין.", "הפוסטים הכי חזקים לא מבודדים. הם מחוברים.", "להעביר את המסר בלי לשנות את היעד.", "המותג מתחזק כשהמסלול צפוי.", "לבנות פעם אחת, לפרסם חכם, ולהחזיר הכול הביתה.", "אנגלית ועברית צריכות לצאת יחד.", "שש פלטפורמות מרעיון אחד הן בסיס קמפיין מינימלי.", "לא להגדיל רק פרסום. להגדיל את המערכת שמאחוריו.", "הקהל תמיד צריך לדעת לאן ללכת עכשיו.", "כל נכס צריך לחזק את אותו מרכז." ]
  return uniq(lang === "he" ? he : en).slice(0, 24)
}
function briefOf(text, source) {
  const title = titleOf(text, source)
  const claims = claimsOf(text)
  const thesis = claims[0] || `Use ${title} as a source item for a coordinated personal-brand campaign.`
  const proof = uniq([...text.split("\n").map((l) => short(l)).filter((l) => /\d|%|proof|result|case|example|because|track|metric|conversion|traffic|CTA|https?:\/\//i.test(l)), ...claims]).slice(0, 5)
  return { source_title: title, one_line_thesis: thesis, key_claims: claims.length ? claims : [thesis], personal_brand_angle: COPY.en.angle, audience: COPY.en.audience, proof_points: proof.length ? proof : [thesis], reusable_hooks: hookBank(title, thesis).slice(0, 10), source_reference: source }
}
const cta = (intro) => `${intro}\n${CTA_PHRASE}\n${CTA_LINK}`
function body(id, lang, b) {
  const claims = b.key_claims.slice(0, 3).map((x) => `- ${x}`).join("\n")
  const proof = b.proof_points[0] || b.one_line_thesis
  if (lang === "he") {
    if (id === "x-post") return `רעיון אחד יכול להפוך לקמפיין.\n\n${b.one_line_thesis}\n\nהמהלך: לקחת מקור אחד, להפוך אותו לנכסים לפי פלטפורמה, ולשמור על יעד אחד ברור.`
    if (id === "linkedin-post") return `מותג אישי לא נבנה מפוסטים מנותקים. הוא נבנה ממערכת.\n\nהמקור: ${b.source_title}\n\nהתזה: ${b.one_line_thesis}\n\nמה יוצא מזה:\n${claims}\n\nהזווית של 7ya.io: להפוך רעיון אחד לחבילת הפצה עקבית, דו-לשונית, ולא ספאמית.`
    if (id === "instagram-caption") return `רעיון אחד. מערכת אחת. הרבה יותר נראות.\n\n${b.one_line_thesis}\n\nבמקום לפרסם עוד פוסט בודד, הופכים את המקור לנכסים שמתאימים לכל פלטפורמה.\n\n#7YA #IgorVepretski #PersonalBrand #ContentSystem`
    if (id === "tiktok-shorts-script") return `פתיחה: "אם רעיון טוב הופך רק לפוסט אחד, אתה מפסיד את רוב הערך שלו."\n\nגוף: ${b.one_line_thesis}\n\nהוכחה: ${proof}\n\nסיום: "בונים מערכת שמחזירה כל תשומת לב למרכז אחד."`
    if (id === "newsletter-summary") return `נושא: איך להפוך מקור אחד לקמפיין אישי של 7 ימים\n\nהסיכום: ${b.one_line_thesis}\n\nהמהלך המעשי:\n${claims}\n\nהלקח: תוכן טוב צריך מסלול הפצה, לא רק רגע פרסום.`
    return `# ${b.source_title}\n\nמותג אישי חזק צריך מערכת שחוזרת על עצמה. המקור הזה מצביע על תזה פשוטה: ${b.one_line_thesis}\n\n## למה זה משנה\n\n${claims}\n\n## הזווית של איגור ופרצקי / 7ya.io\n\n${COPY.he.angle}\n\n## מה עושים עכשיו\n\nלוקחים מקור אחד, מייצרים נכסים לפי פלטפורמה, מפרסמים לאורך שבעה ימים, ושומרים על CTA אחד ברור.`
  }
  if (id === "x-post") return `One idea can become a campaign.\n\n${b.one_line_thesis}\n\nThe move: turn one source into platform-native assets, keep the message sharp, and route every next step to one hub.`
  if (id === "linkedin-post") return `A personal brand is not built from disconnected posts. It is built from a system.\n\nSource: ${b.source_title}\n\nThesis: ${b.one_line_thesis}\n\nWhat this creates:\n${claims}\n\nThe 7ya.io angle: one source becomes a coordinated, bilingual, non-spammy promotion package.`
  if (id === "instagram-caption") return `One idea. One system. More visibility.\n\n${b.one_line_thesis}\n\nInstead of publishing another isolated post, turn the source into platform-fit assets that reinforce the same destination.\n\n#7YA #IgorVepretski #PersonalBrand #ContentSystem`
  if (id === "tiktok-shorts-script") return `Hook: "If a strong idea becomes only one post, most of its value is wasted."\n\nBody: ${b.one_line_thesis}\n\nProof: ${proof}\n\nClose: "Build a system that routes every moment of attention back to one hub."`
  if (id === "newsletter-summary") return `Subject: How to turn one source into a 7-day personal-brand campaign\n\nSummary: ${b.one_line_thesis}\n\nThe practical move:\n${claims}\n\nTakeaway: good content needs a distribution path, not just a publish moment.`
  return `# ${b.source_title}\n\nA strong personal brand needs a repeatable system. This source points to a simple thesis: ${b.one_line_thesis}\n\n## Why it matters\n\n${claims}\n\n## Igor Vepretski / 7ya.io angle\n\n${COPY.en.angle}\n\n## What happens next\n\nTake one source, generate platform-native assets, publish across seven days, and keep one clear CTA throughout the campaign.`
}
function platformMd(channel, lang, b, i) {
  return `channel: ${channel[1]}\nlanguage: ${lang}\ntitle/hook: ${COPY[lang].hooks[i % COPY[lang].hooks.length]}\n\nbody:\n${body(channel[0], lang, b)}\n\nCTA:\n${cta(COPY[lang].ctas[i % COPY[lang].ctas.length])}\n\nsource reference: ${b.source_reference}\n`
}
function campaign(b, langs) {
  return { campaign_name: `Personal Brand Booster - ${b.source_title}`, source_reference: b.source_reference, languages: langs, channels: CHANNELS.map((c) => c[1]), strategy: { positioning: b.personal_brand_angle, audience: b.audience, promotion_style: "aggressive but non-spammy", cta_policy: { required_phrase: CTA_PHRASE, required_link: CTA_LINK } }, assets: langs.flatMap((l) => CHANNELS.map((c) => `${l}-${c[0]}.md`)), seven_day_plan: ["Anchor thesis", "Short hook", "Visual caption", "Video script", "Owned audience", "Long-form authority", "Recap and CTA reinforcement"].map((focus, i) => ({ day: i + 1, focus, assets: i === 6 ? langs.flatMap((l) => [`${l}-x-post.md`, `${l}-linkedin-post.md`]) : langs.map((l) => `${l}-${CHANNELS[[1,0,2,3,4,5][i]][0]}.md`) })) }
}
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
function validation(outDir, langs) {
  const files = langs.flatMap((l) => CHANNELS.map((c) => `${l}-${c[0]}.md`))
  const results = files.map((file) => {
    const full = resolve(outDir, file), content = existsSync(full) ? readFileSync(full, "utf-8") : "", language = content.match(/^language:\s*(\S+)\s*$/m)?.[1] || ""
    const checks = { file_exists: existsSync(full), file_is_not_empty: content.trim().length > 0, cta_phrase_present: content.includes(CTA_PHRASE), cta_link_present: content.includes(CTA_LINK), channel_present: /^channel:\s*\S.+$/m.test(content), language_present: /^language:\s*\S+\s*$/m.test(content), supported_language: LANGS.includes(language) }
    return { file, status: Object.values(checks).every(Boolean) ? "pass" : "fail", language, checks }
  })
  return { status: results.every((r) => r.status === "pass") ? "pass" : "fail", cta_policy: { required_phrase: CTA_PHRASE, required_link: CTA_LINK }, files: results }
}
function main() {
  const a = args(process.argv.slice(2)), langs = languages(a.lang), out = resolve(a.out)
  if (!existsSync(a.source)) throw new Error(`Source file not found: ${a.source}`)
  mkdirSync(out, { recursive: true })
  const b = briefOf(readFileSync(a.source, "utf-8"), a.source), plan = campaign(b, langs)
  writeJson(resolve(out, "brief.json"), b)
  writeJson(resolve(out, "campaign-plan.json"), plan)
  langs.forEach((l) => CHANNELS.forEach((c, i) => writeFileSync(resolve(out, `${l}-${c[0]}.md`), platformMd(c, l, b, i))))
  writeFileSync(resolve(out, "daily-posting-plan.md"), `# 7-Day Posting Plan\n\nSource reference: ${b.source_reference}\n\n${plan.seven_day_plan.map((d) => `## Day ${d.day}: ${d.focus}\n\nAssets:\n${d.assets.map((x) => `- ${x}`).join("\n")}\n\nCTA policy: ${CTA_PHRASE} + ${CTA_LINK}`).join("\n\n")}\n`)
  writeFileSync(resolve(out, "hook-bank.md"), `# Hook Bank\n\nAt least 20 deterministic hooks generated from the same source item.\n\n${langs.map((l) => `## ${COPY[l].name}\n\n${hookBank(b.source_title, b.one_line_thesis, l).map((h, i) => `${i + 1}. ${h}`).join("\n")}`).join("\n\n")}\n`)
  writeFileSync(resolve(out, "cta-bank.md"), `# CTA Bank\n\nEvery CTA variant includes the required phrase and link.\n\n${langs.flatMap((l) => COPY[l].ctas.map((x, i) => `## ${l.toUpperCase()} CTA ${i + 1}\n\n${cta(x)}`)).join("\n\n")}\n`)
  writeFileSync(resolve(out, "repurposing-map.md"), `# Repurposing Map\n\nSource: ${b.source_reference}\n\n| Source asset | Feeds | Purpose |\n| --- | --- | --- |\n| brief.json | all generated files | shared thesis, claims, hooks, proof points |\n| campaign-plan.json | daily-posting-plan.md | campaign sequencing and channel coverage |\n| hook-bank.md | X / Twitter, LinkedIn, TikTok / Shorts | opening angles and short-form hooks |\n| cta-bank.md | every platform markdown file | enforced CTA phrase and link |\n| blog drafts | Newsletter, LinkedIn, short scripts | long-form authority source |\n| tiktok shorts scripts | TikTok, Shorts, Reels | short video execution |\n| instagram captions | Instagram, Reels captions | visual/social captioning |\n| x posts | X / Twitter, recap posts | short public repetition |\n`)
  writeFileSync(resolve(out, "README.md"), `# Personal Brand Booster Output\n\nSource: ${b.source_reference}\n\nDeterministic personal-brand promotion package for Igor Vepretski / 7ya.io.\n\n## Languages\n\n${langs.map((l) => `- ${l} (${COPY[l].name})`).join("\n")}\n\n## Required CTA\n\n${CTA_PHRASE}\n${CTA_LINK}\n`)
  const v = validation(out, langs)
  writeJson(resolve(out, "validation.json"), v)
  if (v.status !== "pass") process.exitCode = 1
  console.log(`personal-brand:boost ${v.status}`)
  console.log(`output: ${a.out}`)
}
main()
