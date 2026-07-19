const SHOW_AFTER_PX = 480;

export function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateVisibility = () => {
    btn.classList.toggle('is-visible', window.scrollY > SHOW_AFTER_PX);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
