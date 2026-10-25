import { expect, test } from '@playwright/test';

const pages = [
  '/',
  '/servicios',
  '/planes',
  '/equipo',
  '/preguntas-frecuentes',
  '/contacto',
  '/politica-de-privacidad',
  '/tratamiento-de-datos',
  '/politica-de-cookies',
  '/configuracion-de-cookies',
  '/creditos',
];

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
});

for (const path of pages) {
  test(`${path} carga sin errores de consola y con los enlaces legales en el pie`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const footer = page.locator('footer');
    for (const name of [
      'Política de privacidad',
      'Tratamiento de datos personales',
      'Política de cookies',
      'Configuración de cookies',
    ]) {
      await expect(footer.getByRole('link', { name })).toBeVisible();
    }
    // Ninguna imagen sin texto alternativo (las decorativas llevan alt vacío a propósito).
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    // Sin scroll horizontal.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('una ruta inexistente devuelve la página 404 propia', async ({ page }) => {
  const response = await page.goto('/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('no está en nuestros libros');
});

test('el acordeón de preguntas se abre con teclado', async ({ page }) => {
  await page.goto('/preguntas-frecuentes');
  const summary = page.locator('summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  const first = page.locator('details').first();
  await expect(first).toHaveAttribute('open', '');
  // La respuesta debe verse de verdad (no solo el atributo open): altura real tras la transición.
  const answer = first.locator('.faq-a');
  await expect(answer).toBeVisible();
  await expect.poll(async () => (await first.boundingBox())?.height ?? 0).toBeGreaterThan(120);
  await expect(answer).toBeInViewport();
});

test('el buscador de planes recomienda y resalta un plan', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'cc_consent',
      JSON.stringify({ v: 1, necessary: true, analytics: false, ts: new Date().toISOString() }),
    ),
  );
  await page.goto('/planes');
  const finder = page.locator('[data-finder-form]');
  await finder.locator('label', { hasText: 'Solo, como independiente' }).click();
  await finder.locator('label', { hasText: /^Sí$/ }).click();
  await finder.locator('label', { hasText: 'Solo contabilidad y declaraciones' }).click();
  await expect(page.locator('[data-finder-result]')).toContainText('Plan Profesional');
  await expect(page.locator('.tile[data-plan="profesional"]')).toHaveAttribute('data-recommended', '');
});
