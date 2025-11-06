(function(){
  const body = document.body;
  body.classList.remove('no-js');

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggle && nav){
    const close = () => {
      body.classList.remove('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      body.classList.add('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && target.tagName === 'A') close();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    }, { passive: true });
  }

  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const subnavLinks = document.querySelectorAll('.subnav__item[href^="#"]');
  if (subnavLinks.length) {
    const header = document.querySelector('.site-header');
    const getOffset = () => (header ? header.offsetHeight : 0);
    const duration = 700;
    const easeInQuad = (t) => t * t;
    subnavLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (!hash || hash.charAt(0) !== '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        const startY = window.pageYOffset;
        const targetRect = target.getBoundingClientRect();
        const offset = getOffset();
        const targetY = targetRect.top + startY - offset;
        let startTime = null;
        const step = (timestamp) => {
          if (startTime === null) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInQuad(progress);
          window.scrollTo(0, startY + (targetY - startY) * eased);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        subnavLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });
  }

  const agreementToggles = document.querySelectorAll('[data-agreement-toggle]');
  if (agreementToggles.length) {
    agreementToggles.forEach((toggle) => {
      const targetSelector = toggle.getAttribute('data-agreement-toggle');
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      toggle.addEventListener('click', () => {
        const willOpen = target.hasAttribute('hidden');
        if (willOpen) {
          target.removeAttribute('hidden');
        } else {
          target.setAttribute('hidden', '');
        }
        toggle.setAttribute('aria-expanded', String(willOpen));
        toggle.textContent = willOpen ? '▲' : '▼';
        const openLabel = toggle.getAttribute('data-label-open');
        const closeLabel = toggle.getAttribute('data-label-close');
        if (openLabel && closeLabel) {
          toggle.setAttribute('aria-label', willOpen ? closeLabel : openLabel);
        }
      });
    });
  }

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if (revealNodes.length) {
    const reveal = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(reveal, {
        threshold: 0.2,
        rootMargin: '0px 0px -12% 0px'
      });
      revealNodes.forEach((node) => observer.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add('is-visible'));
    }
  }
})();
