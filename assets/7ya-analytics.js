(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-1028S7MMGQ';
  const SITE_VERSION = 'github-pages-20260711';
  const ua = navigator.userAgent || '';
  const botPattern = /(bot|crawler|spider|headless|lighthouse|pagespeed|google-inspectiontool|pingdom|uptime|synthetic|monitoring)/i;

  if (navigator.webdriver || botPattern.test(ua)) {
    return;
  }

  const routeGroup = (() => {
    const path = location.pathname.toLowerCase();
    if (path === '/' || path === '/index.html') return 'home';
    if (path.startsWith('/evidence')) return 'evidence';
    if (path.startsWith('/index-public')) return 'archive';
    if (path.startsWith('/journey')) return 'journey';
    if (path.startsWith('/starton')) return 'starton';
    if (path.startsWith('/talk') || path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/social')) return 'social';
    if (path.startsWith('/blog')) return 'content';
    if (path.startsWith('/trust')) return 'trust';
    if (path.startsWith('/partners')) return 'partners';
    if (path.startsWith('/launch')) return 'launch';
    return 'other';
  })();

  const deviceType = (() => {
    const width = Math.max(window.innerWidth || 0, screen.width || 0);
    if (width < 768) return 'mobile';
    if (width < 1100) return 'tablet';
    return 'desktop';
  })();

  const referrerDomain = (() => {
    if (!document.referrer) return 'direct';
    try {
      return new URL(document.referrer).hostname || 'direct';
    } catch {
      return 'unknown';
    }
  })();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    transport_type: 'beacon',
    cookie_flags: 'SameSite=None;Secure',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  script.referrerPolicy = 'strict-origin-when-cross-origin';
  document.head.appendChild(script);

  const baseParams = {
    site_version: SITE_VERSION,
    route_group: routeGroup,
    page_language: document.documentElement.lang || 'und',
    device_type: deviceType,
    traffic_quality: 'human_candidate',
  };

  const send = (eventName, params = {}) => {
    window.gtag('event', eventName, {
      ...baseParams,
      ...params,
    });
  };

  const boot = () => {
    if (document.visibilityState !== 'visible') return;

    send('page_view', {
      page_title: document.title,
      page_location: location.href,
      page_path: `${location.pathname}${location.search}`,
      page_referrer_domain: referrerDomain,
    });

    if (/404|not found|signal lost/i.test(document.title)) {
      send('page_not_found', { page_path: location.pathname });
    }

    const thresholds = [25, 50, 75, 90];
    const sentDepths = new Set();
    let ticking = false;

    const measureScroll = () => {
      ticking = false;
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      thresholds.forEach((threshold) => {
        if (depth >= threshold && !sentDepths.has(threshold)) {
          sentDepths.add(threshold);
          send('scroll_depth', { percent_scrolled: threshold });
        }
      });
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measureScroll);
      }
    }, { passive: true });

    [15, 30, 60, 120].forEach((seconds) => {
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          send('engaged_time', { seconds_engaged: seconds });
        }
      }, seconds * 1000);
    });

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const filterButton = target.closest('[data-filter]');
      if (filterButton) {
        send('filter_use', {
          filter_name: filterButton.getAttribute('data-filter') || 'unknown',
        });
      }

      const link = target.closest('a[href]');
      if (!link) return;

      const rawHref = link.getAttribute('href') || '';
      const area = link.closest('header') ? 'header'
        : link.closest('nav') ? 'navigation'
          : link.closest('.hero-actions') ? 'hero'
            : link.closest('footer') ? 'footer'
              : 'content';

      if (rawHref.startsWith('mailto:')) {
        send('conversion_intent', { intent_type: 'email', link_area: area });
        return;
      }

      if (rawHref.startsWith('tel:')) {
        send('conversion_intent', { intent_type: 'phone', link_area: area });
        return;
      }

      let destination;
      try {
        destination = new URL(link.href, location.href);
      } catch {
        return;
      }

      const sameOrigin = destination.origin === location.origin;
      const destinationPath = destination.pathname;
      const isContact = /^\/(talk|contact)\/?/i.test(destinationPath);
      const isEvidence = /^\/(evidence|trust|index-public)\/?/i.test(destinationPath);
      const isMedia = /(youtube\.com|youtu\.be|spotify\.com|music\.apple\.com|13tv\.co\.il)/i.test(destination.hostname);
      const isDownload = /\.(pdf|zip|csv|xlsx?|docx?|pptx?)$/i.test(destinationPath);

      if (isContact) {
        send('conversion_intent', {
          intent_type: destinationPath.includes('talk') ? 'talk' : 'contact',
          link_area: area,
        });
      }

      if (isEvidence) {
        send('evidence_open', {
          destination_path: destinationPath,
          link_area: area,
        });
      }

      if (isMedia) {
        send('media_open', {
          destination_domain: destination.hostname,
          link_area: area,
        });
      }

      if (isDownload) {
        send('file_download', {
          file_extension: destinationPath.split('.').pop()?.toLowerCase() || 'unknown',
          destination_path: destinationPath,
        });
      }

      if (sameOrigin) {
        send(rawHref.startsWith('#') ? 'anchor_navigation' : 'internal_navigation', {
          destination_path: `${destination.pathname}${destination.search}${destination.hash}`,
          link_area: area,
        });
      } else {
        send('outbound_click', {
          destination_domain: destination.hostname,
          destination_path: destination.pathname,
          link_area: area,
        });
      }

      if (link.matches('.primary-link, .archive-button, [data-cta]')) {
        send('cta_click', {
          destination_path: destination.pathname,
          link_area: area,
        });
      }
    }, { capture: true });

    document.addEventListener('submit', (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form) return;
      let actionPath = 'current-page';
      try {
        actionPath = new URL(form.action || location.href, location.href).pathname;
      } catch {
        // Keep the non-identifying fallback.
      }
      send('form_submit', {
        form_id: form.id || form.getAttribute('name') || 'anonymous-form',
        action_path: actionPath,
      });
    }, { capture: true });

    const sections = [...document.querySelectorAll('main section')];
    if ('IntersectionObserver' in window && sections.length) {
      const viewed = new WeakSet();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.4 || viewed.has(entry.target)) return;
          viewed.add(entry.target);
          const index = sections.indexOf(entry.target) + 1;
          const sectionId = entry.target.id
            || [...entry.target.classList].find((name) => name !== 'chapter')
            || `section-${index}`;
          send('section_view', {
            section_id: sectionId,
            section_index: index,
          });
          observer.unobserve(entry.target);
        });
      }, { threshold: [0.4] });
      sections.forEach((section) => observer.observe(section));
    }

    let lcp = 0;
    let cls = 0;
    let inp = 0;

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Browser does not expose LCP.
    }

    try {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) cls += entry.value;
        });
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Browser does not expose CLS.
    }

    try {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.interactionId && entry.duration > inp) inp = entry.duration;
        });
      }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch {
      // Browser does not expose INP event timing.
    }

    const reportVitals = () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      send('web_vitals', {
        fcp_ms: fcpEntry ? Math.round(fcpEntry.startTime) : 0,
        lcp_ms: Math.round(lcp),
        cls_milli: Math.round(cls * 1000),
        inp_ms: Math.round(inp),
      });
    };

    window.addEventListener('pagehide', reportVitals, { once: true });

    window.addEventListener('error', () => {
      send('client_error', { error_type: 'script_or_resource' });
    });

    window.addEventListener('unhandledrejection', () => {
      send('client_error', { error_type: 'unhandled_promise' });
    });
  };

  const start = () => window.setTimeout(boot, 1200);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
