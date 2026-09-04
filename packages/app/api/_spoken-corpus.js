export const SPOKEN_CORPUS_RELEASE = "spoken-corpus-20260904-v1"

export const SPOKEN_CLAIMS = [
  {
    sourceId: "nitzotzot-1",
    source: "Nitzotzot session 1",
    videoId: "ByBQX5K9z6U",
    timestamp: "00:04–00:34",
    start: 4,
    topic: "StartOn",
    confidence: "high",
    text: "Igor frames the sessions as a journey through his immigration and life story toward the idea of technological spaces for youth at risk.",
  },
  {
    sourceId: "creators-home-3",
    source: "Creators from Home · Episode 3",
    videoId: "DHxxrglp1Gk",
    timestamp: "01:06–01:42",
    start: 66,
    topic: "biography",
    confidence: "high",
    text: "Igor says he was born in Ukraine, immigrated to Israel in 1993, and spent much of his adult life in security service and later the Israel Police.",
  },
  {
    sourceId: "creators-home-3",
    source: "Creators from Home · Episode 3",
    videoId: "DHxxrglp1Gk",
    timestamp: "02:14–02:49",
    start: 134,
    topic: "security",
    confidence: "high",
    text: "Igor stresses that after leaving the system he can speak more freely about his view that security personnel receive too little public and media recognition.",
  },
  {
    sourceId: "minds-motion-18",
    source: "Minds in Motion · Episode 18",
    videoId: "mXAGZawQUPM",
    timestamp: "00:04–00:32",
    start: 4,
    topic: "systems",
    confidence: "high",
    text: "Igor argues that long-established systems and organizations are among the hardest places to change because their mechanisms and infrastructure already lock in roles and operating rules.",
  },
  {
    sourceId: "freddy-moskovitz",
    source: "Igor Vepretski with Freddy Moskovitz",
    videoId: "U2d_hulZAC0",
    timestamp: "01:38–02:12",
    start: 98,
    topic: "identity",
    confidence: "high",
    text: "Asked who he is, Igor describes himself through the idea of a child on a journey and connects that identity to the path that follows.",
  },
  {
    sourceId: "freddy-moskovitz",
    source: "Igor Vepretski with Freddy Moskovitz",
    videoId: "U2d_hulZAC0",
    timestamp: "02:12–02:44",
    start: 132,
    topic: "StartOn",
    confidence: "high",
    text: "Igor explains that StartOn is meant to build technological spaces in disadvantaged neighborhoods and make technology accessible to youth at risk, based on the view that technology is now part of life rather than merely entertainment.",
  },
  {
    sourceId: "103fm-barak-seri",
    source: "103FM · Barak Seri",
    videoId: null,
    timestamp: "01:06–01:35",
    start: 66,
    topic: "politics",
    confidence: "medium",
    text: "In the reviewed audio segment Igor links his political joining of Israel Beiteinu to the period after October 7 and distinguishes it from the party-related status that preceded it. This wording is ASR-reviewed paraphrase, not verbatim.",
  },
]

const normalize = (value) => String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()

export function searchSpokenClaims(query, limit = 4) {
  const q = normalize(query)
  if (!q) return SPOKEN_CLAIMS.slice(0, limit)
  const words = [...new Set(q.split(/\s+/).filter((word) => word.length > 1))]

  return SPOKEN_CLAIMS
    .map((claim) => {
      const haystack = normalize(`${claim.source} ${claim.topic} ${claim.text}`)
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0)
      return { claim, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.claim)
}

export function claimSourceLink(claim) {
  if (!claim.videoId) return null
  return `https://www.youtube.com/watch?v=${claim.videoId}&t=${claim.start}s`
}
