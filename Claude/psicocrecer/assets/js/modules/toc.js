export function initTableOfContents() {
  const article = document.querySelector('[data-article-body]');
  const tocList = document.querySelector('[data-toc-list]');
  const tocContainer = document.querySelector('[data-toc]');
  if (!article || !tocList) return;

  const headings = Array.from(article.querySelectorAll('h2'));
  if (!headings.length) {
    tocContainer?.remove();
    return;
  }

  const usedIds = new Set();
  headings.forEach((heading) => {
    if (!heading.id) heading.id = slugify(heading.textContent, usedIds);
    usedIds.add(heading.id);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  highlightActiveOnScroll(headings, tocList);
}

// Quita diacríticos (acentos, ñ->n) para generar ids de anclaje estables en URLs.
const DIACRITICS_RE = /[̀-ͯ]/g;

function slugify(text, used) {
  const base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  let slug = base || 'seccion';
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

function highlightActiveOnScroll(headings, tocList) {
  if (!('IntersectionObserver' in window)) return;

  const links = Array.from(tocList.querySelectorAll('a'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = links.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
        if (!link) return;
        links.forEach((a) => a.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  headings.forEach((h) => observer.observe(h));
}
