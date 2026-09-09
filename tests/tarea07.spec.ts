import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Tarea 07 - Evidencias avanzadas en Playwright', () => {

  // =========================================================
  // RETO 1 - test.step()
  // Estructurar una prueba en pasos nombrados
  // =========================================================

  test('Reto 1 - Flujo de login utilizando test.step()', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Navegar a Sauce Demo', async () => {

      await loginPage.navigate();

      await expect(page).toHaveURL(
        /saucedemo/
      );
    });


    await test.step('Iniciar sesión', async () => {

      await loginPage.login(
        'standard_user',
        'secret_sauce'
      );
    });


    await test.step('Verificar acceso al inventario', async () => {

      await inventoryPage
        .expectToBeOnInventoryPage();

      await expect(
        inventoryPage.inventoryContainer
      ).toBeVisible();
    });


    console.log(
      'Reto 1: flujo ejecutado correctamente con test.step()'
    );
  });


  // =========================================================
  // RETO 2 - testInfo.attach()
  // Adjuntar información capturada al reporte HTML
  // =========================================================

  test(
    'Reto 2 - Adjuntar datos utilizando testInfo.attach()',
    async ({ page }, testInfo) => {

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Navegar
      await loginPage.navigate();

      // Login
      await loginPage.login(
        'standard_user',
        'secret_sauce'
      );

      await inventoryPage
        .expectToBeOnInventoryPage();

      // Obtener cantidad de productos
      const cantidadProductos =
        await inventoryPage
          .getProductCount();

      // Obtener URL actual
      const urlActual = page.url();

      // Obtener fecha y hora de ejecución
      const fechaEjecucion =
        new Date().toLocaleString();

      // Construir contenido del archivo de texto
      const datosCapturados = `
DATOS CAPTURADOS DURANTE LA PRUEBA

Cantidad de productos: ${cantidadProductos}
URL actual: ${urlActual}
Fecha de ejecución: ${fechaEjecucion}
      `.trim();

      // Adjuntar información al reporte HTML
      await testInfo.attach(
        'datos-capturados.txt',
        {
          body: datosCapturados,
          contentType: 'text/plain'
        }
      );

      // Verificación adicional
      expect(
        cantidadProductos
      ).toBe(6);

      console.log(
        'Reto 2: datos adjuntados correctamente al reporte HTML'
      );
    }
  );


  // =========================================================
  // RETO 3 - toHaveScreenshot()
  // Comparación visual mediante una imagen baseline
  // =========================================================

  test(
    'Reto 3 - Comparación visual utilizando toHaveScreenshot()',
    async ({ page }) => {

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Navegar
      await loginPage.navigate();

      // Login
      await loginPage.login(
        'standard_user',
        'secret_sauce'
      );

      // Verificar inventario
      await inventoryPage
        .expectToBeOnInventoryPage();

      // Esperar a que los productos estén visibles
      await expect(
        inventoryPage.inventoryItems.first()
      ).toBeVisible();

      /*
       * Compara la pantalla actual contra una
       * imagen de referencia (baseline).
       */
      await expect(page).toHaveScreenshot(
        'inventario-sauce-demo.png',
        {
          fullPage: true,
          animations: 'disabled'
        }
      );

      console.log(
        'Reto 3: comparación visual ejecutada correctamente'
      );
    }
  );

});