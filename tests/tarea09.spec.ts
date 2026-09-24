import {
  test as base,
  expect,
  type Page
} from '@playwright/test';

type TestFixtures = {

  timedPage: Page;

};


type WorkerFixtures = {

  workerCounter: {
    value: number;
  };

};

const test =
  base.extend<
    TestFixtures,
    WorkerFixtures
  >({

    timedPage:
      async (
        { page },
        use,
        testInfo
      ) => {

        // SETUP
        const inicio =
          Date.now();

        console.log(
          `[SETUP] Cronómetro iniciado para: ${testInfo.title}`
        );


        /*
         * Entregamos page al test.
         *
         * Todo lo que se encuentre después
         * de await use() pertenece al teardown.
         */
        await use(page);


        // TEARDOWN
        const duracion =
          Date.now() - inicio;

        console.log(
          `[TEARDOWN] "${testInfo.title}" tardó ${duracion}ms`
        );

      },

    workerCounter: [

      async (
        {},
        use,
        workerInfo
      ) => {

        /*
         * Este objeto se crea una sola vez
         * por worker.
         *
         * Su estado permanece entre los
         * tests que utilicen el mismo worker.
         */

        const state = {
          value: 0
        };


        console.log(
          `[WORKER ${workerInfo.workerIndex}] contador inicial: 0`
        );


        await use(state);


        console.log(
          `[WORKER ${workerInfo.workerIndex}] contador final: ${state.value}`
        );

      },

      {
        scope: 'worker'
      }

    ]

  });

test.describe(
  'Reto 1 - Fixture con teardown real',
  () => {

    test(
      'Medir duración del test mediante fixture',
      async ({
        timedPage
      }) => {

        await timedPage.goto(
          'https://www.saucedemo.com'
        );


        await expect(
          timedPage.locator(
            '#login-button'
          )
        ).toBeVisible();


        console.log(
          'Test ejecutándose con cronómetro activo'
        );

      }
    );

  }
);

test.describe(
  'Reto 2 - Fixture de alcance worker',
  () => {


    /*
     * Ejecutamos estos dos tests de manera
     * serial para garantizar que utilicen
     * el mismo worker.
     */
    test.describe.configure({
      mode: 'serial'
    });

    test(
      'Contador worker - primera ejecución',
      async ({
        workerCounter
      }) => {

        workerCounter.value++;


        console.log(
          `Contador después del primer test: ${workerCounter.value}`
        );


        expect(
          workerCounter.value
        ).toBe(1);

      }
    );

    test(
      'Contador worker - segunda ejecución',
      async ({
        workerCounter
      }) => {

        workerCounter.value++;


        console.log(
          `Contador después del segundo test: ${workerCounter.value}`
        );


        expect(
          workerCounter.value
        ).toBe(2);

      }
    );

  }
);

// Dos tamaños solicitados
const viewports = [

  {
    nombre:
      'móvil',

    viewport: {
      width: 390,
      height: 844
    }
  },

  {
    nombre:
      'escritorio',

    viewport: {
      width: 1280,
      height: 720
    }
  }

];

for (
  const caso
  of viewports
) {

  test.describe(
    `Reto 3 - Viewport ${caso.nombre}`,
    () => {


      // Configurar viewport para esta suite
      test.use({
        viewport:
          caso.viewport
      });


      test(
        `Sauce Demo funciona en viewport ${caso.nombre}`,
        async ({ page }) => {


          await page.goto(
            'https://www.saucedemo.com'
          );


          await expect(
            page.locator(
              '#login-button'
            )
          ).toBeVisible();


          const viewportActual =
            page.viewportSize();


          expect(
            viewportActual?.width
          ).toBe(
            caso.viewport.width
          );


          expect(
            viewportActual?.height
          ).toBe(
            caso.viewport.height
          );


          console.log(
            `Viewport ${caso.nombre}: ${viewportActual?.width}x${viewportActual?.height}`
          );

        }
      );

    }
  );

}