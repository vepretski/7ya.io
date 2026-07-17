(() => {
  const DATA_URL = '/data/7ya-system-v1.json';
  const byId = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const statusLabel = (status = '') => status.replaceAll('_', ' ');

  function renderNodes(data) {
    const root = byId('ontologyNodes');
    if (!root) return;
    const nodes = Object.values(data.mission_nodes || {}).sort((a, b) => (a.order || 0) - (b.order || 0));
    const fragment = document.createDocumentFragment();

    nodes.forEach((node, index) => {
      const card = element('a', 'node-card reveal');
      card.href = node.route || '#';
      card.dataset.node = node.id;
      card.setAttribute('aria-label', `${node.title_he || node.title}: ${node.classification_he || node.classification}`);

      const top = element('div', 'node-card__top');
      top.append(element('span', 'node-index', String(index + 1).padStart(2, '0')));
      top.append(element('span', 'status-chip', statusLabel(node.status)));

      const icon = element('span', 'node-icon', ['◇', '△', '▱', '≋'][index] || '·');
      icon.setAttribute('aria-hidden', 'true');
      const title = element('h3', '', node.title_he || node.title);
      const classification = element('p', 'node-classification', node.classification_he || node.classification);
      const summary = element('p', 'node-summary', node.summary_he || '');
      const action = element('span', 'node-action', 'פתיחת הצומת ←');

      card.append(top, icon, title, classification, summary, action);
      fragment.append(card);
    });

    root.replaceChildren(fragment);
  }

  function renderTrajectory(data) {
    const root = byId('trajectoryList');
    if (!root) return;
    const items = data.identity?.chronological_trajectory || [];
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const row = element('article', 'trajectory-item reveal');
      const marker = element('div', 'trajectory-marker');
      marker.append(element('span', '', item.epoch));
      const copy = element('div', 'trajectory-copy');
      copy.append(element('p', 'trajectory-en', item.phase));
      copy.append(element('h3', '', item.phase_he || item.phase));
      copy.append(element('p', '', item.description_he || item.description));
      copy.append(element('span', 'status-chip', statusLabel(item.status)));
      row.append(marker, copy);
      fragment.append(row);
    });

    root.replaceChildren(fragment);
  }

  function renderRelations(data) {
    const root = byId('relationList');
    if (!root) return;
    const nodes = Object.values(data.mission_nodes || {});
    const titles = new Map(nodes.map((node) => [node.id, node.title_he || node.title]));
    const fragment = document.createDocumentFragment();

    (data.relational_mappings || []).forEach((mapping, index) => {
      const row = element('article', 'relation-row reveal');
      row.append(element('span', 'relation-number', String(index + 1).padStart(2, '0')));
      const flow = element('div', 'relation-flow');
      flow.append(element('b', '', titles.get(mapping.source) || mapping.source));
      flow.append(element('i', '', '→'));
      flow.append(element('b', '', titles.get(mapping.target) || mapping.target));
      const copy = element('p', '', mapping.connection_he || mapping.connection || '');
      const status = element('span', 'status-chip', statusLabel(mapping.status));
      row.append(flow, copy, status);
      fragment.append(row);
    });

    root.replaceChildren(fragment);
  }

  function renderMetrics(data) {
    const root = byId('metricGrid');
    if (!root) return;
    const fragment = document.createDocumentFragment();
    (data.public_metrics || []).forEach((metric) => {
      const card = element('article', 'metric-card reveal');
      card.append(element('strong', '', metric.value));
      card.append(element('b', '', metric.label_he));
      card.append(element('span', '', metric.detail));
      fragment.append(card);
    });
    root.replaceChildren(fragment);
  }

  function activateReveals() {
    const reveals = [...document.querySelectorAll('.reveal:not(.is-visible)')];
    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((node) => observer.observe(node));
  }

  function renderFailure() {
    ['ontologyNodes', 'trajectoryList', 'relationList', 'metricGrid'].forEach((id) => {
      const root = byId(id);
      if (!root) return;
      const message = element('p', 'data-fallback', 'שכבת הנתונים אינה זמינה כרגע. הנתיבים הראשיים נשארו פעילים בתפריט.');
      root.replaceChildren(message);
    });
  }

  async function loadOntology() {
    try {
      const response = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Ontology returned ${response.status}`);
      const data = await response.json();
      renderNodes(data);
      renderTrajectory(data);
      renderRelations(data);
      renderMetrics(data);
      document.documentElement.dataset.ontology = data.ontology_root || 'ready';
      activateReveals();
    } catch (error) {
      console.error('7YA ontology load failed', error);
      renderFailure();
    }
  }

  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });
  }

  loadOntology();
})();
