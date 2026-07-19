# Componentes — guía de mantenimiento

Este proyecto no usa un sistema de includes/build para HTML. Cada componente
compartido (header, footer, tarjetas...) se copia y pega igual en cada página
HTML. Cuando cambies un componente, debes replicar el cambio en **todas** las
páginas que lo usan. Esta guía lista dónde vive cada uno.

## CSS: `main.css` es un archivo generado

`assets/css/main.css` **no se edita a mano**. Se genera concatenando, en
orden ITCSS, los archivos de `assets/css/{settings,tools,generic,elements,
components,utilities}/`. Esto evita usar `@import` en el navegador (que en
Chrome bajo `file://` no carga por restricciones de origen, y en producción
crea una cadena de peticiones secuenciales que perjudica el rendimiento).

Flujo de trabajo:
1. Edita el archivo fuente correspondiente (ej. `assets/css/components/_header.css`).
2. Ejecuta `bash scripts/build-css.sh` desde la raíz del proyecto.
3. Recarga la página — `main.css` queda regenerado como un único archivo plano.

No hay watcher; es un paso manual deliberado para no depender de Node/npm.

## Header (`.site-header`)

- **CSS:** `assets/css/components/_header.css`
- **JS:** `assets/js/modules/nav.js` (sticky shadow + menú móvil)
- **Aparece en:** todas las páginas `.html` del proyecto.
- **Al editar el menú de navegación:** actualiza la lista `<ul class="site-nav__list">`
  en cada página. Marca el enlace de la página actual con `aria-current="page"`.
- **CTA "Reservar sesión":** hay dos copias del botón en el HTML (una para
  desktop, `.site-header__cta--desktop`, y otra dentro de `.site-nav` para
  móvil) — el CSS oculta una u otra según el breakpoint 1024px. Si cambias el
  texto o el enlace, actualiza ambas. **Enlaza directamente al Google Form de
  reserva de sesión** (`target="_blank"`), no a `contacto.html` — así en las
  28 apariciones del botón en todo el sitio.

## Footer (`.site-footer`)

- **CSS:** `assets/css/components/_footer.css`
- **Aparece en:** todas las páginas.
- 4 columnas en desktop → 2 en tablet → 1 en móvil (grid automático, sin JS).
- El bloque de newsletter es un único `<a class="btn ...">` que enlaza al
  Google Form de newsletter (`target="_blank"`) — no hay `<form>` ni captura
  de email en el propio sitio (ver sección "Newsletter" más abajo).
- Redes sociales: solo Instagram y LinkedIn (enlaces reales de Felipe). No hay
  icono de YouTube — se quitó porque no hay cuenta.

## Newsletter (bloques `.newsletter` + footer)

- **No hay formulario propio.** GitHub Pages no tiene backend, así que tanto
  el footer como los 7 bloques `.newsletter` de las páginas son un botón
  `<a class="btn ...">` que abre el Google Form de newsletter en una pestaña
  nueva. El módulo `newsletter-form.js` (validación cliente + estado de
  éxito) se eliminó por completo al quedar sin uso — no lo repongas a menos
  que vuelvas a un formulario propio.
- Si cambias la URL del Google Form, hay que reemplazarla en las 13 páginas
  (7 bloques principales + 13 footers, algunos comparten URL). Búscala como
  `docs.google.com/forms/d/e/1FAIpQLSfw-lerI` para localizarla toda.

## Reserva de sesión

- El botón "Reservar sesión" (header, hero, CTAs finales) enlaza directamente
  a un Google Form externo, no a `contacto.html`. `contacto.html` conserva su
  propio formulario de contacto general (para dudas que no son una reserva).
- Si cambias la URL de reserva, búscala como
  `docs.google.com/forms/d/e/1FAIpQLSeQS9RJ71` (28 apariciones en 13 páginas).

## Botón "volver arriba" (`.scroll-top-btn`)

- **CSS:** dentro de `assets/css/components/_footer.css`
- **JS:** `assets/js/modules/scroll-top.js`
- Aparece tras bajar 480px. Respeta `prefers-reduced-motion`.

## Sistema de botones (`.btn`)

- **CSS:** `assets/css/components/_buttons.css`
- Variantes: `.btn--primary`, `.btn--secondary`, `.btn--ghost`, `.btn--inverse`.
- Tamaños: `.btn--sm`, `.btn--md`, `.btn--lg`.
- Usar siempre `.btn` + una variante + un tamaño, ej.: `class="btn btn--primary btn--lg"`.

## Convenciones de rutas (importante para GitHub Pages)

- Todas las rutas internas son **relativas sin slash inicial**
  (`blog/index.html`, no `/blog/index.html`), porque el proyecto se sirve
  bajo una subruta (`usuario.github.io/psicocrecer/`).
