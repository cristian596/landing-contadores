# 004 — Eliminar el token `--ease-expo` sin uso

- **Status**: DONE (código aplicado; falta feel check en navegador)
- **Commit**: N/A — la carpeta no tiene repositorio git. Registrar el hash cuando exista.
- **Severity**: LOW
- **Category**: Cohesión y tokens (AUDIT §7)
- **Estimated scope**: 1 archivo, 1 línea

## Problema

`--ease-expo` está definido, pero no lo usa ningún archivo de `src/`. Es casi idéntico a `--ease-out`, así que añade ruido y puede inducir a usar la curva equivocada.

```css
/* src/styles/global.css:35-38 — actual */
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
--ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
```

Verificación previa: `grep -rn "ease-expo" src` solo devuelve la definición en `global.css:36`.

## Target

El token desaparece. Los demás (`--ease-out`, `--ease-in-out`, `--ease-soft`) quedan igual.

```css
/* target — global.css:35-38 */
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
--ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
```

## Repo conventions to follow

- Los tokens de movimiento viven en `:root` de `src/styles/global.css:35-42`. Mantener esa ubicación.
- No cambiar `--ease-out`: sus valores son válidos y coherentes con los del repo.

## Steps

1. Confirmar con `grep -rn "ease-expo" src` que solo aparece la línea 36 de `global.css`. Si aparece en otro sitio, DETENERSE y reportar.
2. Eliminar la línea `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);` de `src/styles/global.css` (línea 36).

## Boundaries

- NO cambiar `--ease-out`, `--ease-in-out` ni `--ease-soft`.
- NO tocar otros tokens (`--t-*`, `--radius`, etc.).
- NO añadir dependencias.

## Verification

- **Mecánica**: `grep -rn "ease-expo" src` no debe devolver resultados. `npm run lint` y `npm run build` sin errores.
- **Feel check**: no aplica, porque no cambia ningún valor en uso. Basta con comprobar que el sitio se ve igual en la portada.
- **Done when**: `grep` no encuentra `ease-expo` en `src/` y el build pasa.
