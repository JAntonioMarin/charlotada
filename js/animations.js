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

export function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Anima las filas de una tabla con stagger al entrar en viewport
  function animateRows(container) {
    container.querySelectorAll('tbody tr').forEach((row, i) => {
      row.style.animationDelay = `${i * 45}ms`;
      row.classList.add('row-enter');
    });
  }

  const tableObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateRows(entry.target);
      tableObserver.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('anim-in');
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.tbl-wrap').forEach(el => tableObserver.observe(el));

  document.querySelectorAll('.ev-card').forEach((card, i) => {
    card.classList.add('anim-ready');
    card.style.transitionDelay = `${i * 30}ms`;
    cardObserver.observe(card);
  });

  document.querySelectorAll('.sec-title').forEach(el => {
    el.classList.add('anim-ready');
    cardObserver.observe(el);
  });
}
