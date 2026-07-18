const payload = {
  release_id: "igor-global-page-repair-20260718-1",
  production_repository: "vepretski/7ya.io",
  production_branch: "dev",
  canonical_repository: "7guard-io/7ya.io",
  canonical_source_sha: "85978c5094e9b8587492f83e26da052872854655",
  experience: "IGOR_VEPRETSKI_PERSONAL_LIFE_ALBUM",
  scope: "ALL_PUBLIC_PAGES",
  canonical_url: "https://7ya.io/",
  design: {
    palette: ["core black", "pure white", "metallic warm gold", "cream"],
    style: "cinematic editorial personal life album",
    rtl: true,
    mobile_first: true,
    image_policy: "no stretching; preserve aspect ratio; cover only in designated hero and portrait surfaces",
  },
  repairs: {
    shared_navigation: true,
    shared_footer: true,
    global_typography: true,
    responsive_layout: true,
    placeholder_removal: true,
    canonical_redirects: true,
    source_headers: true,
    no_admin_surface: true,
  },
  critical_routes: [
    "/", "/igor-vepretski/", "/journey/", "/starton/", "/influence/",
    "/media/", "/articles/", "/evidence/", "/speaker/", "/talk/",
    "/contact/", "/museum/", "/history/", "/entity/", "/create/",
    "/7ya/", "/response-ai/", "/robots.txt", "/sitemap.xml"
  ],
  aliases: {
    "/about/": "/igor-vepretski/",
    "/social/": "/influence/",
    "/pass/": "/7ya/",
    "/radar/": "/evidence/",
    "/visual-podcast/": "/media/",
    "/blog/": "/articles/",
    "/movement/": "/starton/",
    "/empire/": "/7ya/"
  },
  rollback_branch: "rollback/pre-global-page-repair-20260718",
  status: "MERGE_AND_LIVE_VERIFICATION_REQUIRED",
  generated_at: "2026-07-18T16:20:00+03:00"
}

export default function handler(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.statusCode = 405
    response.setHeader("Allow", "GET, HEAD")
    response.end()
    return
  }

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=0, must-revalidate")
  response.setHeader("CDN-Cache-Control", "max-age=0, must-revalidate")
  response.setHeader("Vercel-CDN-Cache-Control", "max-age=0, must-revalidate")
  response.setHeader("X-Content-Type-Options", "nosniff")
  response.setHeader("X-7YA-Source-SHA", payload.canonical_source_sha)
  response.setHeader("X-7YA-Build", payload.release_id)

  if (request.method === "HEAD") response.end()
  else response.end(JSON.stringify(payload, null, 2))
}
