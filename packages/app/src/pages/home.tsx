import { createMemo, createSignal, For } from "solid-js"
import {
  auditInventory,
  chapters,
  evidenceRecords,
  openVerificationItems,
  publicSources,
  type Language,
} from "@/data/7ya-public-record"
import "./home/7ya-restoration.css"

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: "he", label: "HE" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
]

const copy = {
  he: {
    direction: "rtl" as const,
    eyebrow: "IGOR VEPRETSKI × #7YA · PUBLIC MEMORY SYSTEM",
    titleA: "איגור",
    titleB: "ופרצקי",
    deck: "עשייה ציבורית, יצירה, מדיה והשפעה — מחוברות למקורות במקום להישאר מפוזרות ברשת.",
    principle: "אדם ← רגע ← מקור ← הפצה ← ראיה ← קשר",
    primaryCta: "פתח את הרשומה הציבורית",
    secondaryCta: "פתח Audit מלא",
    portraitLabel: "דיוקן ציבורי מאומת · CC0 · Wikimedia Commons",
    serviceTitle: "מה 7YA עושה בפועל",
    serviceIntro: "לא עוד דף אודות. המערכת לוקחת חומר מפוזר והופכת אותו למסלול שניתן לבדוק, להבין ולהמשיך ממנו.",
    problem: "01 · PROBLEM",
    problemText: "פוסטים, וידאו, כתבות, מוזיקה וחשבונות נשארים מנותקים זה מזה.",
    interaction: "02 · INTERACTION",
    interactionText: "7YA מקשר כל פריט למקור, תאריך, סטטוס ראיה, אנשים, פרויקט והפצה.",
    output: "03 · OUTPUT",
    outputText: "מתקבלים ציר חיים, Evidence, Echo וגרף קשרים — בלי להמציא Reach או תפקידים שלא אומתו.",
    chapters: "שבעה חדרים",
    recordTitle: "הרשומה הציבורית",
    recordIntro: "עוגנים נבחרים מתוך ה־Master Ledger. רמת הראיה מתארת מה המקור מוכיח — לא כמה הטענה מרשימה.",
    source: "מקור",
    level: "ראיה",
    startonTitle: "StartOn · ניסיון אישי שהפך לתשתית ציבורית",
    startonText:
      "StartOn נשמרת כציר עצמאי: רישום העמותה הוא עוגן מוסדי, וכתבות/טלוויזיה מספקות הקשר לסיפור ההקמה והמעבר לעשייה חברתית.",
    startonPrimary: "GuideStar · רישום העמותה",
    startonSecondary: "StartOn · האתר הרשמי",
    inventoryTitle: "Inventory, לא מדדי השפעה",
    inventoryText:
      "אלה ספירות של חומר מקור שנאסף. הן אינן Reach, impressions או השפעה חברתית. מדדי השפעה יפורסמו רק עם analytics, תקופה ומתודולוגיית dedupe.",
    openTitle: "פתוח לאימות",
    openIntro: "המערכת שומרת חורים במקום להחליק אותם.",
    aiTitle: "7YA Companion",
    aiText:
      "כלי AI שעובד מול הארכיון הציבורי ומסייע לחפש, לחבר ולנסח. הוא אינו מציג את עצמו כאיגור ואינו הופך מקור עצמי לאימות חיצוני.",
    buildTitle: "מכאן בונים מוצר, לא עוד מסמך",
    buildText:
      "ה־Audit המלא נגיש כנתון מכונה. השכבה הבאה היא לחבר כל URL ל־moment / person / project / topic ולהציג את המסע 2011→2026 מתוך המקורות עצמם.",
    auditLink: "פתח JSON Audit",
    footer: "RESTORATION+ PREVIEW · EVIDENCE FIRST · PRODUCTION UNTOUCHED",
  },
  en: {
    direction: "ltr" as const,
    eyebrow: "IGOR VEPRETSKI × #7YA · PUBLIC MEMORY SYSTEM",
    titleA: "IGOR",
    titleB: "VEPRETSKI",
    deck: "Public work, creation, media and influence — connected to sources instead of scattered across the web.",
    principle: "PERSON → MOMENT → SOURCE → DISTRIBUTION → EVIDENCE → RELATION",
    primaryCta: "Open public record",
    secondaryCta: "Open full audit",
    portraitLabel: "Verified public portrait · CC0 · Wikimedia Commons",
    serviceTitle: "What 7YA actually does",
    serviceIntro:
      "Not another about page. The system turns scattered public material into a path that can be checked, understood and extended.",
    problem: "01 · PROBLEM",
    problemText: "Posts, video, press, music and accounts remain disconnected.",
    interaction: "02 · INTERACTION",
    interactionText: "7YA links every item to its source, date, evidence status, people, project and redistribution.",
    output: "03 · OUTPUT",
    outputText: "The result is a life timeline, Evidence, Echo and relationship graph — without invented reach or unverified roles.",
    chapters: "Seven rooms",
    recordTitle: "Public record",
    recordIntro:
      "Selected anchors from the Master Ledger. Evidence level describes what the source proves, not how impressive the claim sounds.",
    source: "Source",
    level: "Evidence",
    startonTitle: "StartOn · personal experience turned into public infrastructure",
    startonText:
      "StartOn remains an independent axis: the nonprofit registration is the institutional anchor, while press and broadcast sources provide context for the origin story.",
    startonPrimary: "GuideStar · nonprofit registration",
    startonSecondary: "StartOn · official site",
    inventoryTitle: "Inventory, not impact metrics",
    inventoryText:
      "These are source-inventory counts. They are not reach, impressions or social impact. Impact metrics require owner analytics, a date range and dedupe methodology.",
    openTitle: "Open verification",
    openIntro: "The system keeps gaps visible instead of smoothing them over.",
    aiTitle: "7YA Companion",
    aiText:
      "An AI tool operating against the public archive to help search, connect and draft. It does not impersonate Igor or convert self-sourced material into external verification.",
    buildTitle: "Build a product, not another document",
    buildText:
      "The complete audit is available as machine-readable data. The next layer connects each URL to moment / person / project / topic and lets the visitor move through 2011→2026 via live evidence.",
    auditLink: "Open JSON audit",
    footer: "RESTORATION+ PREVIEW · EVIDENCE FIRST · PRODUCTION UNTOUCHED",
  },
  ru: {
    direction: "ltr" as const,
    eyebrow: "IGOR VEPRETSKI × #7YA · PUBLIC MEMORY SYSTEM",
    titleA: "ИГОРЬ",
    titleB: "ВЕПРЕЦКИЙ",
    deck: "Публичная деятельность, творчество, медиа и влияние — связаны с источниками, а не разбросаны по сети.",
    principle: "ЧЕЛОВЕК → МОМЕНТ → ИСТОЧНИК → РАСПРОСТРАНЕНИЕ → ДОКАЗАТЕЛЬСТВО → СВЯЗЬ",
    primaryCta: "Открыть публичную запись",
    secondaryCta: "Открыть полный audit",
    portraitLabel: "Проверенный публичный портрет · CC0 · Wikimedia Commons",
    serviceTitle: "Что 7YA делает на практике",
    serviceIntro:
      "Не ещё одна страница «обо мне». Система превращает разрозненный публичный материал в путь, который можно проверить и понять.",
    problem: "01 · PROBLEM",
    problemText: "Посты, видео, пресса, музыка и аккаунты остаются не связанными.",
    interaction: "02 · INTERACTION",
    interactionText: "7YA связывает каждый объект с источником, датой, статусом доказательства, людьми, проектом и распространением.",
    output: "03 · OUTPUT",
    outputText: "Результат — хронология жизни, Evidence, Echo и граф связей без выдуманных охватов и неподтверждённых ролей.",
    chapters: "Семь комнат",
    recordTitle: "Публичная запись",
    recordIntro:
      "Выбранные опорные источники из Master Ledger. Уровень доказательства показывает, что именно подтверждает источник.",
    source: "Источник",
    level: "Уровень",
    startonTitle: "StartOn · личный опыт, превращённый в общественную инфраструктуру",
    startonText:
      "StartOn хранится как отдельная ось: регистрация НКО — институциональный якорь, а пресса и телевидение дают контекст истории создания.",
    startonPrimary: "GuideStar · регистрация НКО",
    startonSecondary: "StartOn · официальный сайт",
    inventoryTitle: "Inventory, не метрики влияния",
    inventoryText:
      "Это количество собранных источников, а не reach, impressions или социальное влияние. Метрики публикуются только вместе с аналитикой, периодом и методологией dedupe.",
    openTitle: "Открыто для проверки",
    openIntro: "Система сохраняет пробелы видимыми, а не маскирует их.",
    aiTitle: "7YA Companion",
    aiText:
      "AI-инструмент, работающий с публичным архивом. Он помогает искать и связывать материал, но не выдаёт себя за Игоря и не превращает self-source в независимое подтверждение.",
    buildTitle: "Строим продукт, а не ещё один документ",
    buildText:
      "Полный audit доступен как машиночитаемые данные. Следующий слой связывает каждый URL с moment / person / project / topic и даёт двигаться по 2011→2026 через живые источники.",
    auditLink: "Открыть JSON audit",
    footer: "RESTORATION+ PREVIEW · EVIDENCE FIRST · PRODUCTION UNTOUCHED",
  },
}

