export type VerificationStatus =
  | "verified"
  | "official_owned"
  | "official_owned_article"
  | "self_attested"
  | "source_pending"
  | "archive_visible"

export const siteOrigin = "https://7ya.io"
export const lastUpdated = "2026-06-22"

export const knowledgeRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/starton", priority: "0.9", changefreq: "monthly" },
  { path: "/evidence", priority: "0.9", changefreq: "weekly" },
  { path: "/influence", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/igor-vepretski", priority: "0.95", changefreq: "weekly" },
  { path: "/articles", priority: "0.9", changefreq: "weekly" },
  { path: "/articles/igor-vepretski-7ya-origin", priority: "0.95", changefreq: "monthly" },
]

export const founderArticle = {
  slug: "igor-vepretski-7ya-origin",
  title: "Igor Vepretski and #7YA: From Survival Intelligence to Public Signal",
  description:
    "The story behind 7YA, StartOn, public leadership, youth work, intelligence discipline, and a new civic media operating system.",
  date: "2026-06-22",
  updatedAt: lastUpdated,
  author: "Igor Vepretski / 7YA Editorial",
  category: "Founder Story",
  tags: ["Igor Vepretski", "#7YA", "StartOn", "public leadership", "youth work", "evidence"],
  verificationStatus: "official_owned_article" satisfies VerificationStatus,
  heroImage: "https://7ya.io/images/igor-vepretski-7ya-og.svg",
  href: "/articles/igor-vepretski-7ya-origin",
  excerpt:
    "A first official knowledge entry in the 7YA archive, connecting founder story, StartOn, public service, media intelligence, youth work, and evidence-aware civic infrastructure.",
  sections: [
    {
      heading: "A biography built under pressure",
      body: [
        "There are biographies that begin with titles. This one begins with pressure.",
        "Igor Vepretski built #7YA from the meeting point between survival, public service, youth work, media intelligence, and the need to turn personal experience into civic infrastructure.",
        "Born in Kharkiv, Ukraine, raised in Israel, and shaped by the streets of Bat Yam and Holon, Igor's path moved through military service, security work, intelligence, public safety, youth initiatives, digital media, and civic communication.",
      ],
    },
    {
      heading: "The signal layer",
      body: [
        "The result is not a traditional personal brand. It is a public operating system.",
        "#7YA is the signal layer: a place where evidence, identity, media presence, StartOn, AI systems, youth opportunity, public leadership, and direct public communication are connected into one readable archive.",
        "The core promise is simple: no fake press wall, no inflated validation, no borrowed authority. Official material is marked as official. Pending evidence is marked as pending. Verified items remain connected to their proof layer.",
      ],
    },
    {
      heading: "StartOn and youth opportunity",
      body: [
        "StartOn is the social engine behind the wider vision: technology, mentorship, media, and structured opportunity for young people who need systems that see them early enough.",
        "The 7YA archive connects this work to a broader civic narrative: youth empowerment, public responsibility, digital culture, and practical systems that can be inspected, improved, and scaled.",
      ],
    },
    {
      heading: "Evidence before mythology",
      body: [
        "This article is the first official knowledge entry in the 7YA archive. It does not replace external journalism, and it does not pretend to be third-party coverage.",
        "It creates the verified foundation from which journalists, partners, search engines, AI systems, and the public can understand the story accurately.",
      ],
    },
  ],
}

export const articles = [founderArticle]

export const profileFacts = [
  {
    label: "Identity",
    value: "Igor Vepretski / איגור ופרצקי / Игорь Вепрецкий / #7YA",
    status: "official_owned" satisfies VerificationStatus,
  },
  {
    label: "7YA",
    value: "Personal command site, public evidence hub, media-intelligence layer, and civic operating system.",
    status: "official_owned" satisfies VerificationStatus,
  },
  {
    label: "StartOn",
    value: "Youth opportunity and technology initiative connected to mentorship, media, community, and social infrastructure.",
    status: "official_owned" satisfies VerificationStatus,
  },
  {
    label: "Public service background",
    value: "Security, intelligence, public safety, municipal security, and civic communication experience. Individual details require source-level evidence before third-party presentation.",
    status: "self_attested" satisfies VerificationStatus,
  },
]

export const verificationPolicy = [
  "official_owned means the statement is published by 7YA as first-party material.",
  "official_owned_article means the article is an official 7YA-owned editorial entry, not external press coverage.",
  "self_attested means the statement comes from Igor Vepretski or 7YA and should be corroborated before use as third-party fact.",
  "source_pending means the statement is awaiting a public proof link, screenshot, archive, or document.",
  "archive_visible means the source or public artifact is visible, but metrics or interpretation may still require review.",
  "verified means the statement is connected to a visible evidence item or public source in the 7YA evidence layer.",
]

export const sameAs = [
  "https://7ya.io/",
  "https://7ya.io/igor-vepretski",
  "https://igorvepretski.academia.edu/",
  "https://www.instagram.com/igor.vepretski/",
  "https://www.youtube.com/c/IgorIdoVepretski",
  "https://il.linkedin.com/in/vepretski",
  "https://github.com/vepretski",
]
