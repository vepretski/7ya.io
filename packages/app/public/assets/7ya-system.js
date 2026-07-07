(() => {
  document.documentElement.dataset.ready = "true";

  const outbound = document.querySelectorAll('a[href^="http"]');
  for (const link of outbound) {
    link.rel = "noopener noreferrer";
    link.target = "_blank";
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const loadBubblaVWidget = () => {
    const websiteId = "4046ae49-f12b-472b-a24d-3e602387b80b";
    const src = "https://www.bubblav.com/widget.js";

    if (document.querySelector(`script[src="${src}"][data-site-id="${websiteId}"]`)) return;
    if (window.__BUBBLAV_WIDGET_LOADING__) return;

    window.__BUBBLAV_WIDGET_LOADING__ = true;

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.siteId = websiteId;
    script.addEventListener("load", () => {
      window.__BUBBLAV_WIDGET_LOADED__ = true;
    });
    script.addEventListener("error", () => {
      window.__BUBBLAV_WIDGET_LOADING__ = false;
    });

    document.body.appendChild(script);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadBubblaVWidget, { once: true });
  } else {
    loadBubblaVWidget();
  }
})();
