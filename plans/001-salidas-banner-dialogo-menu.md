# 001 — Animar la salida del banner de cookies, del diálogo de preferencias y del menú móvil

- **Status**: TODO
- **Commit**: N/A — la carpeta no tiene repositorio git. Registrar el hash cuando exista (`git rev-parse --short HEAD`).
- **Severity**: MEDIUM
- **Category**: Interruptibilidad / salida (AUDIT §4) y asimetría de entrada y salida
- **Estimated scope**: 2 archivos (`src/components/CookieConsent.astro`, `src/components/Header.astro`), ~60 líneas de CSS

## Problema

Todos estos elementos entran con animación de `@keyframes`, pero salen de golpe porque el atributo `hidden` o `dialog.close()` quita el elemento sin transición:

1. **Banner de cookies**: al aceptar o rechazar, `apply()` hace `banner.hidden = true` y el banner desaparece sin transición.

```css
/* src/components/CookieConsent.astro:66 — actual */
.cookie-banner:not([hidden]) {
  animation: banner-in 420ms var(--ease-out);
}
/* src/components/CookieConsent.astro:153 — actual */
@keyframes banner-in {
  from { opacity: 0; transform: translateY(16px); }
}
```

2. **Diálogo de preferencias**: se abre con `dialog-in`, pero `closeSettings()` llama a `dialog.close()` y desaparece al instante.

```css
/* src/components/CookieConsent.astro:130 — actual */
.cookie-dialog[open] {
  animation: dialog-in 260ms var(--ease-out);
}
/* src/components/CookieConsent.astro:159 — actual */
@keyframes dialog-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}
```

3. **Menú móvil**: entra con `menu-in`, pero se oculta con `hidden` sin salida.

```css
/* src/components/Header.astro:136 — actual */
.mobile-menu:not([hidden]) {
  animation: menu-in var(--t-ui) var(--ease-out);
}
/* src/components/Header.astro:155 — actual */
@keyframes menu-in {
  from { opacity: 0; transform: translateY(-8px); }
}
```

El playbook pide que las salidas también se animen y que las animaciones de `@keyframes` se sustituyan por transiciones cuando el elemento puede cerrarse a mitad de animación. Además, `global.css:46` tiene `[hidden] { display: none !important; }`. Ese detalle puede impedir la transición de `display` en la salida. Ver el paso de verificación.

## Target

Entrada y salida con transiciones (interrumpibles), usando las duraciones y la curva existentes (`--t-ui` 240ms, `--ease-out`). Sin `@keyframes`. Desplazamientos pequeños (12–16px), y en reduced motion solo opacidad.

```css
/* target — CookieConsent.astro: banner */
.cookie-banner {
  transition:
    opacity var(--t-ui) var(--ease-out),
    translate var(--t-ui) var(--ease-out),
    display var(--t-ui) allow-discrete;
}
.cookie-banner[hidden] {
  opacity: 0;
  translate: 0 16px;
}
@starting-style {
  .cookie-banner:not([hidden]) {
    opacity: 0;
    translate: 0 16px;
  }
}

/* target — CookieConsent.astro: diálogo */
.cookie-dialog {
  transition:
    opacity var(--t-ui) var(--ease-out),
    translate var(--t-ui) var(--ease-out),
    scale var(--t-ui) var(--ease-out),
    display var(--t-ui) allow-discrete,
    overlay var(--t-ui) allow-discrete;
}
.cookie-dialog:not([open]) {
  opacity: 0;
  translate: 0 12px;
  scale: 0.98;
}
@starting-style {
  .cookie-dialog[open] {
    opacity: 0;
    translate: 0 12px;
    scale: 0.98;
  }
}

/* target — Header.astro: menú móvil */
.mobile-menu {
  transition:
    opacity var(--t-ui) var(--ease-out),
    translate var(--t-ui) var(--ease-out),
    display var(--t-ui) allow-discrete;
}
.mobile-menu[hidden] {
  opacity: 0;
  translate: 0 -8px;
}
@starting-style {
  .mobile-menu:not([hidden]) {
    opacity: 0;
    translate: 0 -8px;
  }
}

/* target — reduced motion (mismos archivos): quitar desplazamiento, conservar opacidad */
@media (prefers-reduced-motion: reduce) {
  .cookie-banner,
  .cookie-banner:not([hidden]),
  .cookie-dialog,
  .cookie-dialog:not([open]),
  .mobile-menu,
  .mobile-menu:not([hidden]) {
    translate: none;
  }
}
```

