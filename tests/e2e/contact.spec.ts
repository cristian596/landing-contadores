import { expect, test } from '@playwright/test';

const ENDPOINT = 'https://formularios.example.test/enviar';

test.beforeEach(async ({ page }) => {
  // Evita que el banner de cookies tape el formulario: se guarda una elección antes de cargar.
  await page.addInitScript(() => {
    localStorage.setItem(
      'cc_consent',
      JSON.stringify({ v: 1, necessary: true, analytics: false, ts: new Date().toISOString() }),
    );
  });
});

async function fillForm(page: import('@playwright/test').Page) {
  await page.getByLabel('Nombre completo').fill('Ana Pérez');
  await page.getByLabel('Correo electrónico').fill('ana@ejemplo.co');
  await page.getByLabel('Teléfono (opcional)').fill('+57 300 000 0000');
  await page.getByLabel('Servicio de interés').selectOption('Nómina');
  await page.getByLabel('Mensaje').fill('Necesito ayuda con la nómina de dos personas.');
}

test('la casilla de tratamiento de datos empieza sin marcar y enlaza a la política', async ({ page }) => {
  await page.goto('/contacto');
  const consent = page.getByRole('checkbox', { name: /Acepto el tratamiento de mis datos personales/ });
  await expect(consent).not.toBeChecked();
  await expect(page.getByRole('link', { name: 'Política de tratamiento de datos' }).first()).toHaveAttribute(
    'href',
    '/tratamiento-de-datos',
  );
});

test('el formulario no se envía sin aceptar el tratamiento de datos', async ({ page }) => {
  let sent = 0;
  await page.route(ENDPOINT, (route) => {
    sent++;
    return route.fulfill({ status: 200, body: '{}' });
  });
  await page.goto('/contacto');
  await fillForm(page);
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('#cf-consent-error')).toContainText('Debes aceptar');
  await expect(page.getByRole('checkbox', { name: /Acepto el tratamiento/ })).toBeFocused();
  await page.waitForTimeout(500);
  expect(sent).toBe(0);
});

test('con la casilla marcada se envía al servicio y confirma', async ({ page }) => {
  let body: Record<string, unknown> | null = null;
  await page.route(ENDPOINT, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto('/contacto?plan=profesional');
  await fillForm(page);
  await page.getByRole('checkbox', { name: /Acepto el tratamiento/ }).check();
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Gracias' })).toBeVisible();
  expect(body).toMatchObject({
    correo: 'ana@ejemplo.co',
    plan: 'Profesional',
    autoriza_tratamiento_datos: true,
  });
});

test('muestra los errores de campos vacíos sin enviar', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('#cf-name-error')).toBeVisible();
  await expect(page.locator('#cf-email-error')).toBeVisible();
  await expect(page.getByLabel('Nombre completo')).toHaveAttribute('aria-invalid', 'true');
});

test('si el servicio falla, avisa con un error en vez de fingir éxito', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, body: 'error' }));
  await page.goto('/contacto');
  await fillForm(page);
  await page.getByRole('checkbox', { name: /Acepto el tratamiento/ }).check();
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'No pudimos enviar' })).toBeVisible();
});
