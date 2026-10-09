import { test, expect } from '@playwright/test';

test.describe('Tarea 10 - Tags, soft assertions y cross-browser', () => {

  // ============================================================
  // RETO 1 - TAGS MÚLTIPLES + --grep-invert
  // ============================================================

  test(
    'Reto 1 - Test con múltiples tags',
    {
      tag: ['@regression', '@ui'],
    },
    async ({ page }) => {

      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await expect(page).toHaveURL(/inventory/);
      await expect(page.locator('.inventory_container')).toBeVisible();

      console.log('Reto 1: test con múltiples tags ejecutado correctamente');
    }
  );


  // ============================================================
  // RETO 2 - expect.soft()
  // ============================================================

  test('Reto 2 - Verificar producto con soft assertions', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    const primerProducto = page.locator('.inventory_item').first();

    // Las siguientes verificaciones no detienen inmediatamente
    // el test si alguna falla.
    await expect.soft(
      primerProducto.locator('.inventory_item_name')
    ).toBeVisible();

    await expect.soft(
      primerProducto.locator('.inventory_item_desc')
    ).toBeVisible();

    await expect.soft(
      primerProducto.locator('.inventory_item_price')
    ).toBeVisible();

    await expect.soft(
      primerProducto.locator('img')
    ).toBeVisible();

    console.log('Reto 2: atributos del producto verificados con expect.soft()');
  });


  // ============================================================
  // RETO 3 - FIXTURE browserName
  // ============================================================

  test('Reto 3 - Assertion según browserName', async ({
    page,
    browserName,
  }) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    console.log(`Reto 3 ejecutándose en navegador: ${browserName}`);

    if (browserName === 'chromium') {

      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();

      console.log('Chromium: inventario visible correctamente');

    } else if (browserName === 'firefox') {

      await expect(
        page.locator('.inventory_list')
      ).toBeVisible();

      console.log('Firefox: lista de inventario visible correctamente');

    } else if (browserName === 'webkit') {

      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();

      console.log('WebKit: inventario visible correctamente');

    } else {

      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();

      console.log(`Navegador ${browserName}: inventario visible correctamente`);
    }
  });

});