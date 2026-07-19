const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initGatedDownloads() {
  document.querySelectorAll('[data-gated-trigger]').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
      if (!isOpen) panel.querySelector('input[type="email"]')?.focus();
    });

    const form = panel.querySelector('[data-gated-form]');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');

      if (!EMAIL_RE.test(input.value.trim())) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      form.hidden = true;
      const success = panel.querySelector('[data-gated-success]');
      if (success) success.hidden = false;
    });
  });
}
