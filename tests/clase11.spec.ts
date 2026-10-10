import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';

test.describe('Clase 11 - Gestión de Bugs en Practice Test Automation', () => {

  // 1. Página principal
  test('Página principal carga correctamente', { tag: '@smoke' }, async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page).toHaveTitle(/Automation Testing Practice/);
    await expect(page.getByRole('heading', { level: 1 }))
      .toContainText('Automation Testing Practice');
  });

  // 2. Login válido
  test('Login básico: credenciales válidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('#submit-login').click();

    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator('#flash'))
      .toContainText('You logged into a secure area');

    await page.screenshot({
      path: './evidencias/login-exitoso-practice.png'
    });
  });

  // 3. Login inválido
  test('Login básico: credenciales inválidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('#username').fill('usuario_incorrecto');
    await page.locator('#password').fill('password_incorrecta');
    await page.locator('#submit-login').click();

    const errorMsg = page.locator('#flash');

    await expect(errorMsg).toBeVisible();
    await expect(errorMsg)
      .toContainText('Your username is invalid');

    await page.screenshot({
      path: './evidencias/login-fallido-practice.png'
    });
  });

  // 4. Elementos dinámicos
  test('Elementos dinámicos: el checkbox desaparece y vuelve', async ({ page }) => {
    await page.goto(`${BASE_URL}/dynamic-controls`);

    const checkbox = page.locator(
      '#checkbox-example input[type="checkbox"]'
    );

    await expect(checkbox).toBeVisible();

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.locator('#message'))
      .toHaveText("It's gone!", { timeout: 15000 });

    await expect(checkbox).toBeHidden();

    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.locator('#message'))
      .toHaveText("It's back!", { timeout: 15000 });

    await expect(checkbox).toBeVisible();
  });

  // 5. Alert
  test('Manejo de alertas del navegador', async ({ page }) => {
    await page.goto(`${BASE_URL}/js-dialogs`);

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a Js Alert');

      await dialog.accept();
    });

    await page.locator('#js-alert').click();

    await expect(page.locator('#dialog-response'))
      .toHaveText('OK');
  });

  // 6. Confirm dialog
  test('Manejo de confirm dialog', async ({ page }) => {
    await page.goto(`${BASE_URL}/js-dialogs`);

    page.on('dialog', async dialog => {
      if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    });

    await page.locator('#js-confirm').click();

    await expect(page.locator('#dialog-response'))
      .toHaveText('Ok');
  });

  // 7. Tabla
  test(
    'Tabla: ordenar por Last Name de forma ascendente y descendente',
    async ({ page }) => {

      await page.goto(`${BASE_URL}/tables`);

      const encabezado = page
        .locator('table#table1 thead th')
        .filter({ hasText: 'Last Name' });

      const apellidos = page.locator(
        'table#table1 tbody tr td:nth-child(1)'
      );

      const actuales = await apellidos.allTextContents();

      const ascendente = [...actuales].sort((a, b) =>
        a.localeCompare(b)
      );

      // La tabla se reordena después del clic.
      await encabezado.click();

      await expect(apellidos).toHaveText(ascendente);

      await encabezado.click();

      await expect(apellidos)
        .toHaveText([...ascendente].reverse());

      await page.locator('table#table1').screenshot({
        path: './evidencias/tabla-datos.png'
      });
    }
  );

  // 8. Evidencia en reporte HTML
  test(
    'Adjuntar evidencia al reporte HTML',
    async ({ page }, testInfo) => {

      await page.goto(`${BASE_URL}/login`);

      await page.locator('#username').fill('practice');
      await page.locator('#password').fill('SuperSecretPassword!');
      await page.locator('#submit-login').click();

      await expect(page.locator('#flash')).toBeVisible();

      const captura = await page.screenshot({
        fullPage: true
      });

      await testInfo.attach('screenshot-login-exitoso', {
        body: captura,
        contentType: 'image/png',
      });

      await testInfo.attach('datos-del-test', {
        body: `Usuario: practice | Ambiente: ${BASE_URL}`,
        contentType: 'text/plain',
      });

      await expect(page.locator('#flash'))
        .toContainText('You logged into a secure area');
    }
  );

  // 9. Defecto conocido
  test(
    'Imágenes rotas: todas las imágenes de la página deben cargar',
    { tag: '@bug' },
    async ({ page }) => {

      // Defecto conocido BUG-001.
      // Se mantiene en verde mientras el defecto siga abierto.
      //test.fail(
       // true,
        //'BUG-001: asdf.jpg y hjkl.jpg responden 404'
      //);

      test.info().annotations.push({
        type: 'bug',
        description: 'bug-report-clase11.md'
      });

      await page.goto(`${BASE_URL}/broken-images`);

      const imagenes = page.locator('main img');

      // Una imagen sin cargar también puede medir 0.
      await expect.poll(() =>
        imagenes.evaluateAll(imgs =>
          imgs.every(img =>
            (img as HTMLImageElement).complete
          )
        )
      ).toBe(true);

      const anchos = await imagenes.evaluateAll(imgs =>
        imgs.map(img =>
          (img as HTMLImageElement).naturalWidth
        )
      );

      for (const ancho of anchos) {
        expect(ancho).toBeGreaterThan(0);
      }
    }
  );

});