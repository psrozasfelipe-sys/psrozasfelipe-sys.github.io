export function initCarousels() {
  document.querySelectorAll('.carousel').forEach(setUpCarousel);
}

function setUpCarousel(carousel) {
  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  const prevBtn = carousel.querySelector('.carousel__arrow--prev');
  const nextBtn = carousel.querySelector('.carousel__arrow--next');
  const dots = Array.from(carousel.querySelectorAll('.carousel__dot'));
  if (!track || slides.length < 2) return;

  let index = 0;
  let autoplayTimer = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    render();
  };

  prevBtn?.addEventListener('click', () => { goTo(index - 1); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(index + 1); resetAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
  });

  // Swipe táctil
  let startX = null;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  track.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 40) goTo(delta > 0 ? index - 1 : index + 1);
    startX = null;
    resetAutoplay();
  });

  function startAutoplay() {
    if (prefersReducedMotion) return;
    autoplayTimer = window.setInterval(() => goTo(index + 1), 7000);
  }

  function resetAutoplay() {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    startAutoplay();
  }

  carousel.addEventListener('mouseenter', () => autoplayTimer && window.clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', resetAutoplay);

  render();
  startAutoplay();
}
