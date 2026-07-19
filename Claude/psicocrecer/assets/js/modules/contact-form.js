const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const fields = {
    name: form.querySelector('#contact-name'),
    email: form.querySelector('#contact-email'),
    message: form.querySelector('#contact-message'),
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    Object.values(fields).forEach((field) => field.removeAttribute('aria-invalid'));

    if (!fields.name.value.trim()) firstInvalid = firstInvalid || fields.name;
    if (!EMAIL_RE.test(fields.email.value.trim())) firstInvalid = firstInvalid || fields.email;
    if (!fields.message.value.trim()) firstInvalid = firstInvalid || fields.message;

    if (firstInvalid) {
      firstInvalid.setAttribute('aria-invalid', 'true');
      firstInvalid.focus();
      return;
    }

    // Sin backend conectado todavía: simula el envío en el cliente.
    // TODO(Fase futura): sustituir por integración real (ej. Formspree/endpoint propio).
    form.hidden = true;
    const success = document.querySelector('[data-contact-success]');
    if (success) success.hidden = false;
  });
}
