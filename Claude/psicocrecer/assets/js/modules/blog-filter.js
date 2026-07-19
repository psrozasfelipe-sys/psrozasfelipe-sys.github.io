export function initBlogFilter() {
  const pills = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if (!pills.length || !cards.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      pills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));

      cards.forEach((card) => {
        const match = filter === 'todos' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
      });
    });
  });
}
