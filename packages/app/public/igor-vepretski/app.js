const state = {
  language: new URLSearchParams(location.search).get("lang") || "he",
  data: null,
  search: "",
  topic: "all",
  status: "all",
}

const copy = {
  he: {
    dir: "rtl",
    heroFirst: "איגור",
    heroLast: "ופרצקי",
    heroLead: "לא עוד אוסף פרופילים. כל רגע ציבורי מחובר למקור, להפצה, לרמת ראיה ולמה שעדיין לא ידוע.",
    navStory: "סיפור",
    navEvidence: "ראיות",
    navEcho: "הד",
    navOpen: "פתוח",
    openStory: "פתח את המסע",
    openSources: "ראה את כל המקורות",
    inventoryTitle: "רוחב אמיתי, בלי סכום Reach מומצא.",
    inventoryLead: "המספרים כאן מתארים חומר מקור שנאסף. הם אינם קהל ייחודי ואינם מדד השפעה כולל.",
    modesTitle: "אותו קאנון. שלוש דרכי כניסה.",
    storyMode: "המסע האנושי",
    storyModeText: "ציר זמן שמחבר ילדות, יצירה, שירות, StartOn, מדיה, כתיבה וחיים ציבוריים — בלי להעלות טענה מעל הראיה שלה.",
    evidenceMode: "המקור מאחורי הרגע",
    evidenceModeText: "כל URL נשמר כ־node עם status, domain, סוג מקור, הקשר ו־checked_last.",
    graphMode: "איך דבר עבר ברשת",
    graphModeText: "פרסום → הפצה → מדיה → ארכיון. מראה קשרים בלי לספור reupload או transcript כיצירה חדשה.",
    timelineTitle: "ציר ציבורי שניתן לפתוח עד המקור.",
    timelineLead: "כל רגע מצביע לרשומות המקור שלו. אין כאן ביוגרפיה שמבקשת אמון עיוור.",
    echoTitle: "מה קרה אחרי “פרסם”.",
    echoLead: "השפעה מתחילה במקום שבו אובייקט עוזב את החשבון המקורי: שיתוף, עמוד הפצה, ראיון, תגובה, מראה או ארכיון.",
    axesTitle: "העשייה לא נדחסת לתפקיד אחד.",
    startonTitle: "מסיפור אישי לתשתית ציבורית",
    startonText: "רישום GuideStar הוא העוגן המוסדי; mynet וחדשות 13 מוסיפים הקשר לסיפור ההקמה והחזרה לג׳סי כהן.",
    musicTitle: "היצירה נשארת חלק מהקאנון",
    musicText: "Ido Vepretski נשמר כ־alias יצירתי של אותה ישות, עם קטלוג 2020–2024 בפלטפורמות הסטרימינג.",
    longformTitle: "קול שאפשר לשמוע ולקרוא במלואו",
    longformText: "זמן ישראל, Mindset, Minds in Motion ומקורות podcast נוספים מחזיקים גרסאות ארוכות של הקול הציבורי.",
    evidenceTitle: "כל המקורות. לא מדגם.",
    evidenceLead: "חיפוש וסינון עובדים על Audit של 23.08.2026. FETCH_RESTRICTED אינו “מת”; הוא נשאר במערכת עד בדיקה חוזרת.",
    openTitle: "מה שלא סגור — נשאר גלוי כלא סגור.",
    openLead: "זו לא חולשה של הארכיון. זו הדרך למנוע ממערכת עשירה להפוך למכונת הגזמה.",
    policyTitle: "איך הטענה מקבלת מקום באתר.",
    machineTitle: "המסמך כבר הפך לנתון.",
    machineLead: "כל מקור נושא ID, topic, status, checked_last והקשר ledger. מכאן אפשר לבנות Moment/Echo/Graph בלי להתחיל מחדש בכל סבב.",
    searchPlaceholder: "חפש כותרת, פלטפורמה, domain או URL…",
    source: "מקור",
    sources: "מקורות",
    shown: "מוצגים",
  },
  en: {
    dir: "ltr",
    heroFirst: "IGOR",
    heroLast: "VEPRETSKI",
    heroLead: "Not another pile of profiles. Every public moment is tied to a source, distribution path, evidence level and what remains unknown.",
    navStory: "STORY",
    navEvidence: "EVIDENCE",
    navEcho: "ECHO",
    navOpen: "OPEN",
    openStory: "Open the journey",
    openSources: "See every source",
    inventoryTitle: "Real breadth, without a fabricated reach total.",
    inventoryLead: "These figures describe collected source inventory. They are not unique audience and not a total impact metric.",
    modesTitle: "One canon. Three ways in.",
    storyMode: "The human journey",
    storyModeText: "A timeline connecting creation, service, StartOn, media, writing and public life without raising a claim above its evidence.",
    evidenceMode: "The source behind the moment",
    evidenceModeText: "Every URL is kept as a node with status, domain, source type, context and checked_last.",
    graphMode: "How something moved through the web",
    graphModeText: "Publication → redistribution → media → archive, without counting reuploads or transcripts as new original works.",
    timelineTitle: "A public timeline that opens all the way to the source.",
    timelineLead: "Every moment points back to source records. This is not a biography asking for blind trust.",
    echoTitle: "What happened after “publish”.",
    echoLead: "Influence starts where an object leaves the original account: share, distributor, interview, reaction, mirror or archive.",
    axesTitle: "The work does not fit one role.",
    startonTitle: "From personal story to public infrastructure",
    startonText: "GuideStar is the institutional anchor; mynet and Channel 13 add context for the origin story and return to Jessy Cohen.",
    musicTitle: "Creation stays inside the canon",
    musicText: "Ido Vepretski is preserved as a creative alias of the same entity, with a 2020–2024 streaming catalog.",
    longformTitle: "A voice you can hear and read in full",
    longformText: "Zman Israel, Mindset, Minds in Motion and other podcast sources preserve long-form versions of the public voice.",
    evidenceTitle: "Every source. Not a sample.",
    evidenceLead: "Search and filters operate on the 23 Aug 2026 audit. FETCH_RESTRICTED does not mean dead; the node stays until re-check.",
    openTitle: "What is not closed stays visibly open.",
    openLead: "That is not a weakness. It is how a rich archive avoids becoming an exaggeration machine.",
    policyTitle: "How a claim earns a place on the site.",
    machineTitle: "The document is now data.",
    machineLead: "Every source carries ID, topic, status, checked_last and ledger context. Moment/Echo/Graph can grow without restarting.",
    searchPlaceholder: "Search title, platform, domain or URL…",
    source: "source",
    sources: "sources",
    shown: "shown",
  },
  ru: {
    dir: "ltr",
    heroFirst: "ИГОРЬ",
    heroLast: "ВЕПРЕЦКИЙ",
    heroLead: "Не ещё одна куча профилей. Каждый публичный момент связан с источником, распространением, уровнем доказательства и тем, что пока неизвестно.",
    navStory: "ИСТОРИЯ",
    navEvidence: "ИСТОЧНИКИ",
    navEcho: "ЭХО",
    navOpen: "ОТКРЫТО",
    openStory: "Открыть путь",
    openSources: "Показать все источники",
    inventoryTitle: "Реальный масштаб без выдуманного общего reach.",
    inventoryLead: "Эти числа описывают собранный инвентарь источников. Это не уникальная аудитория и не общий показатель влияния.",
    modesTitle: "Один канон. Три входа.",
    storyMode: "Человеческий путь",
    storyModeText: "Хронология, соединяющая творчество, службу, StartOn, медиа, тексты и публичную деятельность без повышения статуса утверждения выше его доказательств.",
    evidenceMode: "Источник за каждым моментом",
    evidenceModeText: "Каждый URL хранится как node со status, domain, типом источника, контекстом и checked_last.",
    graphMode: "Как объект двигался по сети",
    graphModeText: "Публикация → распространение → медиа → архив, без превращения reupload или transcript в новую работу.",
    timelineTitle: "Публичная хронология, которую можно открыть до первоисточника.",
    timelineLead: "Каждый момент указывает на свои источники. Это не биография, требующая слепой веры.",
    echoTitle: "Что произошло после «опубликовать».",
    echoLead: "Влияние начинается там, где объект покидает исходный аккаунт: репост, страница, интервью, реакция, зеркало или архив.",
    axesTitle: "Работа не помещается в одну роль.",
    startonTitle: "От личной истории к публичной инфраструктуре",
    startonText: "GuideStar — институциональный якорь; mynet и Channel 13 добавляют контекст истории создания и возвращения в Джесси-Коэн.",
    musicTitle: "Творчество остаётся частью канона",
    musicText: "Ido Vepretski сохраняется как творческий псевдоним той же сущности с каталогом 2020–2024.",
    longformTitle: "Голос, который можно услышать и прочитать целиком",
    longformText: "Zman Israel, Mindset, Minds in Motion и другие podcast-источники сохраняют длинные версии публичного голоса.",
    evidenceTitle: "Все источники. Не выборка.",
    evidenceLead: "Поиск и фильтры работают по audit от 23.08.2026. FETCH_RESTRICTED не означает «мертвый» источник.",
    openTitle: "То, что не закрыто, остаётся явно открытым.",
    openLead: "Это не слабость архива. Так богатая система не превращается в машину преувеличений.",
    policyTitle: "Как утверждение получает место на сайте.",
    machineTitle: "Документ уже стал данными.",
    machineLead: "Каждый источник имеет ID, topic, status, checked_last и ledger context. Moment/Echo/Graph могут расти без перезапуска работы.",
    searchPlaceholder: "Поиск по названию, платформе, domain или URL…",
    source: "источник",
    sources: "источников",
    shown: "показано",
  },
}

