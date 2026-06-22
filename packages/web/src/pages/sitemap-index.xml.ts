import { knowledgeRoutes, lastUpdated, siteOrigin } from "../data/7ya-knowledge-stream"

export async function GET() {
  const urls = knowledgeRoutes.map((route) => `${siteOrigin}${route.path} ${lastUpdated}`).join("\n")
  return new Response(urls + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
