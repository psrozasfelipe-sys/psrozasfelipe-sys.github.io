const HEADER_SELECTOR = '.site-header';
const SCROLLED_THRESHOLD = 8;

export function initNav() {
  const header = document.querySelector(HEADER_SELECTOR);
  const toggle = document.querySelector('.site-header__toggle');
  const nav = document.getElementById('site-nav');

  if (!header) return;

  initScrollShadow(header);
  if (toggle && nav) {
    initMobileMenu(toggle, nav);
  }
}

function initScrollShadow(header) {
  const updateShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLLED_THRESHOLD);
  };

  updateShadow();
  window.addEventListener('scroll', updateShadow, { passive: true });
}

function initMobileMenu(toggle, nav) {
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  nav.addEventListener('click', (event) => {
    if (event.target.matches('.site-nav__link')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen && !nav.contains(event.target) && !toggle.contains(event.target)) {
      close();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) close();
  });
}