## Repo conventions to follow

- Tokens de movimiento y curva en `src/styles/global.css:35-42`: `--ease-out`, `--t-ui` (240ms), `--t-hover` (180ms). No introducir valores nuevos.
- Ejemplo correcto de `@starting-style` con transición ya en el repo: `src/components/PlanTiles.astro:139-148`. Imitar ese bloque. No copiar la estructura de `@keyframes` del banner.
- Ejemplo de reduced motion que se respeta: `src/components/CookieConsent.astro:172` (con `animation: none`). Sustituir por el bloque `translate: none` del target, sin quitar la opacidad.

## Steps

1. En `src/components/CookieConsent.astro`, reemplazar el bloque `.cookie-banner:not([hidden]) { animation: banner-in ... }` (línea 66-68) por el bloque `.cookie-banner` + `.cookie-banner[hidden]` + `@starting-style` del target.
2. En el mismo archivo, reemplazar `.cookie-dialog[open] { animation: dialog-in ... }` (línea 130-132) por los bloques `.cookie-dialog` + `.cookie-dialog:not([open])` + `@starting-style` del target.
3. En el mismo archivo, eliminar los `@keyframes banner-in` y `@keyframes dialog-in` (líneas 153-162), porque ya no se usan.
4. En el mismo archivo, reemplazar el bloque `@media (prefers-reduced-motion: reduce)` (líneas 172-177, que tiene `animation: none`) por el bloque reduced motion del target, con los selectores de `.cookie-banner` y `.cookie-dialog`.
5. En `src/components/Header.astro`, reemplazar `.mobile-menu:not([hidden]) { animation: menu-in ... }` (línea 136-138) por los bloques `.mobile-menu` + `.mobile-menu[hidden]` + `@starting-style` del target.
6. En `src/components/Header.astro`, eliminar `@keyframes menu-in` (líneas 155-160) y el `@media (prefers-reduced-motion: reduce)` que tiene `animation: none` (líneas 161-165). Añadir el bloque reduced motion del target con los selectores de `.mobile-menu`.
7. NO cambiar `apply()`, `closeSettings()`, la lógica de `setTimeout(..., 500)` (líneas 250 y 267) ni `location.reload()`. El retraso de 500ms es decisión separada y se evalúa en la verificación sensorial.

## Boundaries

- NO tocar `src/styles/global.css`, en especial la regla `[hidden] { display: none !important }` (línea 46). Si la salida no se ve por esa regla, detenerse y reportar. No cambiar la regla global.
- NO tocar la lógica de consentimiento (`src/lib/consent.ts`, `src/lib/analytics.ts`) ni la recarga de la línea 224 de `CookieConsent.astro`, que es decisión documentada.
- NO cambiar marcado (HTML). Solo propiedades de movimiento y `@keyframes` eliminados.
- NO añadir dependencias.
- Si un paso no coincide con el código que encuentres (drift), DETENERSE y reportar.

## Verification

- **Mecánica**: `npm run lint` sin errores y `npm run build` (`astro check` + `astro build`) sin errores. `npm run test:e2e` debe seguir pasando en `tests/e2e/consent.spec.ts`.
- **Feel check**: ejecutar `npm run dev`, abrir DevTools → Animations y poner la velocidad en 10%:
  - Aceptar cookies: el banner baja 16px y se desvanece en ~240ms, sin corte. Si desaparece de golpe, la regla `[hidden]` de `global.css:46` está bloqueando la transición de `display`: reportar.
  - Abrir "Configurar", luego "Guardar": el diálogo se desvanece y se desplaza hacia abajo al cerrarse, sin cortes.
  - Abrir y cerrar el menú móvil (viewport < 64em): debe desvanecerse al cerrar.
  - Pulsar el botón del menú varias veces seguidas: la animación debe reanudar desde el estado actual, no reiniciarse desde cero.
  - Activar `prefers-reduced-motion` (DevTools → Rendering): solo debe cambiar la opacidad, sin desplazamiento.
  - Con el 500ms del diálogo tras guardar: anotar si se siente como lag. Si sí, reportarlo para una decisión aparte; no cambiar el valor en este plan.
- **Done when**: las tres salidas se animan en Chrome de escritorio y móvil, `lint` y `build` pasan, y `@keyframes banner-in`, `dialog-in` y `menu-in` ya no existen en los archivos.
