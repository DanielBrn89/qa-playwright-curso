import {
  test,
  expect,
  type BrowserContext,
  type Page
} from '@playwright/test';

import {
  loginAs
} from '../helpers/auth';


// ==========================================================
// RETO 1
// SUITE SERIAL CON PÁGINA COMPARTIDA
// ==========================================================

test.describe(
  'Reto 1 - Suite serial con página compartida',
  () => {

    test.describe.configure({
      mode: 'serial'
    });

    let context: BrowserContext;
    let sharedPage: Page;


    // Se ejecuta una sola vez
    // antes de toda esta suite
    test.beforeAll(
      async ({ browser }) => {

        context =
          await browser.newContext();

        sharedPage =
          await context.newPage();

        console.log(
          'Página compartida creada en beforeAll'
        );
      }
    );


    // Se ejecuta una sola vez
    // después de toda la suite
    test.afterAll(
      async () => {

        await context.close();

        console.log(
          'Contexto compartido cerrado en afterAll'
        );
      }
    );


    // TEST 1 DE LA SUITE SERIAL
    test(
      'Iniciar sesión utilizando la página compartida',
      async () => {

        await loginAs(
          sharedPage,
          'standard_user'
        );

        await expect(
          sharedPage
        ).toHaveURL(
          /inventory/
        );

        console.log(
          'Login realizado en la página compartida'
        );
      }
    );


    // TEST 2 DE LA SUITE SERIAL
    test(
      'Reutilizar la misma página para agregar un producto',
      async () => {

        /*
         * No hacemos login de nuevo.
         * Este test continúa usando la page
         * creada en beforeAll.
         */

        await expect(
          sharedPage
        ).toHaveURL(
          /inventory/
        );

        await sharedPage
          .locator(
            '.btn_inventory'
          )
          .first()
          .click();

        const badge =
          sharedPage.locator(
            '.shopping_cart_badge'
          );

        await expect(
          badge
        ).toBeVisible();

        await expect(
          badge
        ).toHaveText('1');

        console.log(
          'La misma página fue reutilizada correctamente'
        );
      }
    );

  }
);


// ==========================================================
// RETO 2
// test.slow()
// ==========================================================

test(
  'Reto 2 - Usuario con lentitud utilizando test.slow()',
  async ({ page }) => {

    /*
     * test.slow() triplica el timeout
     * disponible para este test.
     */
    test.slow();

    const inicio =
      Date.now();

    await loginAs(
      page,
      'performance_glitch_user'
    );

    const tiempoLogin =
      Date.now() - inicio;

    console.log(
      `Tiempo de login con test.slow(): ${tiempoLogin}ms`
    );

    await expect(page)
      .toHaveURL(
        /inventory/
      );

    expect(
      tiempoLogin
    ).toBeGreaterThan(0);
  }
);


// ==========================================================
// RETO 3
// test.skip() DINÁMICO
// ==========================================================

test(
  'Reto 3 - Skip dinámico según condición de ejecución',
  async ({ page }, testInfo) => {

    /*
     * La condición se evalúa durante
     * la ejecución del propio test.
     *
     * En nuestro proyecto solo usamos Chromium.
     * Este escenario se omite intencionalmente
     * en Chromium para demostrar test.skip().
     */

    const ejecutandoEnChromium =
      testInfo.project.name ===
      'chromium';

    test.skip(
      ejecutandoEnChromium,
      'Prueba omitida dinámicamente en Chromium para demostrar test.skip()'
    );

    /*
     * Este código solamente se ejecutaría
     * si la condición anterior fuera falsa.
     */

    await loginAs(
      page,
      'standard_user'
    );

    await expect(page)
      .toHaveURL(
        /inventory/
      );
  }
);