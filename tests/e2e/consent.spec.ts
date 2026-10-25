import { expect, test, type Page } from '@playwright/test';

const GOOGLE = /googletagmanager\.com|google-analytics\.com/;

// Registra cada petición a Google y responde con un script vacío, para no depender de la red.
async function trackGoogle(page: Page) {
  const hits: string[] = [];
  await page.route(GOOGLE, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return hits;
}

test('la primera visita muestra el banner y no carga Google Analytics', async ({ page, context }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  const banner = page.getByRole('region', { name: 'Tu privacidad, tus reglas' });
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Aceptar todas' })).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Rechazar no esenciales' })).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Configurar' })).toBeVisible();
  await page.waitForTimeout(800);
  expect(hits).toHaveLength(0);
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  expect((await context.cookies()).some((c) => c.name.startsWith('_ga'))).toBe(false);
});

test('rechazar no esenciales guarda la elección y nunca carga GA', async ({ page }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Rechazar no esenciales' }).first().click();
  await expect(page.getByRole('region', { name: 'Tu privacidad, tus reglas' })).toBeHidden();
  await page.reload();
  await page.goto('/servicios');
  await expect(page.getByRole('region', { name: 'Tu privacidad, tus reglas' })).toBeHidden();
  await page.waitForTimeout(800);
  expect(hits).toHaveLength(0);
});

test('aceptar todas carga GA4 solo después del consentimiento', async ({ page }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await page.waitForTimeout(500);
  expect(hits).toHaveLength(0);
  await page.getByRole('button', { name: 'Aceptar todas' }).first().click();
  await expect.poll(() => hits.length).toBeGreaterThan(0);
  expect(hits[0]).toContain('gtag/js?id=G-TEST12345');
  // En la siguiente página se carga directamente, sin volver a preguntar.
  await page.goto('/planes');
  await expect(page.getByRole('region', { name: 'Tu privacidad, tus reglas' })).toBeHidden();
  await expect(page.locator('script[data-ga4]')).toHaveCount(1);
});

test('el panel permite activar solo la analítica y luego retirarla', async ({ page, context }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Configurar' }).click();
  const dialog = page.getByRole('dialog', { name: 'Configuración de cookies' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('switch', { name: 'Necesarias' })).toBeChecked();
  await expect(dialog.getByRole('switch', { name: 'Necesarias' })).toBeDisabled();
  const analytics = dialog.getByRole('switch', { name: 'Analítica' });
  await expect(analytics).not.toBeChecked();
  await analytics.check();
  await dialog.getByRole('button', { name: 'Guardar preferencias' }).click();
  await expect.poll(() => hits.length).toBeGreaterThan(0);

  // Simula la cookie que crearía GA y retira el consentimiento desde el pie de página.
  await page.evaluate(() => (document.cookie = '_ga=GA1.1.123.456; path=/'));
  await page.getByRole('link', { name: 'Configuración de cookies' }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('switch', { name: 'Analítica' }).uncheck();
  await dialog.getByRole('button', { name: 'Guardar preferencias' }).click();
  await page.waitForLoadState('load');
  await expect.poll(async () => (await context.cookies()).some((c) => c.name === '_ga')).toBe(false);
});

test('la página de configuración funciona y refleja la elección', async ({ page }) => {
  await trackGoogle(page);
  await page.goto('/configuracion-de-cookies');
  await page.getByRole('button', { name: 'Rechazar no esenciales' }).first().click();
  await page.reload();
  await expect(page.locator('#page-analytics')).not.toBeChecked();
});
