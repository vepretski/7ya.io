import { articles, lastUpdated, siteOrigin } from "../data/7ya-knowledge-stream"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const items = articles
    .map((article) => {
      const url = `${siteOrigin}${article.href}`
      return `<item>
  <title>${escapeXml(article.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(article.date).toUTCString()}</pubDate>
  <description>${escapeXml(article.description)}</description>
  <category>${escapeXml(article.category)}</category>
</item>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>7YA Knowledge Stream</title>
  <link>${siteOrigin}/articles</link>
  <description>Official articles, evidence notes, public updates, media intelligence, StartOn, and #7YA documentation.</description>
  <lastBuildDate>${new Date(lastUpdated).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>
`

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
