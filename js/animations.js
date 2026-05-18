export function initCollapsibles() {
  document.querySelectorAll('.collapsible-trigger').forEach(btn => {
    const body = btn.nextElementSibling;
    btn.addEventListener('click', () => {
      const opening = !body.classList.contains('is-open');
      body.classList.toggle('is-open', opening);
      btn.classList.toggle('is-open', opening);
      btn.setAttribute('aria-expanded', opening);
    });
  });
}

function onceVisible(selector, threshold, onEnter) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      onEnter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold });
  document.querySelectorAll(selector).forEach(observer.observe.bind(observer));
}

function staggerRows(container) {
  container.querySelectorAll('tbody tr').forEach((row, i) => {
    row.style.animationDelay = `${i * 45}ms`;
    row.classList.add('row-enter');
  });
}

export function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  onceVisible('.tbl-wrap', 0.05, staggerRows);

  document.querySelectorAll('.ev-card').forEach((card, i) => {
    card.classList.add('anim-ready');
    card.style.transitionDelay = `${i * 30}ms`;
  });
  document.querySelectorAll('.sec-title').forEach(el => el.classList.add('anim-ready'));

  onceVisible('.ev-card, .sec-title', 0.06, el => el.classList.add('anim-in'));
}
