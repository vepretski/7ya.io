const SOURCE_REPOSITORY = "7guard-io/7ya.io"
const SOURCE_SHA = "85978c5094e9b8587492f83e26da052872854655"
const RAW_BASE = `https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${SOURCE_SHA}/`
const BUILD_ID = "igor-global-page-repair-20260718-1"

const ALIASES = new Map([
  ["about", "/igor-vepretski/"],
  ["social", "/influence/"],
  ["oracle", "/evidence/"],
  ["business", "/7ya/"],
  ["pass", "/7ya/"],
  ["member-pass", "/7ya/"],
  ["radar", "/evidence/"],
  ["work", "/#person"],
  ["systems", "/7ya/"],
  ["public-service", "/journey/"],
  ["music", "/influence/"],
  ["entity-index", "/entity/"],
  ["visual-podcast", "/media/"],
  ["blog", "/articles/"],
  ["movement", "/starton/"],
  ["empire", "/7ya/"],
])

const BLOCKED_PREFIXES = new Set(["admin"])

const MIME_TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  mjs: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  webmanifest: "application/manifest+json; charset=utf-8",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  pdf: "application/pdf",
}

const IMMUTABLE_TYPES = new Set([
  "css", "js", "mjs", "svg", "png", "jpg", "jpeg", "webp", "gif",
  "ico", "woff", "woff2", "mp3", "mp4", "pdf",
])

function extension(file) {
  const index = file.lastIndexOf(".")
  return index < 0 ? "" : file.slice(index + 1).toLowerCase()
}

function parsePath(request) {
  let url
  try {
    url = new URL(request.url || "/", "https://7ya.invalid")
  } catch {
    return null
  }

  const rawValue = url.searchParams.get("path") || ""
  const raw = rawValue.replace(/\\/g, "/").replace(/^\/+/, "")
  const segments = raw.split("/").filter(Boolean)
  if (segments.some((segment) => segment === "." || segment === ".." || segment.includes("\0"))) return null
  return { raw, normalized: segments.join("/") }
}

function routeCandidates(pathInfo) {
  if (!pathInfo?.normalized) return ["index.html"]
  if (pathInfo.raw.endsWith("/")) return [`${pathInfo.normalized}/index.html`]
  if (extension(pathInfo.normalized)) return [pathInfo.normalized]
  return [`${pathInfo.normalized}/index.html`, `${pathInfo.normalized}.html`]
}

function setBaseHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff")
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("X-7YA-Source-Repository", SOURCE_REPOSITORY)
  response.setHeader("X-7YA-Source-SHA", SOURCE_SHA)
  response.setHeader("X-7YA-Build", BUILD_ID)
}

function setResponseHeaders(response, file, statusCode) {
  const type = extension(file)
  response.statusCode = statusCode
  response.setHeader("Content-Type", MIME_TYPES[type] || "application/octet-stream")
  response.setHeader("X-7YA-Source-Path", file)
  setBaseHeaders(response)

  if (type === "html") {
    if (statusCode >= 400) {
      response.setHeader("X-Robots-Tag", "noindex, nofollow")
      response.setHeader("Cache-Control", "no-store")
    } else {
      response.setHeader("X-Robots-Tag", "index, follow")
      response.setHeader("Cache-Control", "public, max-age=0, s-maxage=0, must-revalidate")
      response.setHeader("CDN-Cache-Control", "max-age=0, must-revalidate")
      response.setHeader("Vercel-CDN-Cache-Control", "max-age=0, must-revalidate")
    }
  } else if (IMMUTABLE_TYPES.has(type)) {
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  } else {
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, must-revalidate")
  }
}

function redirect(request, response, destination) {
  response.statusCode = 308
  setBaseHeaders(response)
  response.setHeader("Location", destination)
  response.setHeader("Content-Type", "text/plain; charset=utf-8")
  response.setHeader("X-Robots-Tag", "noindex, follow")
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, must-revalidate")
  if (request.method === "HEAD") response.end()
  else response.end(`Permanent Redirect: ${destination}`)
}