export default function Home() {
  const [language, setLanguage] = createSignal<Language>("he")
  const t = createMemo(() => copy[language()])

  return (
    <div class="ya7-restoration" lang={language()} dir={t().direction}>
      <header class="ya7-topbar">
        <a class="ya7-brand" href="#person" aria-label="7YA home">
          <span>7YA.IO</span>
          <span class="ya7-acid">#7YA</span>
        </a>

        <nav class="ya7-roomnav" aria-label={t().chapters}>
          <For each={chapters}>
            {(chapter, index) => (
              <a href={`#${chapter.slug}`}>
                <span>{String(index() + 1).padStart(2, "0")}</span>
                {chapter.shortLabel}
              </a>
            )}
          </For>
        </nav>

        <div class="ya7-languages" aria-label="Language">
          <For each={languageOptions}>
            {(option) => (
              <button
                type="button"
                classList={{ active: language() === option.code }}
                aria-pressed={language() === option.code}
                onClick={() => setLanguage(option.code)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>
      </header>

      <main>
        <section class="ya7-hero" id="person">
          <div class="ya7-hero-copy">
            <div>
              <p class="ya7-kicker">{t().eyebrow}</p>
              <h1>
                <span>{t().titleA}</span>
                <span>{t().titleB}</span>
              </h1>
              <p class="ya7-deck">{t().deck}</p>
              <p class="ya7-principle" dir="ltr">
                {t().principle}
              </p>
              <div class="ya7-hero-actions">
                <a class="ya7-button primary" href="#record">
                  {t().primaryCta}
                </a>
                <a class="ya7-button" href="/data/7ya-public-web-audit.json" target="_blank" rel="noreferrer">
                  {t().secondaryCta}
                </a>
              </div>
            </div>

            <div class="ya7-inventory-strip" aria-label="Public source inventory">
              <For each={auditInventory}>
                {(item) => (
                  <div>
                    <strong dir="ltr">{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                )}
              </For>
            </div>
          </div>

          <figure class="ya7-portrait">
            <img
              src={publicSources.portrait.imageUrl}
              alt="Igor Vepretski"
              loading="eager"
              decoding="async"
            />
            <figcaption>
              <a href={publicSources.portrait.sourceUrl} target="_blank" rel="noreferrer">
                {t().portraitLabel}
              </a>
            </figcaption>
          </figure>
        </section>

        <section class="ya7-service" aria-labelledby="service-title">
          <div class="ya7-section-heading">
            <span>7YA / SERVICE</span>
            <div>
              <h2 id="service-title">{t().serviceTitle}</h2>
              <p>{t().serviceIntro}</p>
            </div>
          </div>

          <div class="ya7-service-grid">
            <article>
              <span>{t().problem}</span>
              <p>{t().problemText}</p>
            </article>
            <article>
              <span>{t().interaction}</span>
              <p>{t().interactionText}</p>
            </article>
            <article>
              <span>{t().output}</span>
              <p>{t().outputText}</p>
            </article>
          </div>
        </section>

        <section class="ya7-chapters" aria-label={t().chapters}>
          <For each={chapters}>
            {(chapter, index) => (
              <a class="ya7-chapter" href={`#${chapter.slug}`}>
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <strong>{chapter.label[language()]}</strong>
                <small>{chapter.range}</small>
              </a>
            )}
          </For>
        </section>

        <section class="ya7-record" id="record">
          <div class="ya7-section-heading">
            <span>PUBLIC RECORD</span>
            <div>
              <h2>{t().recordTitle}</h2>
              <p>{t().recordIntro}</p>
            </div>
          </div>

          <div class="ya7-record-list">
            <For each={evidenceRecords}>
              {(record) => (
                <article class="ya7-record-row">
                  <div class="ya7-record-date" dir="ltr">
                    {record.date}
                  </div>
                  <div class="ya7-record-body">
                    <span class="ya7-status">{record.status}</span>
                    <h3>{record.title[language()]}</h3>
                    <p>{record.summary[language()]}</p>
                  </div>
                  <div class="ya7-record-meta">
                    <span>
                      {t().level} <strong>{record.evidence}</strong>
                    </span>
                    <a href={record.url} target="_blank" rel="noreferrer">
                      {t().source} ↗
                    </a>
                  </div>
                </article>
              )}
            </For>
          </div>
        </section>

        <section class="ya7-starton" id="starton">
          <div class="ya7-starton-copy">
            <span>STARTON / VERIFIED AXIS</span>
            <h2>{t().startonTitle}</h2>
            <p>{t().startonText}</p>
            <div class="ya7-link-row">
              <a href={publicSources.guidestar} target="_blank" rel="noreferrer">
                {t().startonPrimary} ↗
              </a>
              <a href={publicSources.starton} target="_blank" rel="noreferrer">
                {t().startonSecondary} ↗
              </a>
            </div>
          </div>

          <div class="ya7-starton-proof">
            <span>ENTITY</span>
            <strong>StartOn</strong>
            <span>REGISTERED NONPROFIT</span>
            <strong dir="ltr">580752814</strong>
            <span>EVIDENCE</span>
            <strong>A / institutional registration</strong>
          </div>
        </section>

        <section class="ya7-inventory" id="viral">
          <div class="ya7-section-heading">
            <span>TRACE / METHOD</span>
            <div>
              <h2>{t().inventoryTitle}</h2>
              <p>{t().inventoryText}</p>
            </div>
          </div>

          <div class="ya7-big-numbers">
            <For each={auditInventory}>
              {(item) => (
                <div>
                  <strong dir="ltr">{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              )}
            </For>
          </div>
        </section>

        <section class="ya7-open" id="ideas">
          <div class="ya7-section-heading">
            <span>OPEN VERIFICATION</span>
            <div>
              <h2>{t().openTitle}</h2>
              <p>{t().openIntro}</p>
            </div>
          </div>

          <ul>
            <For each={openVerificationItems}>
              {(item) => (
                <li>
                  <span>{item.code}</span>
                  <strong>{item.label[language()]}</strong>
                </li>
              )}
            </For>
          </ul>
        </section>

        <section class="ya7-companion" id="music">
          <span>AI / HONESTY</span>
          <div>
            <h2>{t().aiTitle}</h2>
            <p>{t().aiText}</p>
          </div>
        </section>

        <section class="ya7-build" id="build">
          <p class="ya7-kicker">7YA / 2011→2026</p>
          <h2>{t().buildTitle}</h2>
          <p>{t().buildText}</p>
          <a class="ya7-button primary" href="/data/7ya-public-web-audit.json" target="_blank" rel="noreferrer">
            {t().auditLink}
          </a>
        </section>
      </main>

      <footer class="ya7-footer" dir="ltr">
        {t().footer}
      </footer>
    </div>
  )
}
