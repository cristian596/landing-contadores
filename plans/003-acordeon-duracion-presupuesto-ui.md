# 003 — Ajustar la apertura del acordeón de preguntas frecuentes al presupuesto de UI (≤ 240ms)

- **Status**: DONE (código aplicado; falta feel check en navegador)
- **Commit**: N/A — la carpeta no tiene repositorio git. Registrar el hash cuando exista.
- **Severity**: LOW
- **Category**: Duración y easing (AUDIT §2)
- **Estimated scope**: 1 archivo (`src/components/Accordion.astro`), 3 valores

## Problema

La apertura del FAQ usa 320ms para la altura y para el desplazamiento de la respuesta. El playbook marca 150–250ms para desplegables, y el resto de la UI del repo usa `--t-ui` (240ms).

```css
/* src/components/Accordion.astro:91-111 — actual */
@media (prefers-reduced-motion: no-preference) {
  .faq::details-content {
    height: 0;
    overflow: clip;
    transition:
      height 320ms var(--ease-out),
      content-visibility 320ms allow-discrete;
  }
  .faq[open]::details-content {
    height: auto;
  }
  .faq-a {
    opacity: 0;
    translate: 0 -6px;
    transition:
      opacity 260ms var(--ease-out) 60ms,
      translate 320ms var(--ease-out);
  }
  .faq[open] .faq-a {
    opacity: 1;
    translate: 0;
  }
}
```

## Target

Altura y desplazamiento a `--t-ui` (240ms); la opacidad usa `--t-hover` (180ms) con el mismo retardo de 60ms, para que la respuesta termine a los ~240ms. Todo el bloque queda dentro de 300ms y usa tokens existentes.

```css
/* target — Accordion.astro */
@media (prefers-reduced-motion: no-preference) {
  .faq::details-content {
    height: 0;
    overflow: clip;
    transition:
      height var(--t-ui) var(--ease-out),
      content-visibility var(--t-ui) allow-discrete;
  }
  .faq[open]::details-content {
    height: auto;
  }
  .faq-a {
    opacity: 0;
    translate: 0 -6px;
    transition:
      opacity var(--t-hover) var(--ease-out) 60ms,
      translate var(--t-ui) var(--ease-out);
  }
  .faq[open] .faq-a {
    opacity: 1;
    translate: 0;
  }
}
```

## Repo conventions to follow

- Tokens de duración en `src/styles/global.css:39-41` (`--t-hover` 180ms, `--t-ui` 240ms). Usarlos, no escribir números.
- Ejemplo del mismo patrón ya en el repo: `src/components/Accordion.astro:78` (`transition: rotate var(--t-ui) var(--ease-out)`) — el chevron ya usa `--t-ui`. Este plan lo iguala con el resto del acordeón.

## Steps

1. En `src/components/Accordion.astro`, cambiar `320ms` por `var(--t-ui)` en `height` y en `content-visibility` (dentro de `.faq::details-content`).
2. En el mismo archivo, cambiar `260ms` por `var(--t-hover)` en `opacity` dentro de `.faq-a` (mantener el retardo de `60ms`).
3. En el mismo archivo, cambiar `320ms` por `var(--t-ui)` en `translate` dentro de `.faq-a`.
4. No hay más cambios en este plan.

## Boundaries

- NO cambiar el easing (`var(--ease-out)`), el retardo de 60ms ni `translate: 0 -6px`.
- NO cambiar `overflow: clip`, `interpolate-size` ni el marcado `<details>`/`<summary>`.
- NO tocar el bloque `.faq-q:hover` ni `.chevron`.
- NO añadir dependencias.
- Si los valores no coinciden con el código actual, DETENERSE y reportar.

## Verification

- **Mecánica**: `npm run lint` y `npm run build` sin errores. `grep -n "320ms\|260ms" src/components/Accordion.astro` no debe devolver resultados.
- **Feel check**: `npm run dev`, abrir `/preguntas-frecuentes` y, en DevTools → Animations con 10% de velocidad:
  - Abrir una pregunta: la altura crece y el texto aparece en ~240ms, sin dar la sensación de retardo.
  - Cerrar una pregunta: la altura se contrae sin salto.
  - Abrir y cerrar rápido varias preguntas seguidas: no debe haber saltos ni estados extraños.
  - Con reduced motion activado: la apertura debe ser instantánea (sin altura animada).
- **Done when**: `Accordion.astro` no contiene `320ms` ni `260ms`, la apertura se siente rápida en la comprobación a 10% y reduced motion sigue dando apertura instantánea.
