import { test, expect } from '@playwright/test';

test.describe(
  'Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo',
  () => {

    // =========================================================
    // SECCIÓN A - CLASES DE EQUIVALENCIA Y VALORES EN FRONTERA
    // =========================================================

    // TEST 1
    test('CE válida: login con credenciales correctas', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      // Assertion: debemos llegar al inventario
      await expect(page).toHaveURL(/inventory/);

      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();

      console.log('CE válida: login exitoso');
    });


    // TEST 2
    test('CE inválida: usuario no existe', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('usuario_inexistente');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      // Assertion: debe aparecer mensaje de error
      const errorMsg = page.locator('[data-test="error"]');

      await expect(errorMsg).toBeVisible();

      await expect(errorMsg)
        .toContainText('Username and password do not match');

      // No debemos haber navegado al inventario
      await expect(page).not.toHaveURL(/inventory/);

      console.log('CE inválida: usuario inexistente manejado correctamente');
    });


    // TEST 3
    test('CE inválida: usuario bloqueado', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('locked_out_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      const errorMsg = page.locator('[data-test="error"]');

      await expect(errorMsg).toBeVisible();

      await expect(errorMsg)
        .toContainText('locked out');

      console.log(
        'CE usuario bloqueado: mensaje correcto mostrado'
      );
    });


    // TEST 4
    test(
      'Valor en frontera: campos vacíos (frontera de longitud mínima)',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        // No llenar nada y hacer clic
        await page.locator('#login-button').click();

        const errorMsg = page.locator('[data-test="error"]');

        await expect(errorMsg).toBeVisible();

        await expect(errorMsg)
          .toContainText('Username is required');

        console.log(
          'Valor frontera: campo vacío maneja error correctamente'
        );
      }
    );


    // =========================================================
    // SECCIÓN B - ASSERTIONS SOBRE EL INVENTARIO
    // =========================================================

    // TEST 5
    test(
      'Verificar que el inventario tiene exactamente 6 productos',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Contar productos con assertion exacta
        const productos = page.locator('.inventory_item');

        await expect(productos).toHaveCount(6);

        console.log(
          'El inventario tiene exactamente 6 productos'
        );
      }
    );


    // TEST 6
    test(
      'Verificar precio del primer producto con regex',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        const textoPrecio = await page
          .locator('.inventory_item_price')
          .first()
          .textContent();

        // El regex valida el formato $XX.XX
        expect(textoPrecio?.trim())
          .toMatch(/^\$\d+\.\d{2}$/);

        console.log(
          `Precio encontrado: ${textoPrecio}`
        );
      }
    );


    // TEST 7
    test(
      'Verificar atributos y estados de los elementos del inventario',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Obtener primer botón
        const primerBoton = page
          .locator('.btn_inventory')
          .first();

        // Verificar estado inicial
        await expect(primerBoton).toBeEnabled();

        await expect(primerBoton)
          .toHaveText('Add to cart');

        // Clic y verificar cambio
        await primerBoton.click();

        await expect(primerBoton)
          .toHaveText('Remove');

        // Verificar carrito
        const badgeCarrito = page
          .locator('.shopping_cart_badge');

        await expect(badgeCarrito).toBeVisible();

        await expect(badgeCarrito)
          .toHaveText('1');

        console.log(
          'El botón cambia de estado y el carrito se actualiza'
        );
      }
    );


    // =========================================================
    // SECCIÓN C - SOFT ASSERTIONS
    // =========================================================

    // TEST 8
    test(
      'Verificar múltiples propiedades del primer producto con soft assertions',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        const primerProducto = page
          .locator('.inventory_item')
          .first();

        // Con soft assertions, si una falla,
        // las demás verificaciones continúan.
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
          primerProducto.locator('.btn_inventory')
        ).toBeEnabled();

        await expect.soft(
          primerProducto.locator('img')
        ).toBeVisible();

        console.log(
          'Soft assertions del primer producto completadas'
        );
      }
    );


    // =========================================================
    // SECCIÓN D - TABLA DE DECISIÓN
    // =========================================================

    // TEST 9
    test(
      'Tabla de decisión - Regla 1: logueado con items -> puede pagar',
      async ({ page }) => {

        // Login
        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Agregar item
        await page
          .locator('.btn_inventory')
          .first()
          .click();

        // Ir al carrito
        await page
          .locator('.shopping_cart_link')
          .click();

        await expect(page).toHaveURL(/cart/);

        // Debe existir el botón de checkout
        const btnCheckout = page.getByText(
          'Checkout',
          {
            exact: true
          }
        );

        await expect(btnCheckout).toBeVisible();

        await expect(btnCheckout).toBeEnabled();

        console.log(
          'Regla 1: usuario con productos puede continuar a checkout'
        );
      }
    );


    // TEST 10
    test(
      'Tabla de decisión - Regla 2: logueado sin items -> carrito vacío',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Ir al carrito sin agregar productos
        await page
          .locator('.shopping_cart_link')
          .click();

        await expect(page).toHaveURL(/cart/);

        // El carrito debe estar vacío
        const itemsCarrito = page
          .locator('.cart_item');

        await expect(itemsCarrito)
          .toHaveCount(0);

        console.log(
          'Regla 2: carrito vacío verificado correctamente'
        );
      }
    );

    // RETO 1 - toHaveValue()

    test(
      'Reto 1 - Ordenar catálogo por precio y verificar con toHaveValue()',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        // Selector de ordenamiento
        const selectorOrden = page.locator(
          '[data-test="product-sort-container"]'
        );

        // Ordenar de precio menor a mayor
        await selectorOrden.selectOption('lohi');

        // Assertion nueva solicitada por la tarea
        await expect(selectorOrden)
          .toHaveValue('lohi');

        // Obtener precios después del ordenamiento
        const textosPrecios = await page
          .locator('.inventory_item_price')
          .allTextContents();

        // Convertir "$29.99" a número
        const precios = textosPrecios.map(
          precio =>
            Number(
              precio.replace('$', '').trim()
            )
        );

        expect(precios.length)
          .toBeGreaterThan(0);

        // El primer precio debe ser el menor
        const menorPrecio = Math.min(...precios);

        expect(precios[0])
          .toBe(menorPrecio);

        console.log(
          `Orden seleccionado: lohi`
        );

        console.log(
          `Nuevo primer precio: $${precios[0].toFixed(2)}`
        );
      }
    );

    // RETO 2 - toBeFocused()

    test(
      'Reto 2 - Verificar foco del campo usuario con toBeFocused()',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        const campoUsuario = page.locator(
          '#user-name'
        );

        // Hacer clic sobre el campo
        await campoUsuario.click();

        // Assertion nueva solicitada
        await expect(campoUsuario)
          .toBeFocused();

        console.log(
          'El campo de usuario recibió correctamente el foco'
        );
      }
    );

    // RETO 3 - toHaveCSS()

    test(
      'Reto 3 - Verificar estilo del botón Add to cart con toHaveCSS()',
      async ({ page }) => {

        await page.goto('https://www.saucedemo.com');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        await expect(page).toHaveURL(/inventory/);

        const botonAgregar = page
          .locator('.btn_inventory')
          .first();

        await expect(botonAgregar)
          .toBeVisible();

        // Assertion nueva solicitada por la tarea
        // Verificar propiedad CSS computada
        await expect(botonAgregar)
          .toHaveCSS(
            'cursor',
            'pointer'
          );

        console.log(
          'El botón Add to cart tiene cursor: pointer'
        );
      }
    );

  }
);