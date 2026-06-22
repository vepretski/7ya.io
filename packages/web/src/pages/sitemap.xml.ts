import { knowledgeRoutes, lastUpdated, siteOrigin } from "../data/7ya-knowledge-stream"

export async function GET() {
  const urls = knowledgeRoutes
    .map((route) => {
      return `  <url>
    <loc>${siteOrigin}${route.path}</loc>
    <lastmod>${lastUpdated}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
