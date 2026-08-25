export type Language = "he" | "en" | "ru"
export type EvidenceLevel = "A" | "B" | "C" | "D"

type Localized = Record<Language, string>

export interface EvidenceRecord {
  id: string
  date: string
  evidence: EvidenceLevel
  status: "VERIFIED" | "CORROBORATED" | "REPORTED-SELF" | "LEGACY"
  title: Localized
  summary: Localized
  url: string
}

export const publicSources = {
  portrait: {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/960px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png",
  },
  guidestar: "https://www.guidestar.org.il/organization/580752814",
  starton: "https://starton.org.il/",
} as const

export const auditInventory = [
  { value: "83", label: "UNIQUE PUBLIC URLS" },
  { value: "29", label: "MASTER EVIDENCE RECORDS" },
  { value: "27", label: "DIRECT YOUTUBE SOURCES" },
  { value: "2", label: "CANONICAL PLAYLISTS" },
] as const

export const chapters = [
  {
    slug: "person",
    shortLabel: "PERSON",
    range: "1990→",
    label: { he: "האדם", en: "The person", ru: "Человек" },
  },
  {
    slug: "record",
    shortLabel: "RECORD",
    range: "2011→",
    label: { he: "רשומה ציבורית", en: "Public record", ru: "Публичная запись" },
  },
  {
    slug: "viral",
    shortLabel: "ECHO",
    range: "TRACE",
    label: { he: "הד והפצה", en: "Echo & distribution", ru: "Эхо и распространение" },
  },
  {
    slug: "music",
    shortLabel: "MUSIC",
    range: "2020→",
    label: { he: "מוזיקה וקול", en: "Music & voice", ru: "Музыка и голос" },
  },
  {
    slug: "starton",
    shortLabel: "STARTON",
    range: "2022→",
    label: { he: "StartOn", en: "StartOn", ru: "StartOn" },
  },
  {
    slug: "ideas",
    shortLabel: "IDEAS",
    range: "2022→",
    label: { he: "כתיבה ורעיונות", en: "Writing & ideas", ru: "Тексты и идеи" },
  },
  {
    slug: "build",
    shortLabel: "BUILD",
    range: "2026→",
    label: { he: "לבנות מכאן", en: "Build from here", ru: "Строить дальше" },
  },
] as const

