import {
  test,
  expect
} from '@playwright/test';

import {
  LoginPage
} from '../pages/LoginPage';

import {
  InventoryPage
} from '../pages/InventoryPage';

import {
  CartPage
} from '../pages/CartPage';

import {
  CheckoutPage
} from '../pages/CheckoutPage';

import {
  MenuPage
} from '../pages/MenuPage';


test.describe(
  'Clase 06 - Page Object Model en Sauce Demo',
  () => {


    // =====================================================
    // TEST 1 BASE
    // LOGIN EXITOSO
    // =====================================================

    test(
      'Login exitoso con POM',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        const inventoryPage =
          new InventoryPage(page);

        await inventoryPage
          .expectToBeOnInventoryPage();

        console.log(
          'Login con POM exitoso'
        );
      }
    );


    // =====================================================
    // TEST 2 BASE
    // LOGIN FALLIDO
    // =====================================================

    test(
      'Login fallido con POM',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        await loginPage.navigate();

        await loginPage.login(
          'wrong_user',
          'wrong_pass'
        );

        await loginPage.expectLoginError(
          'Username and password do not match'
        );

        console.log(
          'Error de login capturado con POM'
        );
      }
    );


    // =====================================================
    // TEST 3 BASE
    // AGREGAR DOS PRODUCTOS
    // =====================================================

    test(
      'Flujo completo: login -> agregar 2 productos -> verificar carrito',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);

        const cartPage =
          new CartPage(page);


        // Login
        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage
          .expectToBeOnInventoryPage();


        // Agregar productos por nombre
        await inventoryPage
          .addProductByName(
            'Sauce Labs Backpack'
          );

        await inventoryPage
          .addProductByName(
            'Sauce Labs Bike Light'
          );


        // Verificar badge
        await expect(
          inventoryPage.cartBadge
        ).toHaveText('2');


        // Ir al carrito
        await inventoryPage.goToCart();

        await cartPage
          .expectItemCount(2);

        console.log(
          'Flujo completo con POM: 2 productos en carrito'
        );
      }
    );


    // =====================================================
    // TEST 4 BASE
    // INVENTARIO DE 6 PRODUCTOS
    // =====================================================

    test(
      'Verificar que el inventario tiene 6 productos',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);


        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );


        await inventoryPage
          .expectToBeOnInventoryPage();


        const count =
          await inventoryPage
            .getProductCount();

        expect(count).toBe(6);

        console.log(
          'Inventario contiene 6 productos'
        );
      }
    );


    // =====================================================
    // TEST 5 BASE
    // ORDENAR PRECIOS DE MAYOR A MENOR
    // =====================================================

    test(
      'Ordenar productos de mayor a menor precio',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);


        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );


        await inventoryPage
          .expectToBeOnInventoryPage();


        // Ordenar de mayor a menor
        await inventoryPage.sortBy(
          'hilo'
        );


        const precios =
          page.locator(
            '.inventory_item_price'
          );


        const todosLosPrecios =
          await precios
            .allTextContents();


        const numericos =
          todosLosPrecios.map(
            precio =>
              parseFloat(
                precio.replace('$', '')
              )
          );


        // Verificar orden descendente
        for (
          let i = 0;
          i < numericos.length - 1;
          i++
        ) {

          expect(
            numericos[i]
          ).toBeGreaterThanOrEqual(
            numericos[i + 1]
          );
        }


        console.log(
          'Productos ordenados correctamente de mayor a menor precio'
        );
      }
    );


    // =====================================================
    // RETO 1
    // CHECKOUT PAGE
    // COMPRA COMPLETA
    // =====================================================

    test(
      'Reto 1 - Compra completa utilizando CheckoutPage',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);

        const cartPage =
          new CartPage(page);

        const checkoutPage =
          new CheckoutPage(page);


        // Login
        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage
          .expectToBeOnInventoryPage();


        // Agregar producto
        await inventoryPage
          .addProductByName(
            'Sauce Labs Backpack'
          );


        await expect(
          inventoryPage.cartBadge
        ).toHaveText('1');


        // Ir al carrito
        await inventoryPage.goToCart();

        await cartPage
          .expectItemCount(1);


        // Continuar checkout
        await cartPage
          .proceedToCheckout();


        // Llenar información
        await checkoutPage
          .fillCheckoutInformation(
            'Jose Daniel',
            'Bran',
            '01001'
          );


        // Continuar
        await checkoutPage
          .continueCheckout();


        // Finalizar compra
        await checkoutPage
          .finishPurchase();


        console.log(
          'Reto 1: compra completada correctamente con CheckoutPage'
        );
      }
    );


    // =====================================================
    // RETO 2
    // MENU PAGE Y LOGOUT
    // =====================================================

    test(
      'Reto 2 - Logout utilizando MenuPage',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);

        const menuPage =
          new MenuPage(page);


        // Login
        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage
          .expectToBeOnInventoryPage();


        // Logout
        await menuPage.logout();


        // Verificar página de login
        await expect(
          loginPage.loginButton
        ).toBeVisible();


        console.log(
          'Reto 2: logout realizado correctamente con MenuPage'
        );
      }
    );


    // =====================================================
    // RETO 3
    // removeProductByName()
    // =====================================================

    test(
      'Reto 3 - Quitar producto y verificar que desaparezca el badge',
      async ({ page }) => {

        const loginPage =
          new LoginPage(page);

        const inventoryPage =
          new InventoryPage(page);


        // Login
        await loginPage.navigate();

        await loginPage.login(
          'standard_user',
          'secret_sauce'
        );

        await inventoryPage
          .expectToBeOnInventoryPage();


        // Agregar producto
        await inventoryPage
          .addProductByName(
            'Sauce Labs Backpack'
          );


        // Badge debe mostrar 1
        await expect(
          inventoryPage.cartBadge
        ).toHaveText('1');


        // Quitar producto
        await inventoryPage
          .removeProductByName(
            'Sauce Labs Backpack'
          );


        // Al quedar en cero,
        // el badge desaparece
        await expect(
          inventoryPage.cartBadge
        ).toBeHidden();


        console.log(
          'Reto 3: producto eliminado y badge desapareció correctamente'
        );
      }
    );

  }
);