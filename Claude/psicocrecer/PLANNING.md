# Psicocrecer — Documento de Planificación

Plataforma web profesional de psicología basada en evidencia. Documento de arquitectura y diseño, previo a cualquier desarrollo, tal como se solicitó.

---

## 1. Arquitectura del proyecto

**Enfoque:** sitio multi-página estático (HTML/CSS/JS vanilla), sin framework ni build tool. Se eligió este enfoque en vez de un SPA (React/Vue) porque:

- El contenido (blog, catálogo) es mayormente estático y se beneficia de SEO/SSR "gratis" propio del HTML plano.
- No requiere backend, hosting complejo ni build pipeline — se puede desplegar en cualquier hosting estático (Netlify, Vercel, GitHub Pages, hosting compartido).
- Cumple el requisito de "sin WooCommerce, sin carrito, sin base de datos" para la tienda.
- Rendimiento máximo (Core Web Vitals) sin overhead de un framework.
- El usuario final pidió "un archivo HTML" como entregable — este enfoque produce páginas `.html` reales y navegables, no una app montada por JS.

**Patrón de organización:**
- **Componentes HTML reutilizables** vía un pequeño sistema de "includes" en build-time simulado con JS (fetch de fragments) NO se usará para no penalizar rendimiento/SEO — en su lugar, los componentes se documentan como *partials* que se copian/pegan de forma consistente (header, footer, newsletter, product-card, testimonial-card) y se mantienen sincronizados manualmente. Se documentará claramente en `/docs` cómo actualizar un componente en todas las páginas.
- **CSS modular** con arquitectura ITCSS simplificada: `settings → tools → generic → elements → components → utilities`.
- **JS modular** con ES6 modules (`type="module"`), un archivo por responsabilidad (nav, newsletter-form, carousel, accordion, scroll-to-top, lazy-load).

## 2. Árbol completo de carpetas

```
psicocrecer/
├── index.html                     # Home
├── sobre-mi.html
├── contacto.html
├── tienda.html                    # Catálogo (cursos, libros, talleres, recursos)
├── talleres.html
├── recursos.html                  # Recursos gratuitos descargables
├── faq.html                       # (o sección embebida en home + página propia)
├── aviso-legal.html
├── politica-cookies.html
├── politica-privacidad.html
├── terminos.html
├── blog/
│   ├── index.html                 # Listado del blog
│   └── articulo-plantilla.html    # Plantilla de artículo (post individual)
├── assets/
│   ├── css/
│   │   ├── settings/
│   │   │   ├── _variables.css     # Colores, tipografía, espaciados, radios, sombras
│   │   │   └── _breakpoints.css
│   │   ├── tools/
│   │   │   └── _mixins.css        # Custom properties auxiliares, animaciones
│   │   ├── generic/
│   │   │   └── _reset.css
│   │   ├── elements/
│   │   │   └── _base.css          # h1-h6, p, a, img, forms base
│   │   ├── components/
│   │   │   ├── _header.css
│   │   │   ├── _footer.css
│   │   │   ├── _hero.css
│   │   │   ├── _buttons.css
│   │   │   ├── _cards.css         # trust, specialty, blog, product, testimonial
│   │   │   ├── _newsletter.css
│   │   │   ├── _carousel.css
│   │   │   ├── _accordion.css
│   │   │   ├── _badge.css
│   │   │   └── _forms.css
│   │   ├── utilities/
│   │   │   └── _utilities.css     # spacing, visually-hidden, container
│   │   └── main.css                # imports en orden ITCSS
│   ├── js/
│   │   ├── main.js                 # entry point, importa módulos
│   │   ├── modules/
│   │   │   ├── nav.js               # menú sticky + mobile toggle
│   │   │   ├── newsletter-form.js   # validación + submit
│   │   │   ├── carousel.js          # testimonios
│   │   │   ├── accordion.js         # FAQ
│   │   │   ├── scroll-top.js        # botón volver arriba
│   │   │   ├── lazy-load.js         # IntersectionObserver imágenes
│   │   │   ├── reveal-on-scroll.js  # microanimaciones al hacer scroll
│   │   │   ├── toc.js               # tabla de contenidos automática (blog)
│   │   │   └── gated-download.js    # recursos que piden email antes de descargar
│   │   └── data/
│   │       └── products.js          # catálogo manual (JS objects) usado por tienda/home
│   ├── img/
│   │   ├── hero/
│   │   ├── blog/
│   │   ├── productos/
│   │   ├── testimonios/
│   │   └── icons/                   # SVG sprite de iconos (especialidades, UI)
│   └── fonts/                       # (si se autoalojan tipografías)
├── favicon/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── docs/
    └── COMPONENTES.md               # cómo mantener/replicar cada partial
```

