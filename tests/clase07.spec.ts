import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Clase 07 - Evidencias de pruebas', () => {

  // =========================================================
  // TEST 1
  // Login exitoso - evidencia completa
  // =========================================================

  test('Login exitoso - evidencia completa', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Navegar a Sauce Demo
    await loginPage.navigate();

    // Screenshot antes del login
    await page.screenshot({
      path: './evidencias/clase07-antes-login.png',
      fullPage: true
    });

    // Iniciar sesión
    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

    // Verificar que llegamos al inventario
    await inventoryPage.expectToBeOnInventoryPage();

    // Screenshot después del login
    await page.screenshot({
      path: './evidencias/clase07-despues-login.png',
      fullPage: true
    });

    console.log(
      'Login documentado con screenshots'
    );
  });


  // =========================================================
  // TEST 2
  // Documentar el flujo de compra completo
  // =========================================================

  test('Documentar el flujo de compra completo', async ({ page }) => {

    const loginPage = new LoginPage(page);

    // Navegar a Sauce Demo
    await loginPage.navigate();

    // Login
    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

    // Verificar navegación al inventario
    await expect(page).toHaveURL(/inventory/);

    // Screenshot del inventario
    await page.screenshot({
      path: './evidencias/clase07-inventario.png'
    });

    // Agregar el primer producto al carrito
    await page
      .locator('.btn_inventory')
      .first()
      .click();

    // Obtener el nombre del producto agregado
    const nombreProducto = await page
      .locator('.inventory_item_name')
      .first()
      .textContent();

    // Screenshot con producto agregado
    await page.screenshot({
      path: './evidencias/clase07-producto-agregado.png'
    });

    // Ir al carrito
    await page
      .locator('.shopping_cart_link')
      .click();

    // Verificar que llegamos al carrito
    await expect(page).toHaveURL(/cart/);

    // Screenshot del carrito
    await page.screenshot({
      path: './evidencias/clase07-carrito.png',
      fullPage: true
    });

    // Verificar que exista exactamente un producto
    await expect(
      page.locator('.cart_item')
    ).toHaveCount(1);

    // Verificar que sea el mismo producto agregado
    await expect(
      page.locator('.inventory_item_name')
    ).toContainText(nombreProducto!);

    console.log(
      `Flujo documentado. Producto: ${nombreProducto}`
    );
  });


  // =========================================================
  // TEST 3
  // Capturar el momento exacto de un defecto esperado
  // =========================================================

  test(
    'Capturar el momento exacto de un defecto esperado',
    async ({ page }) => {

      const loginPage = new LoginPage(page);

      // Navegar
      await loginPage.navigate();

      // Intentar login con usuario bloqueado
      await loginPage.login(
        'locked_out_user',
        'secret_sauce'
      );

      // Localizar el mensaje de error
      const errorElement = page.locator(
        '[data-test="error"]'
      );

      // Verificar que sea visible
      await expect(
        errorElement
      ).toBeVisible();

      // Screenshot únicamente del mensaje de error
      await errorElement.screenshot({
        path: './evidencias/clase07-error-usuario-bloqueado.png'
      });

      // Obtener texto del error
      const textoError =
        await errorElement.textContent();

      console.log(
        `Error capturado: ${textoError}`
      );
    }
  );


  // =========================================================
  // TEST 4
  // Comparar estados antes y después de una acción
  // =========================================================

  test(
    'Comparar estados antes y después de una acción',
    async ({ page }) => {

      const loginPage = new LoginPage(page);

      // Navegar
      await loginPage.navigate();

      // Login
      await loginPage.login(
        'standard_user',
        'secret_sauce'
      );

      // Estado ANTES:
      // todavía no existen productos en el carrito
      const estadoAntes = await page
        .locator('.shopping_cart_badge')
        .isVisible();

      console.log(
        `Badge visible antes de agregar producto: ${estadoAntes}`
      );

      // Screenshot antes de la acción
      await page.screenshot({
        path: './evidencias/clase07-estado-antes.png'
      });

      // Acción:
      // agregar primer producto
      await page
        .locator('.btn_inventory')
        .first()
        .click();

      // Estado DESPUÉS:
      // debe aparecer el badge
      const badgeDespues = page.locator(
        '.shopping_cart_badge'
      );

      await expect(
        badgeDespues
      ).toBeVisible();

      await expect(
        badgeDespues
      ).toHaveText('1');

      // Screenshot después de la acción
      await page.screenshot({
        path: './evidencias/clase07-estado-despues.png'
      });

      console.log(
        'Estado antes y después documentados correctamente'
      );
    }
  );

});