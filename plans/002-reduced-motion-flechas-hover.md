# 002 — Quitar el desplazamiento de las flechas en hover y en press cuando hay reduced motion

- **Status**: DONE (código aplicado; falta feel check en navegador)
- **Commit**: N/A — la carpeta no tiene repositorio git. Registrar el hash cuando exista.
- **Severity**: LOW
- **Category**: Accesibilidad (AUDIT §6)
- **Estimated scope**: 3 archivos, ~6 bloques de CSS

## Problema

Varios desplazamientos horizontales de 3–4px en las flechas están protegidos por `(hover: hover) and (pointer: fine)`, pero no por `prefers-reduced-motion`. Quien tiene reduced motion sigue viendo el movimiento.

```css
/* src/styles/global.css:271-279 — actual */
@media (hover: hover) and (pointer: fine) {
  .button:hover { background: var(--accent-strong); }
  .button--ink:hover { background: var(--field-deep); }
  .button:hover .arrow {
    transform: translateX(3px);
  }
  ...
}
```

```astro
/* src/components/ServicesSummary.astro:98-107 — actual */
@media (hover: hover) and (pointer: fine) {
  .item:hover { background: var(--field); color: var(--on-field); }
  .item:hover .item-text { color: var(--on-field-muted); }
  .item:hover :global(.item-arrow) {
    transform: translateX(4px);
  }
}
```

```astro
/* src/components/PlanTiles.astro:266-270 — actual (press) */
.tile-action:active .arrow {
  transform: translateX(4px);
}
/* src/components/PlanTiles.astro:318-327 — actual (hover) */
@media (hover: hover) and (pointer: fine) {
  .tile:hover { translate: 0 -4px; }
  .tile-action:hover .arrow { transform: translateX(4px); }
  .tile-action:hover { filter: brightness(0.96); }
}
```

Lo que se queda igual: el cambio de color en hover, `filter: brightness`, el `scale(0.97)`/`scale(0.99)` de `:active` (son feedback de press, no movimiento de posición) y el `.tile:hover { translate }` que ya tiene override de reduced motion en `PlanTiles.astro:328`.

## Target

Los desplazamientos de posición de las flechas solo se aplican cuando el usuario NO pide reduced motion. Sigue el mismo patrón que `TeamCards.astro:132`.

```css
/* target — global.css: añadir un bloque nuevo tras el bloque hover existente */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .button:hover .arrow {
    transform: translateX(3px);
  }
}
```

```css
/* target — ServicesSummary.astro: sacar la flecha del bloque de color */
@media (hover: hover) and (pointer: fine) {
  .item:hover { background: var(--field); color: var(--on-field); }
  .item:hover .item-text { color: var(--on-field-muted); }
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .item:hover :global(.item-arrow) {
    transform: translateX(4px);
  }
}
```

```css
/* target — PlanTiles.astro: press y hover de la flecha, solo sin reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .tile-action:active .arrow {
    transform: translateX(4px);
  }
}
@media (hover: hover) and (pointer: fine) {
  .tile:hover { translate: 0 -4px; }
  .tile-action:hover { filter: brightness(0.96); }
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .tile-action:hover .arrow {
    transform: translateX(4px);
  }
}
```

## Repo conventions to follow

- Patrón a imitar, ya en el repo: `src/components/TeamCards.astro:132` usa `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`.
- No cambiar las transiciones de `.arrow` (`transition: transform var(--t-ui) var(--ease-out)`, p. ej. `global.css:262`): solo se condiciona el valor de `transform`.

## Steps

1. En `src/styles/global.css`, dentro del bloque `@media (hover: hover) and (pointer: fine)` (línea 271), quitar la regla `.button:hover .arrow { transform: translateX(3px); }` y añadir el bloque nuevo del target, justo después de ese bloque.
2. En `src/components/ServicesSummary.astro`, quitar `.item:hover :global(.item-arrow)` del bloque de hover (líneas 98-107) y añadir el bloque nuevo del target.
3. En `src/components/PlanTiles.astro`, envolver `.tile-action:active .arrow` (líneas 266-270) en `@media (prefers-reduced-motion: no-preference)`.
4. En `src/components/PlanTiles.astro`, quitar `.tile-action:hover .arrow` del bloque de hover (línea 321) y añadir el bloque nuevo del target.

## Boundaries

- NO cambiar `.tile:hover { translate }`, que ya tiene override en `PlanTiles.astro:328`.
- NO tocar `.button:active { transform: scale(0.97) }` (`global.css:254`) ni `.item:active { scale(0.99) }`: son feedback de press.
- NO cambiar colores, `filter` ni transiciones de duración.
- NO cambiar marcado.
- NO añadir dependencias.
- Si un selector no aparece exactamente como en este plan, DETENERSE y reportar.

## Verification

- **Mecánica**: `npm run lint` y `npm run build` sin errores. `grep -rn "translateX" src` debe mostrar cada `translateX` de flechas dentro de un bloque con `prefers-reduced-motion: no-preference`.
- **Feel check**: `npm run dev`:
  - Con reduced motion desactivado: al pasar el cursor por "Agenda una consulta", la flecha se desplaza 3px. Al pasar por un servicio, la flecha se desplaza 4px. Igual con el botón de un plan.
  - Con reduced motion activado (DevTools → Rendering): el color de fondo cambia igual, pero la flecha no se mueve.
  - Pulsar un botón de plan con reduced motion activado: no debe haber desplazamiento de flecha, solo el cambio de fondo.
- **Done when**: en modo reduced motion ninguna flecha cambia de posición, y con reduced motion desactivado el comportamiento actual se mantiene sin cambios visibles.