- Desde `blog/*.html`, las rutas a `assets/` deben subir un nivel:
  `../assets/css/main.css`.

## Blog (`blog/index.html` + `blog/articulo-plantilla.html`)

- `articulo-plantilla.html` es la **plantilla reutilizable** de artículo. No
  hay CMS ni generador: para publicar un artículo real, duplica ese archivo
  con un nombre nuevo (ej. `blog/gestionar-ansiedad-6-semanas.html`), cambia
  el contenido, el `<title>`/meta tags y el JSON-LD, y enlázalo desde
  `blog/index.html` y desde la sección "Blog destacado" de `index.html`.
- **Tabla de contenidos automática:** `assets/js/modules/toc.js` recorre los
  `h2` dentro de `[data-article-body]`, les asigna un `id` (slug sin acentos)
  si no lo tienen, y construye los enlaces dentro de `[data-toc-list]`. No
  hace falta escribir los `id` a mano.
- **Compartir:** `assets/js/modules/share.js` rellena los `href` de
  `[data-share-intent]` (Twitter/Facebook/WhatsApp) con la URL y título
  reales de la página en tiempo de carga — no hardcodear URLs de compartir.
- **Comentarios:** `assets/js/modules/comments.js` — sin backend real
  integrado. El formulario solo confirma la recepción en el cliente
  (`role="status"`). Ver nota en `comment-form__note` del HTML.
- **Filtro de categorías** (`blog/index.html`): `assets/js/modules/blog-filter.js`
  empareja botones `[data-filter="slug"]` con tarjetas `[data-category="slug"]`.
  Mantén los slugs sincronizados si añades una categoría nueva.

## Tienda, Talleres y Recursos (`tienda.html`, `talleres.html`, `recursos.html`)

- **Catálogo reducido a 1 ejemplo + "Próximamente" a petición de Felipe**
  (quería lanzar la web pronto sin catálogo completo todavía). Tanto
  `tienda.html` como `talleres.html`, y las secciones equivalentes de
  `index.html`, muestran solo 1 tarjeta real + `.coming-soon-card` (borde
  discontinuo, `assets/css/components/_cards.css`). El filtro de categorías
  de `tienda.html` se quitó (no tiene sentido con 1 solo producto) — si
  vuelves a ampliar el catálogo, puedes reintroducirlo reutilizando
  `blog-filter.js` (genérico) con categorías `cursos`, `libros`, `talleres`,
  `recursos`.
- **Precios en pesos chilenos (CLP)**, formato `$49.990` (punto como
  separador de miles, sin decimales — CLP no usa centavos). El JSON-LD
  `Product` de `tienda.html` usa `"priceCurrency": "CLP"` y el precio sin
  puntos (`"49990"`) — mantenlo sincronizado con la tarjeta HTML si lo cambias.
- **Descarga con verja de email (`recursos.html`):** `assets/js/modules/gated-download.js`.
  Estructura por recurso gated: un `.resource-card-wrap` que envuelve la
  `.resource-card` visible + un `.resource-gate` oculto con el formulario.
  El botón `[data-gated-trigger]` (con `aria-controls` apuntando al panel)
  despliega el panel; al enviar un email válido, el formulario se oculta y
  aparece `[data-gated-success]` con el enlace de descarga real. Sin backend,
  esto **no envía ningún email de verdad** — es la interacción completa lista
  para conectar a un servicio (ej. Mailchimp) más adelante.
- Los recursos de descarga directa (sin verja) son un `.resource-card` suelto
  con un `<a data-resource-file="">` — incluidos en el mismo `.grid--2` que
  las tarjetas gated.
- Las tarjetas de recursos en `index.html` enlazan a `recursos.html#slug`;
  esos mismos `id` (`calmar-ansiedad`, `conocerte-mejor`, etc.) están puestos
  a mano en `recursos.html` — si renombras un recurso, actualiza ambos lados.

## Sobre mí, Contacto, FAQ y páginas legales

- **`sobre-mi.html`:** nombre, número de colegiada e historia son ilustrativos
  (marcados `<!-- PLACEHOLDER -->`). El bloque `.timeline` es reutilizable
  para cualquier listado cronológico futuro (ej. una página de prensa).
- **`contacto.html`:** `assets/js/modules/contact-form.js` valida nombre,
  email y mensaje en el cliente; al enviar oculta el formulario y muestra
  `[data-contact-success]`. Sin backend real conectado — mismo patrón que el
  resto de formularios del sitio.
- **`faq.html`:** FAQ completa agrupada por categorías, con JSON-LD `FAQPage`
  (solo incluye 3 preguntas de ejemplo en el schema; si añades más al HTML
  visible, valora ampliar también el JSON-LD). Reutiliza el mismo componente
  `.accordion` que la FAQ de la home — son preguntas independientes, no
  sincronizadas entre ambas páginas.
