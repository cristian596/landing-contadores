# Planes de animación — plantilla-contadores

Generados por la auditoría `improve-animations` (esfuerzo `standard`). Todos los planes están en estado TODO.

| # | Título | Severidad | Estado | Archivos |
|---|---|---|---|---|
| 001 | Animar la salida del banner, el diálogo de cookies y el menú móvil | MEDIUM | TODO | `CookieConsent.astro`, `Header.astro` |
| 002 | Quitar el desplazamiento de las flechas con reduced motion | LOW | DONE* | `global.css`, `ServicesSummary.astro`, `PlanTiles.astro` |
| 003 | Ajustar la apertura del acordeón del FAQ a ≤ 240ms | LOW | DONE* | `Accordion.astro` |
| 004 | Eliminar el token `--ease-expo` sin uso | LOW | DONE* | `global.css` |

## Orden recomendado

1. **004** — cambio trivial de una línea, sin riesgo.
2. **003** — tres valores en un archivo.
3. **002** — toca `global.css`, así que va después de 004 para evitar conflictos.
4. **001** — el más complejo. Depende de comprobar en el navegador que la regla `[hidden] { display: none !important }` (`global.css:46`) no bloquea la transición de salida. Hacerlo al final, con la verificación completa.

## Dependencias

- 002 y 004 editan `src/styles/global.css` en líneas distintas (271-279 y 36). Se pueden hacer en cualquier orden, pero en serie.
- 001 no depende de los demás.
- 003 no depende de los demás.

## Notas

- Ningún plan requiere commit para validarse, pero el hash de la columna "Commit" queda como N/A porque la carpeta no tiene git.
- Cada plan tiene una verificación "feel check" (ver el propio plan). Las cifras de sensación se confirman en el navegador, no solo en el código.

*DONE: código aplicado y ESLint pasa. Falta el feel check en navegador y correr `npm run lint` (Prettier) y `npm run build` en Windows, porque en el entorno de Claude los binarios nativos de `node_modules` no coinciden.