function notFound(request, response) {
  response.statusCode = 404
  setBaseHeaders(response)
  response.setHeader("Content-Type", "text/plain; charset=utf-8")
  response.setHeader("X-Robots-Tag", "noindex, nofollow")
  response.setHeader("Cache-Control", "no-store")
  if (request.method === "HEAD") response.end()
  else response.end("Not Found")
}

async function fetchSource(file) {
  return fetch(`${RAW_BASE}${file}`, {
    headers: {
      "User-Agent": "7ya-global-page-repair/1.0",
      Accept: "*/*",
    },
  })
}

const GLOBAL_STYLE = String.raw`
<style id="seven-global-repair-style">
:root{--seven-ink:#080a0d;--seven-ink-2:#111419;--seven-paper:#e9dfcf;--seven-cream:#f6f1e8;--seven-gold:#d0aa6a;--seven-gold-2:#ebc98e;--seven-muted:#aaa49a;--seven-line:rgba(255,255,255,.14);--seven-serif:Georgia,"Times New Roman",serif;--seven-sans:Inter,Arial,"Noto Sans Hebrew",sans-serif}
html{scroll-behavior:smooth;background:var(--seven-ink)}body.seven-global{margin:0;background:var(--seven-ink);color:var(--seven-cream);font-family:var(--seven-sans);overflow-x:hidden}body.seven-global *{box-sizing:border-box}body.seven-global a{color:inherit}body.seven-global img{max-width:100%;height:auto}body.seven-global .hero img,body.seven-global [class*="cover"] img,body.seven-global [class*="portrait"] img{object-fit:cover}body.seven-global .seven-global-progress{position:fixed;z-index:9999;inset:0 0 auto;height:2px;background:rgba(255,255,255,.06)}body.seven-global .seven-global-progress span{display:block;width:100%;height:100%;background:var(--seven-gold-2);transform:scaleX(0);transform-origin:left}
body.seven-global.seven-subpage{padding-top:76px}body.seven-global.seven-subpage>header:not(.seven-global-header),body.seven-global.seven-subpage .site-header,body.seven-global.seven-subpage .topbar,body.seven-global.seven-subpage .header-shell{display:none!important}.seven-global-header{position:fixed;z-index:9000;inset:0 0 auto;height:76px;padding:0 clamp(18px,4vw,62px);display:flex;align-items:center;justify-content:space-between;gap:24px;background:rgba(8,10,13,.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--seven-line)}.seven-global-brand{display:flex;align-items:center;gap:12px;text-decoration:none;direction:ltr;white-space:nowrap}.seven-global-brand b{font:900 30px/1 var(--seven-serif);color:var(--seven-gold-2)}.seven-global-brand b span{color:#fff}.seven-global-brand small{font-size:8px;letter-spacing:.18em;color:#bdb6aa}.seven-global-nav{display:flex;align-items:center;gap:22px;overflow-x:auto;scrollbar-width:none}.seven-global-nav::-webkit-scrollbar{display:none}.seven-global-nav a{text-decoration:none;color:#ddd6cb;font-size:11px;white-space:nowrap}.seven-global-nav a:hover,.seven-global-nav a:focus-visible{color:var(--seven-gold-2)}.seven-global-nav .seven-global-cta{padding:10px 17px;border-radius:999px;background:var(--seven-gold);color:#090b0e;font-weight:850}
body.seven-global.seven-subpage main{display:block;min-height:70vh;background:var(--seven-ink)}body.seven-global.seven-subpage main>section,body.seven-global.seven-subpage main section,body.seven-global.seven-subpage article,body.seven-global.seven-subpage .section{position:relative}body.seven-global.seven-subpage main>section{padding:clamp(72px,9vw,132px) clamp(20px,7vw,108px);border-bottom:1px solid var(--seven-line);background:radial-gradient(circle at 78% 12%,rgba(208,170,106,.09),transparent 34%),var(--seven-ink)!important;color:var(--seven-cream)!important}body.seven-global.seven-subpage main>section:nth-of-type(even){background:var(--seven-paper)!important;color:#171717!important;border-bottom-color:rgba(23,23,23,.16)}body.seven-global.seven-subpage main>section:nth-of-type(even) *{border-color:rgba(23,23,23,.16)}body.seven-global.seven-subpage main>section:nth-of-type(even) p,body.seven-global.seven-subpage main>section:nth-of-type(even) li,body.seven-global.seven-subpage main>section:nth-of-type(even) small{color:#5b5246!important}body.seven-global.seven-subpage main>section:first-of-type{min-height:62vh;display:flex;flex-direction:column;justify-content:center;padding-top:clamp(95px,12vw,170px);background:linear-gradient(90deg,rgba(8,10,13,.98),rgba(8,10,13,.74)),radial-gradient(circle at 78% 30%,rgba(208,170,106,.2),transparent 38%),var(--seven-ink)!important;color:var(--seven-cream)!important}body.seven-global.seven-subpage h1,body.seven-global.seven-subpage h2,body.seven-global.seven-subpage h3{font-family:var(--seven-serif);letter-spacing:-.045em;text-wrap:balance}body.seven-global.seven-subpage h1{font-size:clamp(52px,8vw,124px);line-height:.92;margin:.15em 0}body.seven-global.seven-subpage h2{font-size:clamp(38px,5.5vw,82px);line-height:.98}body.seven-global.seven-subpage h3{font-size:clamp(24px,3vw,42px)}body.seven-global.seven-subpage p,body.seven-global.seven-subpage li{font-size:clamp(15px,1.4vw,19px);line-height:1.75;color:#c6c0b6}body.seven-global.seven-subpage main>section:first-of-type p{max-width:820px}body.seven-global.seven-subpage .eyebrow,body.seven-global.seven-subpage .kicker,body.seven-global.seven-subpage [class*="label"],body.seven-global.seven-subpage [class*="tag"]{color:var(--seven-gold-2)!important;letter-spacing:.14em;text-transform:uppercase;font-size:10px;font-weight:850}
body.seven-global.seven-subpage [class*="grid"],body.seven-global.seven-subpage .cards,body.seven-global.seven-subpage .list-grid{gap:16px}body.seven-global.seven-subpage article,body.seven-global.seven-subpage [class*="card"],body.seven-global.seven-subpage [class*="panel"],body.seven-global.seven-subpage [class*="tile"]{border:1px solid var(--seven-line);border-radius:0;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.012));box-shadow:none}body.seven-global.seven-subpage main>section:nth-of-type(even) article,body.seven-global.seven-subpage main>section:nth-of-type(even) [class*="card"],body.seven-global.seven-subpage main>section:nth-of-type(even) [class*="panel"]{background:rgba(255,255,255,.34)}body.seven-global.seven-subpage article,body.seven-global.seven-subpage [class*="card"]{padding:clamp(20px,2.5vw,32px)}body.seven-global.seven-subpage button,body.seven-global.seven-subpage .button,body.seven-global.seven-subpage [class*="cta"],body.seven-global.seven-subpage a[role="button"]{border-radius:999px!important;min-height:46px;padding:11px 21px;border:1px solid rgba(208,170,106,.55);background:transparent;color:var(--seven-gold-2);font-weight:850;text-decoration:none}body.seven-global.seven-subpage button:hover,body.seven-global.seven-subpage .button:hover,body.seven-global.seven-subpage [class*="cta"]:hover{transform:translateY(-2px);background:var(--seven-gold);color:#090b0e}body.seven-global.seven-subpage table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}body.seven-global.seven-subpage th,body.seven-global.seven-subpage td{padding:13px 15px;border-bottom:1px solid var(--seven-line);text-align:start}body.seven-global.seven-subpage pre,body.seven-global.seven-subpage code{max-width:100%;overflow:auto;background:#050608;color:#e9dfcf;border:1px solid var(--seven-line)}body.seven-global.seven-subpage input,body.seven-global.seven-subpage textarea,body.seven-global.seven-subpage select{width:100%;background:#0e1115;color:#fff;border:1px solid var(--seven-line);padding:14px 16px;border-radius:0}body.seven-global.seven-subpage iframe{max-width:100%;border:0}body.seven-global.seven-subpage [style*="width"] img,body.seven-global.seven-subpage [style*="height"] img{object-fit:cover}
.seven-global-footer{padding:54px clamp(20px,7vw,108px);border-top:1px solid var(--seven-line);background:#07090c;color:#8f897f}.seven-global-footer strong{display:block;color:var(--seven-gold-2);font:800 26px/1 var(--seven-serif)}.seven-global-footer p{max-width:680px;margin:12px 0 0;font-size:12px;line-height:1.65}.seven-global-footer nav{display:flex;flex-wrap:wrap;gap:18px;margin-top:24px}.seven-global-footer a{text-decoration:none;font-size:10px;letter-spacing:.1em;color:#bdb6aa}.seven-global-footer small{display:block;margin-top:30px;font-size:9px;color:#57534e;direction:ltr}
body.seven-global [data-loading],body.seven-global .loading:empty,body.seven-global .skeleton:empty{display:none!important}body.seven-global :focus-visible{outline:2px solid var(--seven-gold-2);outline-offset:3px}
@media(max-width:820px){body.seven-global.seven-subpage{padding-top:68px}.seven-global-header{height:68px;padding:0 16px}.seven-global-brand small{display:none}.seven-global-nav{gap:14px}.seven-global-nav a{font-size:10px}.seven-global-nav a:nth-child(2),.seven-global-nav a:nth-child(3),.seven-global-nav a:nth-child(4){display:none}body.seven-global.seven-subpage main>section{padding:66px 20px}body.seven-global.seven-subpage h1{font-size:clamp(48px,16vw,78px)}body.seven-global.seven-subpage [class*="grid"]{grid-template-columns:1fr!important}body.seven-global.seven-subpage img{object-position:center}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}body.seven-global *{animation:none!important;transition:none!important}}
</style>`

