export function initAccordions() {
  document.querySelectorAll('.accordion').forEach(setUpAccordion);
}

function setUpAccordion(accordion) {
  const triggers = accordion.querySelectorAll('.accordion-item__trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.dataset.open = String(!isOpen);
    });
  });
}
