export function initRevealOnScroll() {
  const targets = Array.from(document.querySelectorAll('.js-reveal'));
  if (!targets.length) return;

  const reveal = (el) => el.classList.add('is-visible');

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Red de seguridad: contenido ya visible en pantalla al cargar (o si el
  // navegador nunca dispara el observer) nunca debe quedar invisible.
  window.addEventListener('load', () => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
    });
  });
}