const GLOBAL_HEADER = String.raw`
<div class="seven-global-progress" aria-hidden="true"><span id="sevenGlobalProgress"></span></div>
<header class="seven-global-header">
  <a class="seven-global-brand" href="/" aria-label="7YA.IO — Igor Vepretski"><b>7<span>YA</span></b><small>IGOR VEPRETSKI</small></a>
  <nav class="seven-global-nav" aria-label="ניווט ראשי">
    <a href="/journey/">המסע</a>
    <a href="/starton/">StartOn</a>
    <a href="/influence/">השפעה</a>
    <a href="/evidence/">ראיות</a>
    <a href="/speaker/">במה</a>
    <a class="seven-global-cta" href="/contact/">לתיאום שיחה</a>
  </nav>
</header>`

const GLOBAL_FOOTER = String.raw`
<footer class="seven-global-footer">
  <strong>7YA.IO</strong>
  <p>המרכז הציבורי של איגור ופרצקי — אדם, StartOn, יצירה ומערכת ראיות פתוחה. כל טענה מהותית צריכה להוביל למקור, לתאריך או לסטטוס ברור.</p>
  <nav aria-label="ניווט תחתון"><a href="/">בית</a><a href="/igor-vepretski/">איגור</a><a href="/journey/">המסע</a><a href="/starton/">StartOn</a><a href="/influence/">השפעה</a><a href="/evidence/">ראיות</a><a href="/contact/">קשר</a></nav>
  <small>7YA GLOBAL PAGE REPAIR · ${BUILD_ID} · SOURCE ${SOURCE_SHA.slice(0, 12)}</small>
</footer>`

