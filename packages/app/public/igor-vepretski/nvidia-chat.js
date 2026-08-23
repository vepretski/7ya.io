(() => {
  "use strict"

  if (window.__7yaNvidiaChatLoaded) return
  window.__7yaNvidiaChatLoaded = true

  const language = (() => {
    const requested = new URLSearchParams(location.search).get("lang")
    if (["he", "en", "ru"].includes(requested)) return requested
    const current = (document.documentElement.lang || "he").slice(0, 2)
    return ["he", "en", "ru"].includes(current) ? current : "he"
  })()
  const rtl = language === "he"
  const conversation = []
  let mode = "guide"
  let corpusContext = ""
  let busy = false

  const text = {
    he: {
      launch: "לדבר עם 7YA",
      title: "7YA · איגור — תיקון וקידום",
      intro: "שיחה מבוססת־ראיות שעוזרת להבין, לתקן ולשפר את המערכת הציבורית סביב איגור ופרצקי. זה AI — לא איגור עצמו.",
      placeholder: "מה תרצה לבדוק, לתקן או לקדם?",
      send: "שלח",
      close: "סגירה",
      guide: "לחקור",
      correct: "לתקן",
      advance: "לקדם",
      build: "לבנות",
      loading: "בודק את הקאנון וחושב דרך NVIDIA…",
      error: "החיבור החכם לא זמין כרגע. אפשר לנסות שוב בעוד רגע.",
      local: "Fallback מקומי",
      ready: "NVIDIA-first · בודק חיבור",
      privacy: "לא להזין מידע רגיש · תשובות אינן ראיה בפני עצמן",
    },
    en: {
      launch: "Talk with 7YA",
      title: "7YA · Igor — correct & advance",
      intro: "An evidence-first AI conversation for understanding, correcting and improving the public system around Igor Vepretski. It is AI — not Igor himself.",
      placeholder: "What should we examine, correct, or advance?",
      send: "Send",
      close: "Close",
      guide: "Explore",
      correct: "Correct",
      advance: "Advance",
      build: "Build",
      loading: "Checking the canon and reasoning through NVIDIA…",
      error: "The smart connection is unavailable right now. Try again shortly.",
      local: "Local fallback",
      ready: "NVIDIA-first · checking connection",
      privacy: "Do not enter sensitive data · AI output is not evidence by itself",
    },
    ru: {
      launch: "Поговорить с 7YA",
      title: "7YA · Игорь — исправлять и развивать",
      intro: "AI-диалог с опорой на источники: понять, исправить и улучшить публичную систему вокруг Игоря Вепрецкого. Это AI, а не сам Игорь.",
      placeholder: "Что проверить, исправить или продвинуть?",
      send: "Отправить",
      close: "Закрыть",
      guide: "Изучить",
      correct: "Исправить",
      advance: "Развивать",
      build: "Собрать",
      loading: "Проверяю канон и рассуждаю через NVIDIA…",
      error: "Умное подключение сейчас недоступно. Попробуйте ещё раз.",
      local: "Локальный fallback",
      ready: "NVIDIA-first · проверка соединения",
      privacy: "Не вводите чувствительные данные · ответ AI сам по себе не доказательство",
    },
  }[language]

  const css = document.createElement("style")
  css.textContent = `
    .ya-nv-launch{position:fixed;z-index:9997;right:18px;bottom:18px;border:1px solid rgba(226,255,0,.7);background:#0b0d0c;color:#f7f7ef;border-radius:999px;padding:12px 16px;font:700 13px/1.1 ui-sans-serif,system-ui;letter-spacing:.03em;box-shadow:0 14px 45px rgba(0,0,0,.35);cursor:pointer}.ya-nv-launch:hover{transform:translateY(-1px)}
    .ya-nv-panel{position:fixed;z-index:9998;right:18px;bottom:72px;width:min(430px,calc(100vw - 24px));max-height:min(720px,calc(100vh - 92px));display:flex;flex-direction:column;background:rgba(10,12,11,.98);color:#f5f5ed;border:1px solid rgba(255,255,255,.16);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.5);overflow:hidden;font-family:ui-sans-serif,system-ui;-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px)}.ya-nv-panel[hidden]{display:none}
    .ya-nv-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start;padding:16px 16px 12px;border-bottom:1px solid rgba(255,255,255,.1)}.ya-nv-head strong{display:block;font-size:15px}.ya-nv-head p{margin:5px 0 0;color:#b9bcb5;font-size:12px;line-height:1.45}.ya-nv-close{border:0;background:transparent;color:#f5f5ed;font-size:24px;line-height:1;cursor:pointer}
    .ya-nv-modes{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08)}.ya-nv-modes button{border:1px solid rgba(255,255,255,.14);background:#131613;color:#c8cbc4;border-radius:10px;padding:8px 5px;font-weight:700;font-size:11px;cursor:pointer}.ya-nv-modes button[aria-pressed=true]{border-color:#e2ff00;color:#e2ff00;background:rgba(226,255,0,.07)}
    .ya-nv-messages{display:flex;flex-direction:column;gap:10px;overflow:auto;padding:14px;min-height:190px}.ya-nv-msg{max-width:90%;padding:11px 12px;border-radius:14px;white-space:pre-wrap;font-size:13px;line-height:1.55}.ya-nv-msg.user{align-self:flex-end;background:#e2ff00;color:#10120f;border-bottom-right-radius:4px}.ya-nv-msg.bot{align-self:flex-start;background:#171a17;border:1px solid rgba(255,255,255,.1);color:#f1f2eb;border-bottom-left-radius:4px}.ya-nv-msg.wait{color:#bfc2bb;font-style:italic}
    .ya-nv-form{display:grid;grid-template-columns:1fr auto;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.1)}.ya-nv-form textarea{resize:none;min-height:48px;max-height:130px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:#111411;color:#fff;padding:10px 11px;font:500 13px/1.4 ui-sans-serif,system-ui;outline:none}.ya-nv-form textarea:focus{border-color:#e2ff00}.ya-nv-form button{border:0;border-radius:12px;background:#e2ff00;color:#10120f;font-weight:900;padding:0 14px;cursor:pointer}.ya-nv-form button:disabled,.ya-nv-form textarea:disabled{opacity:.55}
    .ya-nv-foot{display:flex;justify-content:space-between;gap:8px;padding:0 12px 12px;color:#8f948d;font-size:10px}.ya-nv-provider{color:#e2ff00;font-weight:800}.ya-nv-panel[dir=rtl] .ya-nv-msg.user{align-self:flex-start;border-bottom-right-radius:14px;border-bottom-left-radius:4px}.ya-nv-panel[dir=rtl] .ya-nv-msg.bot{align-self:flex-end;border-bottom-left-radius:14px;border-bottom-right-radius:4px}
    @media(max-width:560px){.ya-nv-launch{right:12px;bottom:12px}.ya-nv-panel{right:12px;bottom:64px;max-height:calc(100vh - 80px)}.ya-nv-foot{flex-direction:column}}
  `
  document.head.append(css)

  function el(tag, className, content) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (content !== undefined) node.textContent = content
    return node
  }

  const launch = el("button", "ya-nv-launch", text.launch)
  launch.type = "button"
  launch.setAttribute("aria-expanded", "false")
  launch.setAttribute("aria-controls", "ya-nv-panel")

  const panel = el("section", "ya-nv-panel")
  panel.id = "ya-nv-panel"
  panel.hidden = true
  panel.dir = rtl ? "rtl" : "ltr"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-label", text.title)

  const head = el("header", "ya-nv-head")
  const headCopy = el("div")
  headCopy.append(el("strong", "", text.title), el("p", "", text.intro))
  const close = el("button", "ya-nv-close", "×")
  close.type = "button"
  close.setAttribute("aria-label", text.close)
  head.append(headCopy, close)

  const modes = el("div", "ya-nv-modes")
  ;[["guide", text.guide], ["correct", text.correct], ["advance", text.advance], ["build", text.build]].forEach(([id, label]) => {
    const button = el("button", "", label)
    button.type = "button"
    button.dataset.mode = id
    button.setAttribute("aria-pressed", String(id === mode))
    modes.append(button)
  })

  const messages = el("div", "ya-nv-messages")
  messages.setAttribute("aria-live", "polite")
  messages.append(el("div", "ya-nv-msg bot", text.intro))

  const form = el("form", "ya-nv-form")
  const input = document.createElement("textarea")
  input.rows = 2
  input.maxLength = 4000
  input.placeholder = text.placeholder
  input.setAttribute("aria-label", text.placeholder)
  const send = el("button", "", text.send)
  send.type = "submit"
  form.append(input, send)

  const footer = el("footer", "ya-nv-foot")
  const provider = el("span", "ya-nv-provider", text.ready)
  footer.append(provider, el("span", "", text.privacy))
  panel.append(head, modes, messages, form, footer)
  document.body.append(panel, launch)

  function addMessage(content, kind) {
    const node = el("div", `ya-nv-msg ${kind}`, content)
    messages.append(node)
    messages.scrollTop = messages.scrollHeight
    return node
  }

  function compactCorpus(data) {
    if (!data || typeof data !== "object") return ""
    const chunks = []
    if (data.entity) chunks.push(`ENTITY: ${JSON.stringify(data.entity)}`)
    if (Array.isArray(data.moments)) {
      chunks.push("MOMENTS:\n" + data.moments.slice(0, 30).map((item) => JSON.stringify(item)).join("\n"))
    }
    if (Array.isArray(data.sources)) {
      chunks.push("SOURCES:\n" + data.sources.slice(0, 100).map((item) => {
        const clean = {
          id: item.id,
          title: item.title,
          topic: item.topic,
          status: item.status,
          url: item.url,
          ledger_context: item.ledger_context,
        }
        return JSON.stringify(clean)
      }).join("\n"))
    }
    if (Array.isArray(data.open_verification)) chunks.push("OPEN VERIFICATION:\n" + data.open_verification.map((item) => JSON.stringify(item)).join("\n"))
    return chunks.join("\n\n").slice(0, 24000)
  }

  async function loadContext() {
    try {
      const response = await fetch("/data/7ya-master-public-system.json", { cache: "no-store" })
      if (!response.ok) return
      corpusContext = compactCorpus(await response.json())
    } catch {}
  }

  async function checkProvider() {
    try {
      const response = await fetch("/api/guide", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      if (data.nvidiaConfigured) provider.textContent = `NVIDIA · ${data.model || "NIM"}`
      else if (data.openaiConfigured) provider.textContent = "NVIDIA-first · OpenAI fallback configured"
      else provider.textContent = text.local
    } catch {
      provider.textContent = text.local
    }
  }

  async function ask(message) {
    if (!message || busy) return
    busy = true
    input.disabled = true
    send.disabled = true
    addMessage(message, "user")
    const waiting = addMessage(text.loading, "bot wait")

    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          mode,
          language,
          path: location.pathname,
          history: conversation.slice(-10),
          context: corpusContext,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`)
      waiting.remove()
      addMessage(data.reply || text.error, "bot")
      conversation.push({ role: "user", content: message }, { role: "assistant", content: data.reply || "" })
      if (conversation.length > 12) conversation.splice(0, conversation.length - 12)
      provider.textContent = data.provider === "nvidia"
        ? `NVIDIA · ${data.model || "NIM"}`
        : data.provider === "openai"
          ? `OpenAI fallback · ${data.model || "AI"}`
          : text.local
    } catch (error) {
      waiting.textContent = text.error
      provider.textContent = text.local
      console.warn("7YA NVIDIA companion", error?.message || error)
    } finally {
      busy = false
      input.disabled = false
      send.disabled = false
      input.focus()
    }
  }

  launch.addEventListener("click", () => {
    const open = panel.hidden
    panel.hidden = !open
    launch.setAttribute("aria-expanded", String(open))
    if (open) input.focus()
  })
  close.addEventListener("click", () => {
    panel.hidden = true
    launch.setAttribute("aria-expanded", "false")
  })
  modes.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]")
    if (!button) return
    mode = button.dataset.mode
    modes.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)))
  })
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const message = input.value.trim()
    if (!message) return
    input.value = ""
    ask(message)
  })
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      form.requestSubmit()
    }
  })

  loadContext()
  checkProvider()
})()
