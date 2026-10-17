import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';

test.describe('Tarea 11 - Documentar defectos con Playwright', () => {

  // Reto 3:
  // Si un test termina con errores, se genera un borrador
  // de reporte en Markdown y se adjunta al reporte HTML.
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.errors.length > 0) {
      const errores = testInfo.errors
        .map(error => error.message)
        .join('\n\n');

      const borrador = `# Borrador de reporte de defecto

## Título
${testInfo.title}

## Ambiente
Firefox

## URL
${page.url()}

## Resultado obtenido
El test presentó errores durante su ejecución.

## Error
${errores}
`;

      await testInfo.attach('borrador-reporte.md', {
        body: borrador,
        contentType: 'text/markdown',
      });
    }
  });


  // =========================================================
  // RETO 1 - Medir un defecto intermitente
  // =========================================================

  test(
    'Reto 1 - Medir frecuencia del defecto de texto',
    async ({ page }, testInfo) => {

        test.setTimeout(120000);

      const textoConError =
        "Sometimes you'll see a typo, other times you won,t.";

      const textoCorrecto =
        "Sometimes you'll see a typo, other times you won't.";

      let vecesConError = 0;

      // Se carga inicialmente la página.
      await page.goto(`${BASE_URL}/typos`);

      // Se realizan 12 comprobaciones.
      for (let intento = 1; intento <= 12; intento++) {

        const texto = await page.locator('body').innerText();

        if (texto.includes(textoConError)) {
          vecesConError++;
        }

        console.log(
          `Intento ${intento}: ${
            texto.includes(textoConError)
              ? 'se encontró el error'
              : 'texto correcto'
          }`
        );

        if (intento < 12) {
             await page.reload({
             waitUntil: 'domcontentloaded',
             timeout: 15000,
           });
    }
      }

      const frecuencia = ((vecesConError / 12) * 100).toFixed(2);

      const resultado = `Reto 1 - Frecuencia del defecto

Total de recargas: 12
Veces que apareció el error: ${vecesConError}
Veces que apareció el texto correcto: ${12 - vecesConError}
Frecuencia del defecto: ${frecuencia}%

Texto esperado:
${textoCorrecto}

Texto con defecto:
${textoConError}
`;

      await testInfo.attach('frecuencia-defecto.txt', {
        body: resultado,
        contentType: 'text/plain',
      });

      test.info().annotations.push({
        type: 'defect-frequency',
        description: `${vecesConError}/12 (${frecuencia}%)`,
      });

      console.log(`Frecuencia del defecto: ${frecuencia}%`);
    }
  );


  // =========================================================
  // RETO 2 - test.fixme() + anotación de issue
  // =========================================================

  test.fixme(
  'Reto 2 - Texto sin errores mientras BUG-001 esté abierto',
  {
    annotation: {
      type: 'issue',
      description: 'BUG-001: Imágenes rotas en /broken-images (#1)',
    },
  },
  async ({ page }) => {
    await page.goto(`${BASE_URL}/broken-images`);

    const imagenes = page.locator('main img');

    await expect.poll(() =>
      imagenes.evaluateAll(imgs =>
        imgs.every(img => (img as HTMLImageElement).complete)
      )
    ).toBe(true);

    const anchos = await imagenes.evaluateAll(imgs =>
      imgs.map(img => (img as HTMLImageElement).naturalWidth)
    );

    for (const ancho of anchos) {
      expect(ancho).toBeGreaterThan(0);
    }
  }
);


  // =========================================================
  // RETO 3 - Borrador de reporte desde afterEach
  // =========================================================

  test(
    'Reto 3 - Verificar página y preparar reporte de errores',
    async ({ page }) => {

      await page.goto(`${BASE_URL}/broken-images`);

      const imagenes = page.locator('main img');

      await expect(imagenes).toHaveCount(3);

      console.log(
        'Reto 3: página de imágenes rotas revisada correctamente'
      );
    }
  );

});