## 3. Tecnologías elegidas y justificación

| Tecnología | Justificación |
|---|---|
| HTML5 semántico | Máxima accesibilidad y SEO nativo, sin dependencias |
| CSS3 (custom properties, Grid, Flexbox) | Diseño responsive robusto sin frameworks pesados (no Bootstrap/Tailwind CDN) |
| JavaScript ES6+ vanilla (modules) | Cero dependencias, carga mínima, control total del rendimiento |
| IntersectionObserver API | Lazy loading y animaciones on-scroll nativas y eficientes |
| `<picture>` + `loading="lazy"` + WebP/AVIF con fallback | Optimización de imágenes sin librerías |
| Schema.org (JSON-LD) | Rich snippets para artículos, productos, FAQ, persona/organización |
| Sin frameworks JS (React/Vue) | Innecesarios para contenido mayormente estático; evita hidratación y JS bloqueante |
| Sin WooCommerce / carrito | Requisito explícito — catálogo manual con botones a Payhip |

No se usarán CDNs externos para CSS/JS de terceros (evita bloqueo de render y dependencias externas); si se usa una tipografía de Google Fonts, se autoalojará (`font-display: swap`).

## 4. Componentes reutilizables (partials)

1. `Header` — logo, nav, CTA "Reservar sesión", toggle móvil, sticky on scroll.
2. `Footer` — logo, descripción, columnas de enlaces, redes, newsletter mini, legales.
3. `Hero` (variantes: home, página interior con imagen de fondo distinta).
4. `TrustCard` — especialidad/certificación/experiencia con icono.
5. `SpecialtyCard` — icono + título + descripción corta (grid).
6. `BlogCard` — imagen, categoría, tiempo de lectura, título, extracto, CTA.
7. `ProductCard` — imagen, título, descripción, precio, etiqueta, botón "Comprar" (data-attribute `data-payhip-url` para pegar el enlace luego).
8. `WorkshopCard` — fecha, duración, modalidad, precio, botón "Inscribirme".
9. `TestimonialCard` (dentro de `Carousel`).
10. `ResourceCard` — recurso descargable, con variante "gated" (pide email) y variante "directo".
11. `NewsletterBlock` (variante inline y variante "hero" a página completa).
12. `FAQAccordion`.
13. `Breadcrumbs`.
14. `TableOfContents` (autogenerada por JS a partir de los `h2`/`h3` del artículo).
15. `ButtonSystem` — `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost`, tamaños.
16. `Badge` — etiquetas de producto ("Nuevo", "Más vendido", "Oferta").
17. `ScrollToTopButton`.

Cada componente vive como bloque HTML documentado en `docs/COMPONENTES.md` con sus clases CSS y cualquier `data-*` necesario para JS.

## 5. Sistema de Diseño (Design System)

### 5.1 Paleta de colores

```css
--color-white:        #FFFFFF;
--color-cream:         #FAF8F5;   /* fondo alterno cálido */
--color-sage-50:       #F2F5F0;
--color-sage-100:      #DCE6D6;
--color-sage-300:      #A9C2A0;
--color-sage-500:      #7C9B72;   /* verde salvia principal */
--color-sage-700:      #57744F;
--color-sky-100:       #E4EEF5;
--color-sky-300:       #B9D3E3;
--color-sky-500:       #7FA8C2;   /* azul claro principal */
--color-earth-300:     #D9C7B4;   /* detalle tierra */
--color-earth-500:     #B79A78;
--color-gray-50:       #F7F7F6;
--color-gray-200:      #E5E4E1;
--color-gray-500:      #8A8A85;
--color-gray-700:      #4A4A46;
--color-gray-900:      #2B2B28;   /* texto principal, mejor que negro puro */
--color-success:       #6E9C7D;
--color-warning:       #D9A441;
```
Uso: fondos predominantemente blanco/crema, acentos en salvia y azul cielo, tierra solo en detalles pequeños (bordes, iconos, badges), gris cálido para texto (nunca negro puro, mejor legibilidad y calidez).

Contraste verificado ≥ 4.5:1 para texto normal sobre fondos claros (WCAG AA).

