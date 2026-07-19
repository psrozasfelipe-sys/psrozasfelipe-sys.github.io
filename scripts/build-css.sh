#!/usr/bin/env bash
# Concatena las capas ITCSS en un único assets/css/main.css.
# No hay bundler en este proyecto: este script es la única "build" que existe.
# Ejecutar cada vez que edites cualquier archivo dentro de assets/css/{settings,tools,generic,elements,components,utilities}.
set -euo pipefail
cd "$(dirname "$0")/.."

CSS_DIR="assets/css"
OUT="$CSS_DIR/main.css"

cat > "$OUT" <<'HEADER'
/* ==========================================================================
   Psicocrecer — Hoja de estilos principal (GENERADO — no editar a mano)
   Este archivo se genera concatenando assets/css/{settings,tools,generic,
   elements,components,utilities}/*.css en ese orden mediante
   scripts/build-css.sh. Edita los archivos fuente, no este.
   ========================================================================== */

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('../fonts/inter-latin-variable.woff2') format('woff2-variations'),
       url('../fonts/inter-latin-variable.woff2') format('woff2');
}

@font-face {
  font-family: 'Fraunces';
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url('../fonts/fraunces-latin-variable.woff2') format('woff2-variations'),
       url('../fonts/fraunces-latin-variable.woff2') format('woff2');
}

HEADER

for layer in settings tools generic elements components utilities; do
  for file in "$CSS_DIR/$layer"/*.css; do
    [ -e "$file" ] || continue
    echo "/* ---- $file ---- */" >> "$OUT"
    cat "$file" >> "$OUT"
    echo "" >> "$OUT"
  done
done

echo "main.css generado ($(wc -l < "$OUT") líneas)."
