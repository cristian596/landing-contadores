# [Nombre de la firma] · Sitio web

Sitio estático para una firma de contabilidad y asesoría financiera dirigida a contadores y consultores
independientes en Colombia.

## Stack y por qué

- **Astro 7 (SSG) + TypeScript.** Es un sitio de contenido sin cuentas ni base de datos: Astro genera HTML
  estático por página (buen SEO y LCP), envía 0 KB de framework y solo unos pocos scripts pequeños (banner de
  cookies, menú, formulario, buscador de planes). El checklist recomienda Astro/SSG cuando prima el contenido y
  pide no añadir backend sin necesidad.
- **CSS propio con tokens** (`src/styles/global.css`): una paleta, una tipografía (Instrument Sans, autoalojada) y
  cinco tamaños.
- **Imágenes** de Unsplash descargadas en `src/assets/photos/`; Astro las convierte a AVIF/WebP con `srcset`.
- **Formulario** enviado a un servicio externo configurable (p. ej. Formspree). No hay servidor propio.
- **Calidad:** ESLint, Prettier, `astro check`, Vitest (unitarias) y Playwright (E2E en Chrome escritorio y móvil).

## Ejecutar en local

Requisitos: Node 22.23 o superior (probado con Node 24.14) y npm.

```bash
npm install
cp .env.example .env    # y completa los valores
npm run dev             # http://localhost:4321
```

Otros comandos:

| Comando            | Qué hace                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `npm run build`    | `astro check` + compilación a `dist/`                                                           |
| `npm run preview`  | Sirve `dist/` para revisarlo como en producción                                                 |
| `npm run lint`     | ESLint + Prettier (verificación)                                                                |
| `npm run format`   | Formatea con Prettier                                                                           |
| `npm test`         | Pruebas unitarias (Vitest)                                                                      |
| `npm run test:e2e` | Pruebas E2E (Playwright, usa el Chrome instalado). Compila en `dist-e2e/` con valores de prueba |
| `npm run audit`    | Auditoría de dependencias de producción                                                         |

Astro solo permite un `astro preview` a la vez: detén el que tengas abierto antes de `npm run test:e2e`.

### Banco de pruebas con datos extremos (solo desarrollo)

Con `npm run dev`, abre `http://localhost:4321/dev/extremo`. Un conmutador abajo al centro alterna entre
**Demo / Peor caso / Vacío / Uno** (nombres muy largos, correos sin espacios, árabe y japonés, precios de 10
dígitos, listas vacías). Los datos están en `src/dev/fixtures.ts`. Estas rutas no se generan en producción.

## Variables de entorno

Ninguna es secreta: todas terminan en el HTML público.

| Variable               | Uso                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`      | Dominio definitivo (canonical, sitemap, Open Graph)                                               |
| `PUBLIC_GA_ID`         | ID de Google Analytics 4 (`G-XXXXXXX`). Solo se carga si el visitante acepta la analítica         |
| `PUBLIC_FORM_ENDPOINT` | URL del servicio de formularios. Vacía = el formulario muestra un error en vez de fingir el envío |

El dominio del endpoint se añade automáticamente a la CSP (`connect-src` y `form-action`).

## Cookies y Google Analytics

- `src/lib/consent.ts` guarda la elección en `localStorage` (`cc_consent`), con versión y caducidad de 12 meses.
- `src/lib/analytics.ts` inserta `gtag.js` **solo** después de aceptar la categoría de analítica (Consent Mode v2,
  señales de publicidad denegadas). Al retirar el consentimiento borra las cookies `_ga*` y recarga.
- Banner: «Aceptar todas», «Rechazar no esenciales», «Configurar». El enlace «Configuración de cookies» del pie
  reabre el panel en cualquier página; `/configuracion-de-cookies` ofrece el mismo panel.

## Despliegue

Es un sitio estático: sirve la carpeta `dist/` en cualquier hosting (Netlify, Cloudflare Pages, Vercel, S3 +
CloudFront…).

- `public/_headers` trae HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `frame-ancestors` y caché inmutable para `/_astro/*` (formato Netlify / Cloudflare Pages). En otro hosting,
  traslada esos encabezados a su configuración.
- La CSP de scripts y estilos la genera Astro en cada página como `<meta>` con hashes.
- Actualiza el dominio de `public/robots.txt` y define `PUBLIC_SITE_URL`.
- Rollback: vuelve a publicar el `dist/` anterior (o usa el historial de despliegues del hosting).
- Tras publicar: abre las páginas principales, acepta y rechaza cookies, envía el formulario de prueba.

## Estructura

```
src/config/site.ts     Datos de la firma (placeholders entre corchetes)
src/data/              Servicios, planes, equipo, preguntas, fotos y créditos
src/lib/               Consentimiento, analítica, validación del formulario, buscador de planes
src/components/        Secciones y piezas reutilizables
src/layouts/           Base (SEO, cabecera, pie, banner) y Legal
src/pages/             Rutas del sitio (y /dev/* solo en desarrollo)
tests/unit, tests/e2e  Pruebas
```

## Antes de publicar

Reemplaza los placeholders (todo lo que está entre corchetes y los precios `$XXX.XXX`) en `src/config/site.ts`,
`src/data/*.ts` y las páginas legales; haz revisar los textos legales por un asesor; sustituye los retratos de
archivo por fotos reales del equipo.