### 5.2 Tipografía

- **Titulares:** una serif elegante y contemporánea (ej. "Fraunces" o "Newsreader") — transmite calidez editorial, no fría.
- **Cuerpo/UI:** una sans-serif humanista muy legible (ej. "Inter" o "Figtree").
- Escala tipográfica modular (ratio 1.25):
```css
--fs-xs: 0.8rem;  --fs-sm: 0.9rem;  --fs-base: 1rem;
--fs-md: 1.25rem; --fs-lg: 1.563rem; --fs-xl: 1.953rem;
--fs-2xl: 2.441rem; --fs-3xl: 3.052rem;
```
- Line-height generoso: 1.6 en cuerpo, 1.2 en titulares.

### 5.3 Espaciados

Escala en `rem` basada en 8px:
```css
--space-1: 0.5rem; --space-2: 1rem; --space-3: 1.5rem;
--space-4: 2rem;  --space-5: 3rem; --space-6: 4rem;
--space-7: 6rem;  --space-8: 8rem;
```
Secciones con `padding-block` mínimo de `--space-6`/`--space-7` para lograr el "muchísimo espacio en blanco" pedido.

### 5.4 Bordes, sombras, radios

```css
--radius-sm: 8px; --radius-md: 16px; --radius-lg: 24px; --radius-full: 999px;
--shadow-sm: 0 1px 3px rgba(43,43,40,.06);
--shadow-md: 0 8px 24px rgba(43,43,40,.08);
--shadow-lg: 0 16px 40px rgba(43,43,40,.10);
--transition-base: 200ms cubic-bezier(.4,0,.2,1);
```

### 5.5 Sistema de botones

- `.btn--primary`: fondo salvia-500, texto blanco, hover salvia-700 + leve elevación.
- `.btn--secondary`: borde salvia-500, texto salvia-700, fondo transparente, hover fondo sage-50.
- `.btn--ghost`: solo texto + subrayado animado (enlaces tipo "Leer más").
- Tamaños `--sm/--md/--lg`. Radio `--radius-full` para CTAs, `--radius-md` para botones de tarjeta.
- Foco visible obligatorio (`:focus-visible` con outline de 3px en azul cielo).

### 5.6 Variables globales adicionales

- `--container-max: 1200px`, `--container-padding: clamp(1.25rem, 5vw, 3rem)`.
- `--header-height` (para offset de scroll con anclas y sticky).
- Modo oscuro vía `[data-theme="dark"]` sobrescribiendo las custom properties (implementación opcional, se deja preparada pero no forzada en el MVP).

## 6. Flujo de navegación

```
Home (Hero → Confianza → Especialidades → Blog destacado → Newsletter →
      Productos → Talleres → Testimonios → Sobre mí → Recursos gratuitos →
      Newsletter final → FAQ → CTA final → Footer)
   │
   ├─→ Blog (listado) → Artículo individual → [relacionados / productos / newsletter]
   ├─→ Tienda (filtros: Cursos / Libros / Talleres / Recursos) → botón Comprar → Payhip (externo)
   ├─→ Talleres → botón Inscribirme → Payhip (externo)
   ├─→ Recursos → descarga directa o gated (formulario email) → entrega del PDF
   ├─→ Sobre mí
   └─→ Contacto
```
El recorrido de conversión sigue exactamente las 8 etapas pedidas: confianza → autoridad → contenido gratuito → email → producto → testimonios → dudas (FAQ) → compra. Cada sección de la home refuerza la siguiente sin saltos bruscos.

## 7. Estrategia SEO

