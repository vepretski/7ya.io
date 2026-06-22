export async function GET() {
  return new Response(`# 7YA Knowledge Stream\n\nOfficial source for Igor Vepretski, #7YA, StartOn, evidence notes, and public knowledge routes.\n\n- https://7ya.io/igor-vepretski — Canonical Igor Vepretski profile\n- https://7ya.io/articles — 7YA Knowledge Stream archive\n- https://7ya.io/articles/igor-vepretski-7ya-origin — First official founder story\n- https://7ya.io/evidence — Evidence and verification archive\n- https://7ya.io/starton — StartOn youth opportunity layer\n- https://7ya.io/influence — Media and social signal layer\n\nVerification rule: 7YA does not invent external press coverage or unsupported metrics. Official-owned material, pending sources, archive-visible items, and verified claims are labeled separately.\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