- **Páginas legales** (`aviso-legal.html`, `politica-privacidad.html`,
  `politica-cookies.html`, `terminos.html`): texto de plantilla orientativa,
  con aviso `.legal-notice` visible en cada una. **No están listas para
  producción tal cual** — antes de publicar, sustituye los `[PLACEHOLDER]`
  (identidad del titular, NIF, proveedor de email marketing, etc.) y haz que
  un profesional del derecho las revise. Todas llevan `<meta name="robots"
  content="noindex">` a propósito, para no indexar contenido legal genérico
  en buscadores mientras siga sin personalizar.

## SEO técnico (Fase 6)

- **`sitemap.xml` / `robots.txt`:** en la raíz del proyecto. Las 4 páginas
  legales están excluidas de `sitemap.xml` y bloqueadas en `robots.txt`
  porque llevan `<meta name="robots" content="noindex">`. Si añades páginas
  nuevas (artículos de blog reales, más talleres...), añádelas también aquí.
- **`site.webmanifest`, `favicon/`:** el favicon SVG y los PNG (apple-touch-icon
  180px, icon-192, icon-512, favicon-32) se generan con
  `scripts/generate-icons.ps1` (usa `System.Drawing` de .NET porque no había
  ImageMagick/Inkscape disponibles). Vuelve a ejecutarlo si cambias el diseño
  del logo — no edites los PNG a mano.
- **JSON-LD:** `Organization` + `WebSite` en `index.html`; `BreadcrumbList` en
  toda página con breadcrumbs visibles; `Article` en la plantilla de blog;
  `FAQPage` en `faq.html`; `Product` (vía `@graph`) en `tienda.html` — los
  precios ahí deben mantenerse sincronizados con las tarjetas HTML.
- **Precarga de fuentes:** cada página incluye dos `<link rel="preload">`
  (Inter/Fraunces) antes del `<link rel="stylesheet">`. Si añades una página
  nueva, cópialos también.

## Accesibilidad — contraste de color

Durante la Fase 6 se auditaron todos los pares texto/fondo con la fórmula de
contraste WCAG y se corrigieron 3 fallos reales (por debajo de 4.5:1):

- `--text-muted` usaba `--color-gray-500` (3.46:1) → ahora usa el nuevo
  `--color-gray-600` (5.13:1). `--color-gray-500` se conserva para bordes,
  donde el mínimo exigido es 3:1.
- Texto blanco sobre `--brand-primary` (sage-500, 3.09:1) en `.btn--primary`,
  `.filter-pill[aria-pressed='true']` y `.skip-link` → ahora usan
  `--color-sage-700` / `--color-sage-800` (hover), 5.23:1+. `--brand-primary`
  (sage-500) se conserva para iconos y decoración, donde solo se exige 3:1.
- `.article-product-cta__label` sobre `--surface-sky` (4.25:1) → nuevo
  `--color-sky-800`, 4.88:1.

Si añades un nuevo componente con texto sobre un fondo de color, comprueba el
contraste antes de usar `--brand-primary`/`--color-sky-700`/`--color-*-500`
directamente como color de texto — están calibrados para uso decorativo o
gráfico (mínimo 3:1), no para texto (mínimo 4.5:1).

## Pendiente de conectar (placeholders)

- Enlaces de Payhip en la tarjeta de producto/taller de ejemplo: `data-payhip-url=""`.
- Archivos reales de recursos descargables (PDF/plantillas) en `recursos.html`:
  `data-resource-file=""`, tanto en descargas directas como en los enlaces
  `[data-gated-success] a` que se revelan tras dejar el email. De momento no
  existe ningún archivo real.
- Datos identificativos y proveedor de email marketing en las páginas legales
  (ver sección anterior) — marcados `[PLACEHOLDER]` dentro del propio texto.
  El número de registro de Felipe (927990) ya está puesto en `sobre-mi.html`.
- `og:url` / `canonical` en cada `<head>` usan `https://tuusuario.github.io/psicocrecer/`
  como placeholder — reemplazar por la URL real de GitHub Pages al publicar.

### Ya conectado (no son placeholders)

- Email de contacto (`Ps.rozasfelipe@gmail.com`), WhatsApp/teléfono
  (`+56 9 4045 4434`), Instagram y LinkedIn — reales, en `contacto.html` y el
  footer de las 13 páginas.
- Botón "Reservar sesión" (28 apariciones) → Google Form real de reservas.
- Testimonios de la home (Maximiliano, Paola, Laura) — reseñas reales.
- Newsletter (footer + 7 bloques) → botón al Google Form real de newsletter.