- HTML semántico (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`), un solo `<h1>` por página.
- Meta tags únicos por página (title ≤60c, description ≤155c).
- Open Graph + Twitter Cards en todas las páginas.
- JSON-LD: `Organization`/`Person` (home), `Article` (posts), `Product` (tienda), `FAQPage` (FAQ), `BreadcrumbList`.
- URLs amigables y descriptivas (`/blog/como-gestionar-la-ansiedad`, ya en minúsculas y sin parámetros).
- `sitemap.xml` y `robots.txt` preparados desde el día uno.
- Breadcrumbs visibles + marcados con schema en blog y tienda.
- Jerarquía de encabezados correcta y densa en keywords long-tail de psicología.
- Imágenes con `alt` descriptivo (no relleno) — refuerza SEO y accesibilidad a la vez.

## 8. Estrategia de conversión (CRO)

- Un único CTA principal por sección ("above the fold" claro: "Leer artículos" / "Explorar cursos").
- Prueba social temprana (indicadores numéricos en el hero: años, personas ayudadas, cursos, libros).
- Newsletter con doble oportunidad (a mitad de página tras contenido de valor, y al final tras testimonios/FAQ) — mismo componente, distinto copy emocional.
- Lead magnet (recursos gratuitos) como puente antes de mostrar productos de pago.
- Tarjetas de producto con jerarquía clara: beneficio > precio > urgencia sutil (badge, no countdown agresivo).
- Testimonios con foto + nombre + resultado concreto, no genérico.
- FAQ ubicado justo antes del CTA final para neutralizar objeciones de último momento.
- Micro-copy cercano y en primera persona ("Quiero unirme", no "Enviar").
- Ningún pop-up de salida agresivo ni countdown falso — coherente con el tono "nunca marketing agresivo".

## 9. Estrategia de rendimiento

- Cero frameworks/JS de terceros; JS total estimado < 30KB sin minificar.
- CSS único (`main.css`) crítico inline mínimo para el hero, resto diferido.
- `loading="lazy"` + `decoding="async"` en todas las imágenes bajo el fold; imágenes del hero con `fetchpriority="high"`.
- Formatos modernos (WebP/AVIF) con `<picture>` y fallback JPG.
- Fuentes con `font-display: swap` y precarga (`<link rel="preload">`) solo de los pesos usados.
- `defer` en todos los `<script type="module">`.
- Sin render-blocking de terceros (sin Google Fonts CDN si se autoaloja, sin iconos vía fuente de icono pesada — se usa SVG sprite inline).
- Objetivo Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.

## 10. Estrategia de accesibilidad

- Contraste AA verificado en toda la paleta (texto sobre salvia/azul revisado especialmente).
- Navegación 100% por teclado (`:focus-visible` visible y consistente, sin `outline: none` sin reemplazo).
- Landmarks ARIA (`role="navigation"`, `aria-label` en cada nav), `aria-expanded` en acordeón/menú móvil.
- Alt text descriptivo en toda imagen informativa, `alt=""` en decorativas.
- Formularios con `<label>` asociado, mensajes de error anunciados (`aria-live`).
- Carrusel de testimonios accesible: pausable, navegable por teclado, no autoplay agresivo (o pausado por defecto si hay `prefers-reduced-motion`).
- Respeto de `prefers-reduced-motion` en todas las animaciones/transiciones.
- Tamaño mínimo de área táctil 44×44px en botones.

---

## Supuestos y contenido placeholder (a confirmar/reemplazar)

Como no se cuenta con contenido real del negocio, se usarán placeholders claramente marcados que deberás reemplazar:

- **Imágenes:** se usarán fondos/ilustraciones vectoriales propias (SVG/CSS) en vez de fotos de stock con derechos ajenos, salvo que tú proporciones fotografías reales.
- **Bio, años de experiencia, certificaciones, testimonios:** contenido de ejemplo realista pero ficticio, marcado con comentario `<!-- PLACEHOLDER -->`.
- **Enlaces de Payhip:** todos los botones "Comprar"/"Inscribirme" apuntarán a `#` con `data-payhip-url=""`, documentado en `docs/COMPONENTES.md` cómo pegarlos.
- **Redes sociales / datos de contacto:** placeholders (`#`, email de ejemplo).

## Plan de fases de desarrollo (una vez aprobado este documento)

1. **Fase 1:** Fundaciones — reset, variables, tipografía, sistema de botones, layout base, header/footer.
2. **Fase 2:** Home completa (hero → CTA final), incluida newsletter y productos destacados.
3. **Fase 3:** Blog (listado + plantilla de artículo con TOC, relacionados, comentarios).
4. **Fase 4:** Tienda + Talleres + Recursos (con descarga gated).
5. **Fase 5:** Páginas legales, Sobre mí, Contacto, FAQ standalone.
6. **Fase 6:** SEO técnico final (sitemap, robots, JSON-LD en todas las páginas), pulido de accesibilidad y performance, QA responsive.

Cada archivo se entregará completo y listo para producción en su fase correspondiente.

---

**¿Apruebas esta planificación para comenzar la Fase 1?** Si quieres ajustar paleta, tipografía, estructura de carpetas o el alcance de alguna sección antes de empezar, dime qué cambiar.
