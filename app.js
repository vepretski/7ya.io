async function loadContent() {
  const res = await fetch('./data/content.json');
  return res.json();
}

function byId(id) {
  return document.getElementById(id);
}

function renderStats(stats) {
  const root = byId('stats');
  if (!root) return;
  root.innerHTML = stats.map(item => `
    <div class="panel stat">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </div>
  `).join('');
}

function renderFeatured(items) {
  const root = byId('featured');
  if (!root) return;
  root.innerHTML = items.map(item => `
    <article class="panel card">
      <div class="meta">${item.kicker}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="cta-row">
        <a class="button" href="${item.href}" target="_blank" rel="noreferrer">Open source</a>
      </div>
    </article>
  `).join('');
}

function renderPillars(items) {
  const root = byId('pillars');
  if (!root) return;
  root.innerHTML = items.map(item => `
    <article class="panel card">
      <div class="meta">Core pillar</div>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
      <div class="tag-row"><span class="tag">${item.id}</span></div>
    </article>
  `).join('');
}

function renderChannels(items) {
  const root = byId('channels');
  if (!root) return;
  root.innerHTML = items.map(item => `
    <article class="panel channel">
      <div class="meta">${item.value}</div>
      <h3>${item.name}</h3>
      <p>${item.note}</p>
      <div class="cta-row">
        <a class="button" href="${item.href}" target="_blank" rel="noreferrer">Visit channel</a>
      </div>
    </article>
  `).join('');
}

function renderTimeline(items) {
  const root = byId('timeline');
  if (!root) return;
  root.innerHTML = items.map(item => `
    <article class="panel timeline-item">
      <div class="meta">${item.period}</div>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    </article>
  `).join('');
}

function renderArchive(items) {
  const root = byId('archiveItems');
  if (!root) return;
  root.innerHTML = items.map(item => `
    <article class="panel archive-item" data-title="${(item.title || '').toLowerCase()}" data-summary="${(item.summary || '').toLowerCase()}" data-context="${(item.context || []).join(' ').toLowerCase()}">
      <div class="meta">${item.kind} · ${item.dateLabel} · ${item.source}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="tag-row">
        ${(item.context || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="actions">
        <a class="button primary" href="${item.href}" target="_blank" rel="noreferrer">Open source</a>
      </div>
    </article>
  `).join('');
}

function wireArchiveFilters(items) {
  const search = byId('archiveSearch');
  const context = byId('archiveContext');
  const root = byId('archiveItems');
  if (!search || !context || !root) return;

  const contexts = [...new Set(items.flatMap(item => item.context || []))].sort();
  context.innerHTML = ['<option value="all">All contexts</option>', ...contexts.map(c => `<option value="${c}">${c}</option>`)].join('');

  function update() {
    const q = search.value.trim().toLowerCase();
    const selected = context.value;
    const filtered = items.filter(item => {
      const text = [item.title, item.summary, item.kind, item.source, ...(item.context || [])].join(' ').toLowerCase();
      const queryOk = !q || text.includes(q);
      const contextOk = selected === 'all' || (item.context || []).includes(selected);
      return queryOk && contextOk;
    });
    renderArchive(filtered);
    if (!filtered.length) {
      root.innerHTML = '<div class="empty">No items matched this filter.</div>';
    }
  }

  search.addEventListener('input', update);
  context.addEventListener('change', update);
  update();
}

loadContent().then(data => {
  renderStats(data.stats || []);
  renderFeatured(data.featured || []);
  renderPillars(data.pillars || []);
  renderChannels(data.channels || []);
  renderTimeline(data.timeline || []);
  renderArchive(data.items || []);
  wireArchiveFilters(data.items || []);
  const titleNodes = document.querySelectorAll('[data-site-title]');
  titleNodes.forEach(node => node.textContent = data.site?.title || '7YA');
  const tagNodes = document.querySelectorAll('[data-site-tagline]');
  tagNodes.forEach(node => node.textContent = data.site?.tagline || '');
}).catch(error => {
  console.error(error);
});