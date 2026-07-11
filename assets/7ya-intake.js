(() => {
  const form = document.querySelector("[data-intake-form]");
  if (!form) return;

  const status = document.querySelector("[data-intake-status]");
  const submit = form.querySelector("button[type='submit']");

  const setStatus = (state, message) => {
    if (!status) return;
    status.dataset.state = state;
    status.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "Sending...");
    if (submit) submit.disabled = true;

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "request_failed");

      form.reset();
      setStatus("ok", result.delivered ? "Sent. We received the request." : "Received locally. Delivery webhook still needs Netlify setup.");
    } catch (error) {
      setStatus("error", "API route is not active here yet. Use the email fallback below.");
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
