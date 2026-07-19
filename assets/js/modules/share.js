export function initShareButtons() {
  const bar = document.querySelector('[data-share]');
  if (!bar) return;

  const url = window.location.href;
  const title = document.title;

  bar.querySelectorAll('[data-share-intent]').forEach((link) => {
    const intent = link.getAttribute('data-share-intent');
    link.href = buildIntentUrl(intent, url, title);
    link.target = '_blank';
    link.rel = 'noopener';
  });

  const nativeBtn = bar.querySelector('[data-share-native]');
  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', () => {
        navigator.share({ title, url }).catch(() => {});
      });
    } else {
      nativeBtn.hidden = true;
    }
  }

  const copyBtn = bar.querySelector('[data-share-copy]');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      const original = copyBtn.getAttribute('aria-label');
      copyBtn.setAttribute('aria-label', 'Enlace copiado');
      copyBtn.classList.add('is-copied');
      window.setTimeout(() => {
        copyBtn.setAttribute('aria-label', original);
        copyBtn.classList.remove('is-copied');
      }, 2000);
    } catch {
      /* Portapapeles no disponible en este navegador: se ignora silenciosamente. */
    }
  });
}

function buildIntentUrl(intent, url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (intent) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    default:
      return url;
  }
}
