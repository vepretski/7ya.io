import { lastUpdated, profileFacts, sameAs, verificationPolicy } from "../../data/7ya-knowledge-stream"

export async function GET() {
  const body = {
    name: "Igor Vepretski",
    alternateName: ["Igor Ido Vepretski", "איגור ופרצקי", "Игорь Вепрецкий", "#7YA"],
    role: ["Founder of #7YA", "StartOn founder and operator", "systems builder", "public evidence architect"],
    projects: [
      {
        name: "7YA",
        url: "https://7ya.io/",
        description: "Personal command site, public evidence hub, media-intelligence layer, and civic operating system.",
        verificationStatus: "official_owned",
      },
      {
        name: "StartOn",
        url: "https://starton.org.il/",
        description: "Youth opportunity and technology initiative connected to mentorship, media, community, and social infrastructure.",
        verificationStatus: "official_owned",
      },
    ],
    publicService: {
      description:
        "Security, intelligence, public safety, municipal security, and civic communication experience. Specific claims should be checked against the evidence archive before external reuse.",
      verificationStatus: "self_attested",
    },
    StartOn: {
      url: "https://starton.org.il/",
      verificationStatus: "official_owned",
    },
    "7YA": {
      url: "https://7ya.io/",
      knowledgeStream: "https://7ya.io/articles",
      founderStory: "https://7ya.io/articles/igor-vepretski-7ya-origin",
      verificationStatus: "official_owned",
    },
    sameAs,
    facts: profileFacts,
    evidencePages: [
      "https://7ya.io/evidence",
      "https://7ya.io/influence",
      "https://7ya.io/articles/igor-vepretski-7ya-origin",
    ],
    verificationPolicy,
    lastUpdated,
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
