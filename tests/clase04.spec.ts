import { test, expect, type Page, type Dialog } from '@playwright/test';
import * as fs from 'fs';

// Crear carpeta de evidencias si no existe
test.beforeAll(() => {
  if (!fs.existsSync('./evidencias')) {
    fs.mkdirSync('./evidencias', {
      recursive: true
    });
  }
});

// Crear un usuario diferente en cada ejecución
const usuario = {
  username: `testuser_${Date.now()}`,
  password: 'Password123'
};


// ======================================================
// FUNCIÓN AUXILIAR: LOGIN CON REINTENTO
// ======================================================

// El backend de DemoBlaze puede tardar unos segundos
// en reconocer una cuenta recién registrada.
// Por eso se realizan varios intentos de inicio de sesión.

async function loginConReintento(
  page: Page,
  username: string,
  password: string,
  intentos = 5
) {

  const modalLogin = page.locator('#logInModal');

  for (let i = 0; i < intentos; i++) {

    // Si el modal quedó abierto de un intento anterior,
    // lo cerramos antes de volver a intentar.
    if (await modalLogin.isVisible()) {
      await page.keyboard.press('Escape');

      await page.waitForTimeout(500);
    }

    // Abrir modal de login
    await page
      .locator('#navbarExample')
      .getByRole('link', {
        name: 'Log in',
        exact: true
      })
      .click();

    await page.waitForSelector('#logInModal', {
      state: 'visible'
    });

    // Ingresar credenciales
    await page.locator('#loginusername').fill(username);

    await page.locator('#loginpassword').fill(password);

    let mensajeDialogo = '';

    // Capturar cualquier alerta que pueda aparecer
    const manejarDialogo = async (dialog: Dialog) => {

      mensajeDialogo = dialog.message();

      console.log(
        `Mensaje durante login: ${mensajeDialogo}`
      );

      await dialog.accept();
    };

    page.on('dialog', manejarDialogo);

    // Presionar botón Log in
    await page
      .locator('#logInModal')
      .getByRole('button', {
        name: 'Log in',
        exact: true
      })
      .click();

    try {

      // Si aparece el nombre del usuario,
      // el login fue exitoso.
      await page.waitForSelector('#nameofuser', {
        state: 'visible',
        timeout: 4000
      });

      const nombreUsuario = await page
        .locator('#nameofuser')
        .textContent();

      if (
        nombreUsuario &&
        nombreUsuario.includes(username)
      ) {

        page.off('dialog', manejarDialogo);

        console.log(
          `Login exitoso con: ${username}`
        );

        return;
      }

    } catch {

      page.off('dialog', manejarDialogo);

      console.log(
        `Login intento ${i + 1}/${intentos} sin éxito todavía, reintentando...`
      );

      if (mensajeDialogo) {
        console.log(
          `Respuesta de DemoBlaze: ${mensajeDialogo}`
        );
      }

      // Cerrar modal antes del próximo intento
      if (await modalLogin.isVisible()) {

        await page.keyboard.press('Escape');
      }

      if (i < intentos - 1) {

        await page.waitForTimeout(1500);
      }
    }
  }

  throw new Error(
    `No se pudo iniciar sesión con ${username} tras ${intentos} intentos`
  );
}


// ======================================================
// CLASE 04
// ======================================================

// Se utiliza serial porque primero debemos registrar
// al usuario y después utilizarlo en los siguientes tests.