function byId(id) {
  return document.getElementById(id)
}

function setLanguage(language) {
  if (!copy[language]) return
  state.language = language
  document.documentElement.lang = language
  document.documentElement.dir = copy[language].dir
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language))
  })
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = copy[language][node.dataset.i18n]
    if (value) node.textContent = value
  })
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = copy[language][node.dataset.i18nPlaceholder]
    if (value) node.setAttribute("placeholder", value)
  })
  renderTimeline()
  renderSources()
}

function renderTimeline() {
  if (!state.data) return
  byId("timeline-list").innerHTML = state.data.moments.map((moment) => {
    const title = moment[`title_${state.language}`] || moment.title_en
    const summary = moment[`summary_${state.language}`] || moment.summary_en
    const links = moment.source_ids.map((sourceId) => {
      const source = state.data.sources.find((item) => item.id === sourceId)
      if (!source) return ""
      return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.id)} ↗</a>`
    }).join("")
    return `
      <article class="timeline-row">
        <div class="timeline-date" dir="ltr">${escapeHtml(moment.date)}</div>
        <div class="timeline-body">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(summary)}</p>
        </div>
        <div class="timeline-meta">
          <span>EVIDENCE · ${escapeHtml(moment.evidence)}</span>
          ${links}
        </div>
      </article>
    `
  }).join("")
}

function renderSources() {
  if (!state.data) return
  const needle = state.search.trim().toLowerCase()
  const filtered = state.data.sources.filter((source) => {
    if (state.topic !== "all" && source.topic !== state.topic) return false
    if (state.status !== "all" && source.status !== state.status) return false
    if (!needle) return true
    const haystack = `${source.id} ${source.domain} ${source.kind} ${source.topic} ${source.url} ${source.ledger_context}`.toLowerCase()
    return haystack.includes(needle)
  })

  byId("source-result-count").textContent =
    `${copy[state.language].shown}: ${filtered.length} / ${state.data.sources.length} ${copy[state.language].sources}`

  byId("source-grid").innerHTML = filtered.map((source) => {
    const statusClass =
      source.status === "VERIFIED_OR_INDEXED" ? "status" :
      source.status === "SUPERSEDED" ? "superseded" :
      "pending"
    return `
      <article class="source-card">
        <div class="source-card-top" dir="ltr">
          <span>${escapeHtml(source.id)} · ${escapeHtml(source.topic.toUpperCase())}</span>
          <span class="${statusClass}">${escapeHtml(source.status)}</span>
        </div>
        <h3 dir="ltr">${escapeHtml(source.domain)}</h3>
        <p>${escapeHtml(source.ledger_context)}</p>
        <footer>
          <span dir="ltr">${escapeHtml(source.kind)} · ${escapeHtml(source.checked_last)}</span>
          <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(copy[state.language].source)} ↗</a>
        </footer>
      </article>
    `
  }).join("")
}

function renderOpen() {
  if (!state.data) return
  byId("open-list").innerHTML = state.data.open_verification.map((item, index) => `
    <li>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(item)}</strong>
    </li>
  `).join("")
}

function populateFilters() {
  const topics = [...new Set(state.data.sources.map((source) => source.topic))].sort()
  byId("source-topic").insertAdjacentHTML(
    "beforeend",
    topics.map((topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic.toUpperCase())}</option>`).join("")
  )
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

async function boot() {
  const response = await fetch("/data/7ya-master-public-system.json", { cache: "no-store" })
  if (!response.ok) throw new Error(`Failed to load public system data: ${response.status}`)
  state.data = await response.json()
  populateFilters()
  renderOpen()

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang))
  })
  byId("source-search").addEventListener("input", (event) => {
    state.search = event.currentTarget.value
    renderSources()
  })
  byId("source-topic").addEventListener("change", (event) => {
    state.topic = event.currentTarget.value
    renderSources()
  })
  byId("source-status").addEventListener("change", (event) => {
    state.status = event.currentTarget.value
    renderSources()
  })

  setLanguage(state.language)
}

boot().catch((error) => {
  console.error(error)
  byId("source-result-count").textContent = "Public data could not be loaded. Open the machine-readable canon directly."
})