export const evidenceRecords: EvidenceRecord[] = [
  {
    id: "V3-001",
    date: "2011-04-26",
    evidence: "B",
    status: "CORROBORATED",
    title: {
      he: "כנגד כל הסיכויים",
      en: "Against all odds",
      ru: "Вопреки всему",
    },
    summary: {
      he: "עוגן תקשורתי חיצוני מוקדם לזהות הציבורית. עצם הכתבה מאומת; פרטים ביוגרפיים בתוכה נבחנים לפי מקורם.",
      en: "An early third-party media anchor. The publication is verified; biographical details inside it retain their own provenance.",
      ru: "Ранний внешний медиа-якорь. Сам факт публикации подтверждён; биографические детали сохраняют собственное происхождение.",
    },
    url: "https://www.makorrishon.co.il/nrg/online/54/ART2/235/169.html",
  },
  {
    id: "V3-003",
    date: "2022-05-13",
    evidence: "B",
    status: "CORROBORATED",
    title: {
      he: "חוזר לשכונה · mynet חולון",
      en: "Returning to the neighborhood · mynet Holon",
      ru: "Возвращение в район · mynet Holon",
    },
    summary: {
      he: "כתבת עומק מקומית על המעבר לעשייה עם נוער בג׳סי כהן והקמת מרכז.",
      en: "Local long-form coverage of the move toward youth work in Jessy Cohen and building a center.",
      ru: "Локальный материал о переходе к работе с молодёжью в Джесси-Коэн и создании центра.",
    },
    url: "https://holon.mynet.co.il/local_news/article/hjxqegkiq",
  },
  {
    id: "V3-CHANNEL13",
    date: "2022-05-22",
    evidence: "A",
    status: "VERIFIED",
    title: {
      he: "חדשות 13 · מעבר מקריירה ביטחונית למרכז לנוער",
      en: "Channel 13 · from security work to a youth center",
      ru: "Channel 13 · от работы в сфере безопасности к молодёжному центру",
    },
    summary: {
      he: "עמוד וידאו רשמי המאמת את עצם השידור וההופעה.",
      en: "Official video page verifying the broadcast and appearance.",
      ru: "Официальная страница видео подтверждает эфир и участие.",
    },
    url: "https://13tv.co.il/item/news/haolam-haboker/season-01/clips/u0uoy-903061791/",
  },
  {
    id: "V3-002",
    date: "2022-10-02",
    evidence: "A",
    status: "VERIFIED",
    title: {
      he: "StartOn · רישום מוסדי",
      en: "StartOn · institutional registration",
      ru: "StartOn · институциональная регистрация",
    },
    summary: {
      he: "GuideStar / רשם העמותות מאמת את קיום הישות ומספר העמותה 580752814.",
      en: "GuideStar / nonprofit registry verifies the entity and registration number 580752814.",
      ru: "GuideStar / реестр НКО подтверждает организацию и номер 580752814.",
    },
    url: "https://www.guidestar.org.il/organization/580752814",
  },
  {
    id: "V3-004",
    date: "2022-11",
    evidence: "B",
    status: "CORROBORATED",
    title: {
      he: "זמן ישראל · עמוד כותב ומאמרי דעה",
      en: "Zman Israel · author page and opinion columns",
      ru: "Zman Israel · страница автора и колонки",
    },
    summary: {
      he: "עוגן מערכתי לזהות המחבר ולעצם פרסום המאמרים על ילדים, טיקטוק וחינוך מודרני.",
      en: "Editorial anchor for authorship and the publication of columns about children, TikTok and modern education.",
      ru: "Редакционный якорь авторства и публикации колонок о детях, TikTok и современном образовании.",
    },
    url: "https://www.zman.co.il/writer/20815/",
  },
  {
    id: "V3-009",
    date: "2022-09-20",
    evidence: "B",
    status: "CORROBORATED",
    title: {
      he: "Mindset · מנער בסיכון ליזם חברתי",
      en: "Mindset · from at-risk youth to social entrepreneur",
      ru: "Mindset · от подростка группы риска к социальному предпринимателю",
    },
    summary: {
      he: "מקור longform שמחבר קול, סיפור חיים והקשר ציבורי; נשמר כנכס מקור ולא כסיכום ביוגרפי אוטומטי.",
      en: "A long-form source connecting voice, life story and public context; preserved as a source asset rather than automatic biography.",
      ru: "Longform-источник, соединяющий голос, историю жизни и публичный контекст.",
    },
    url: "https://open.spotify.com/episode/0t2lzatmzK8RJP5B88sOUw",
  },
  {
    id: "V3-007",
    date: "2020→2024",
    evidence: "A",
    status: "VERIFIED",
    title: {
      he: "Ido Vepretski · קטלוג מוזיקה",
      en: "Ido Vepretski · music catalog",
      ru: "Ido Vepretski · музыкальный каталог",
    },
    summary: {
      he: "Apple Music מספקת ראיה פלטפורמית לקיום זהות האמן והקטלוג הדיגיטלי.",
      en: "Apple Music provides platform evidence for the artist identity and digital catalog.",
      ru: "Apple Music подтверждает существование артистического профиля и цифрового каталога.",
    },
    url: "https://music.apple.com/us/artist/ido-vepretski/1527248864",
  },
  {
    id: "V3-012",
    date: "2024-07-21",
    evidence: "A",
    status: "VERIFIED",
    title: {
      he: "Wikimedia Commons · דיוקן ציבורי CC0",
      en: "Wikimedia Commons · public CC0 portrait",
      ru: "Wikimedia Commons · публичный портрет CC0",
    },
    summary: {
      he: "נכס חזותי פתוח: הקובץ קיים, פורסם כעבודה עצמית והוקדש ל־CC0.",
      en: "Open visual asset: the file exists, is marked as own work and is released under CC0.",
      ru: "Открытый визуальный актив: файл существует, отмечен как собственная работа и опубликован под CC0.",
    },
    url: "https://commons.wikimedia.org/wiki/File:Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png",
  },
]

export const openVerificationItems = [
  {
    code: "PENDING-ROLE",
    label: {
      he: "תואר/תפקיד פנימי מדויק בפעילות מפלגתית",
      en: "Exact internal political title / role",
      ru: "Точный внутренний политический статус / роль",
    },
  },
  {
    code: "PENDING-ACADEMIC",
    label: {
      he: "תארים אקדמיים · נדרש מקור ראשוני",
      en: "Academic degree claims · primary verification required",
      ru: "Академические степени · требуется первичный источник",
    },
  },
  {
    code: "PENDING-SERVICE",
    label: {
      he: "דרגות, תפקידים ותאריכי שירות מדויקים",
      en: "Exact service ranks, roles and dates",
      ru: "Точные звания, должности и даты службы",
    },
  },
  {
    code: "PENDING-IMPACT",
    label: {
      he: "Reach / impressions / impact · נדרש raw analytics + period + dedupe",
      en: "Reach / impressions / impact · raw analytics + period + dedupe required",
      ru: "Reach / impressions / impact · нужны raw analytics + период + dedupe",
    },
  },
] as const
