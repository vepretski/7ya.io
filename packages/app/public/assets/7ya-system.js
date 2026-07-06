(() => {
  document.documentElement.dataset.ready = "true";

  const outbound = document.querySelectorAll('a[href^="http"]');
  for (const link of outbound) {
    link.rel = "noopener noreferrer";
    link.target = "_blank";
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