const GLOBAL_SCRIPT = String.raw`
<script id="seven-global-repair-script">
(()=>{
  const progress=document.getElementById('sevenGlobalProgress');
  const update=()=>{if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')'};
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  const placeholders=['טוען…','טוען...','טוען את מפת המערכת','טוען מדדים','טוען את מסלול ההתפתחות'];
  document.querySelectorAll('p,span,div,li').forEach(el=>{const text=(el.textContent||'').trim();if(placeholders.some(v=>text===v||text.startsWith(v))&&el.children.length===0)el.remove()});
  document.querySelectorAll('img').forEach(img=>{img.style.maxWidth='100%';if(!img.closest('.hero,[class*="cover"],[class*="portrait"]'))img.style.height='auto'});
})();
</script>`

function decorateHtml(buffer, file, statusCode) {
  if (extension(file) !== "html") return buffer
  let html = buffer.toString("utf8")
  if (!html.includes("</head>") || !html.includes("</body>")) return buffer

  const isHome = file === "index.html" && statusCode === 200
  const bodyClass = isHome ? "seven-global seven-home" : "seven-global seven-subpage"
  html = html.replace(/<meta\s+name=["']7ya-global-repair["'][^>]*>/gi, "")
  html = html.replace("</head>", `  <meta name="7ya-global-repair" content="${BUILD_ID}">\n  <meta name="7ya-source-sha" content="${SOURCE_SHA}">\n  ${GLOBAL_STYLE}\n</head>`)
  html = html.replace(/<body([^>]*)>/i, (match, attrs) => {
    const cleaned = attrs.replace(/\sclass=["'][^"']*["']/i, "")
    return `<body${cleaned} class="${bodyClass}">`
  })

  if (!isHome) html = html.replace(/<body[^>]*>/i, (match) => `${match}\n${GLOBAL_HEADER}`)
  else html = html.replace(/<body[^>]*>/i, (match) => `${match}\n<div class="seven-global-progress" aria-hidden="true"><span id="sevenGlobalProgress"></span></div>`)

  html = html.replace("</body>", `${GLOBAL_FOOTER}\n${GLOBAL_SCRIPT}\n</body>`)
  return Buffer.from(html, "utf8")
}

export default async function handler(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.statusCode = 405
    response.setHeader("Allow", "GET, HEAD")
    response.end()
    return
  }

  const pathInfo = parsePath(request)
  if (!pathInfo) {
    response.statusCode = 400
    response.setHeader("Content-Type", "application/json; charset=utf-8")
    response.end(JSON.stringify({ error: "Invalid path" }))
    return
  }

  if (pathInfo.normalized && BLOCKED_PREFIXES.has(pathInfo.normalized.split("/")[0])) {
    notFound(request, response)
    return
  }

  const alias = ALIASES.get(pathInfo.normalized.replace(/\/+$/, ""))
  if (alias) {
    redirect(request, response, alias)
    return
  }

  try {
    let upstream = null
    let servedFile = null

    for (const candidate of routeCandidates(pathInfo)) {
      const attempt = await fetchSource(candidate)
      if (attempt.ok) {
        upstream = attempt
        servedFile = candidate
        break
      }
      if (attempt.status !== 404) throw new Error(`Canonical source returned ${attempt.status} for ${candidate}`)
    }

    let statusCode = 200
    if (!upstream) {
      upstream = await fetchSource("404.html")
      servedFile = "404.html"
      statusCode = 404
    }

    if (!upstream.ok) throw new Error(`Canonical source unavailable for ${servedFile}`)

    let body = Buffer.from(await upstream.arrayBuffer())
    body = decorateHtml(body, servedFile, statusCode)
    setResponseHeaders(response, servedFile, statusCode)
    response.setHeader("Content-Length", String(body.length))

    if (request.method === "HEAD") response.end()
    else response.end(body)
  } catch (error) {
    console.error("7YA global page repair failure", error?.message || error)
    response.statusCode = 502
    setBaseHeaders(response)
    response.setHeader("Content-Type", "application/json; charset=utf-8")
    response.setHeader("Cache-Control", "no-store")
    response.end(JSON.stringify({
      error: "Canonical source temporarily unavailable",
      source_repository: SOURCE_REPOSITORY,
      source_sha: SOURCE_SHA,
      build: BUILD_ID,
    }))
  }
}
