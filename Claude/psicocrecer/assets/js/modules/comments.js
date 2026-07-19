// Sin backend de comentarios integrado todavía (ej. Giscus/Disqus).
// De momento el formulario confirma la recepción en el cliente.
export function initCommentForm() {
  const form = document.querySelector('[data-comment-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = form.querySelector('.comment-form__note');
    if (note) {
      note.textContent = 'Gracias por tu comentario. Se está revisando antes de publicarse.';
      note.style.color = 'var(--color-sage-700)';
    }
    form.reset();
  });
}