test.describe.serial(
  'Clase 04 - Flujo completo de usuario en DemoBlaze',
  () => {


    // ==================================================
    // TEST 1 DE CLASE
    // REGISTRAR UN NUEVO USUARIO
    // ==================================================

    test(
      'Registrar un nuevo usuario',
      async ({ page }) => {

        await page.goto('/');

        // Abrir modal Sign up
        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Sign up',
            exact: true
          })
          .click();

        await page.waitForSelector(
          '#signInModal',
          {
            state: 'visible'
          }
        );

        // Ingresar usuario
        await page
          .locator('#sign-username')
          .fill(usuario.username);

        // Ingresar contraseña
        await page
          .locator('#sign-password')
          .fill(usuario.password);

        // Captura del formulario
        await page
          .locator('#signInModal')
          .screenshot({
            path: './evidencias/registro-llenado.png'
          });

        // El handler se registra ANTES del clic
        // que genera la alerta.
        const dialogPromise =
          new Promise<string>((resolve) => {

            page.once(
              'dialog',
              async (dialog) => {

                const mensaje =
                  dialog.message();

                console.log(
                  `Alert dice: ${mensaje}`
                );

                await dialog.accept();

                resolve(mensaje);
              }
            );
          });

        // Registrar usuario
        await page
          .locator('#signInModal')
          .getByRole('button', {
            name: 'Sign up',
            exact: true
          })
          .click();

        const mensajeRegistro =
          await dialogPromise;

        // Verificar que DemoBlaze haya mostrado
        // un mensaje de respuesta.
        expect(
          mensajeRegistro
        ).toBeTruthy();

        console.log(
          `Usuario ${usuario.username} registrado`
        );
      }
    );


    // ==================================================
    // TEST 2 DE CLASE
    // LOGIN CON USUARIO REGISTRADO
    // ==================================================

    test(
      'Login con el usuario registrado',
      async ({ page }) => {

        await page.goto('/');

        // Iniciar sesión
        await loginConReintento(
          page,
          usuario.username,
          usuario.password
        );

        // Obtener texto del usuario logueado
        const nombreUsuario =
          await page
            .locator('#nameofuser')
            .textContent();

        // Verificar usuario
        expect(
          nombreUsuario
        ).toContain(
          usuario.username
        );

        console.log(
          `Login exitoso como: ${nombreUsuario}`
        );
      }
    );


    // ==================================================
    // TEST 3 DE CLASE
    // LOGIN -> PRODUCTO -> CARRITO
    // ==================================================

    test(
      'Flujo completo: login -> agregar producto -> verificar carrito',
      async ({ page }) => {

        // DemoBlaze es un sitio externo.
        // Damos más tiempo a este flujo completo.
        test.setTimeout(60000);

        await page.goto('/');

        // Iniciar sesión
        await loginConReintento(
          page,
          usuario.username,
          usuario.password
        );

        // Esperar productos
        await page.waitForSelector(
          '.card-title a'
        );

        // Obtener primer producto
        const primerProducto =
          page
            .locator('.card-title a')
            .first();

        const nombreProducto =
          await primerProducto
            .textContent();

        expect(
          nombreProducto
        ).not.toBeNull();

        console.log(
          `Producto seleccionado: ${nombreProducto}`
        );

        // Abrir producto
        await primerProducto.click();

        await page.waitForLoadState(
          'domcontentloaded'
        );

        // Verificar Add to cart
        const agregarCarrito =
          page.getByText(
            'Add to cart',
            {
              exact: true
            }
          );

        await expect(
          agregarCarrito
        ).toBeVisible();

        // Preparar captura del diálogo
        // antes de hacer clic.
        const dialogProducto =
          new Promise<string>((resolve) => {

            page.once(
              'dialog',
              async (dialog) => {

                const mensaje =
                  dialog.message();

                console.log(
                  `Alerta del carrito: ${mensaje}`
                );

                await dialog.accept();

                resolve(mensaje);
              }
            );
          });

        // Agregar producto
        await agregarCarrito.click();

        const mensajeProducto =
          await dialogProducto;

        expect(
          mensajeProducto
        ).toBeTruthy();

        // Ir al carrito
        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Cart',
            exact: true
          })
          .click();

        await page.waitForURL(
          '**/cart.html'
        );

        // Filas del carrito
        const itemsCarrito =
          page.locator(
            '#tbodyid tr'
          );

        // Esperar a que aparezca el producto
        await expect(
          itemsCarrito.first()
        ).toBeVisible({
          timeout: 15000
        });

        // Contar productos
        const cantidadItems =
          await itemsCarrito.count();

        expect(
          cantidadItems
        ).toBeGreaterThanOrEqual(1);

        console.log(
          `Flujo completo exitoso. Producto "${nombreProducto}" en carrito.`
        );

        console.log(
          `Items en carrito: ${cantidadItems}`
        );

        // Evidencia del carrito
        await page.screenshot({
          path: './evidencias/carrito-con-producto.png',
          fullPage: true
        });
      }
    );


    // ==================================================
    // TEST 4 DE CLASE
    // LOGIN CON CREDENCIALES INCORRECTAS
    // ==================================================

    test(
      'Intentar login con credenciales incorrectas',
      async ({ page }) => {

        await page.goto('/');

        // Abrir login
        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Log in',
            exact: true
          })
          .click();

        await page.waitForSelector(
          '#logInModal',
          {
            state: 'visible'
          }
        );

        // Credenciales incorrectas
        await page
          .locator('#loginusername')
          .fill(
            'usuario_que_no_existe'
          );

        await page
          .locator('#loginpassword')
          .fill(
            'password_incorrecta'
          );

        // Escuchar alerta
        const dialogPromise =
          new Promise<string>((resolve) => {

            page.once(
              'dialog',
              async (dialog) => {

                const mensaje =
                  dialog.message();

                await dialog.accept();

                resolve(mensaje);
              }
            );
          });

        // Intentar login
        await page
          .locator('#logInModal')
          .getByRole('button', {
            name: 'Log in',
            exact: true
          })
          .click();

        const mensajeAlert =
          await dialogPromise;

        // Debe existir un mensaje de error
        expect(
          mensajeAlert
        ).toBeTruthy();

        console.log(
          `Error mostrado: ${mensajeAlert}`
        );

        // No debe mostrarse un usuario logueado
        const usuarioLogueado =
          page.locator('#nameofuser');

        await expect(
          usuarioLogueado
        ).not.toBeVisible();
      }
    );


    // ==================================================
    // RETO 1
    // FORMULARIO PLACE ORDER CON fill()
    // ==================================================

    test(
      'Reto 1 - Llenar formulario Place Order con fill()',
      async ({ page }) => {

        // Abrir directamente el carrito
        await page.goto('/cart.html');

        // Abrir formulario Place Order
        await page
          .getByRole('button', {
            name: 'Place Order',
            exact: true
          })
          .click();

        // Esperar modal
        const modalOrden =
          page.locator('#orderModal');

        await expect(
          modalOrden
        ).toBeVisible();

        // Llenar datos solicitados
        await page
          .locator('#name')
          .fill('Jose Daniel Bran');

        await page
          .locator('#country')
          .fill('Guatemala');

        await page
          .locator('#city')
          .fill('Guatemala');

        await page
          .locator('#card')
          .fill('123456789');

        // Verificar valores ingresados
        await expect(
          page.locator('#name')
        ).toHaveValue(
          'Jose Daniel Bran'
        );

        await expect(
          page.locator('#country')
        ).toHaveValue(
          'Guatemala'
        );

        await expect(
          page.locator('#city')
        ).toHaveValue(
          'Guatemala'
        );

        await expect(
          page.locator('#card')
        ).toHaveValue(
          '123456789'
        );

        // Verificar botón Purchase
        const botonPurchase =
          modalOrden.getByRole(
            'button',
            {
              name: 'Purchase',
              exact: true
            }
          );

        await expect(
          botonPurchase
        ).toBeVisible();

        console.log(
          'Formulario Place Order llenado correctamente'
        );
      }
    );


    // ==================================================
    // RETO 2
    // CERRAR MODAL CON .last()
    // ==================================================

    test(
      'Reto 2 - Cerrar modal de login con Close',
      async ({ page }) => {

        await page.goto('/');

        // Abrir modal de login
        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Log in',
            exact: true
          })
          .click();

        const modalLogin =
          page.locator('#logInModal');

        await expect(
          modalLogin
        ).toBeVisible();

        // Dentro del modal hay más de un botón
        // con nombre accesible "Close".
        // La tarea solicita utilizar .last().
        const botonClose =
          modalLogin
            .getByRole(
              'button',
              {
                name: 'Close',
                exact: true
              }
            )
            .last();

        await expect(
          botonClose
        ).toBeVisible();

        // Cerrar modal
        await botonClose.click();

        // Verificar que quedó cerrado
        await expect(
          modalLogin
        ).not.toBeVisible();

        console.log(
          'Modal de login cerrado correctamente'
        );
      }
    );


    // ==================================================
    // RETO 3
    // UTILIZAR clear() E inputValue()
    // ==================================================

    test(
      'Reto 3 - Llenar y limpiar un campo con clear()',
      async ({ page }) => {

        await page.goto('/');

        // Abrir modal de login
        await page
          .locator('#navbarExample')
          .getByRole('link', {
            name: 'Log in',
            exact: true
          })
          .click();

        await page.waitForSelector(
          '#logInModal',
          {
            state: 'visible'
          }
        );

        // Campo que utilizaremos
        const campoUsuario =
          page.locator(
            '#loginusername'
          );

        // Llenar campo
        await campoUsuario.fill(
          'usuario_prueba'
        );

        // Verificar el valor
        const valorInicial =
          await campoUsuario
            .inputValue();

        expect(
          valorInicial
        ).toBe(
          'usuario_prueba'
        );

        // Limpiar campo
        await campoUsuario.clear();

        // Obtener valor después de clear()
        const valorFinal =
          await campoUsuario
            .inputValue();

        // Debe quedar vacío
        expect(
          valorFinal
        ).toBe('');

        console.log(
          'Campo limpiado correctamente con clear()'
        );
      }
    );

  }
);