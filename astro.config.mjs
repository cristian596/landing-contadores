// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/** @param {string | undefined} url */
const originOf = (url) => {
  try {
    return url ? new URL(url).origin : '';
  } catch {
    return '';
  }
};
const formOrigin = originOf(env.PUBLIC_FORM_ENDPOINT);

export default defineConfig({
  // Dominio definitivo: se configura en PUBLIC_SITE_URL (ver .env.example).
  site: env.PUBLIC_SITE_URL || 'https://www.ejemplo.com',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  security: {
    // Astro calcula los hashes de cada script y estilo propio y los publica en un <meta> CSP.
    // Los encabezados que un <meta> no puede fijar (frame-ancestors, HSTS…) están en public/_headers.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
        "font-src 'self'",
        `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${formOrigin ? ' ' + formOrigin : ''}`,
        `form-action 'self'${formOrigin ? ' ' + formOrigin : ''}`,
      ],
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
    },
  },
});
