# Proyecto de pruebas automatizadas con Playwright

## Datos

- **Nombre:** JOSE DANIEL BRAN
- **Carné:** 1790-22-15044
- **Curso:** Aseguramiento de la Calidad del Software
- **Universidad:** Universidad Mariano Gálvez de Guatemala
- **Versión de Node.js:** v22.17.0

## Descripción del proyecto

En este proyecto configuré Playwright con TypeScript para realizar pruebas
automatizadas sobre la aplicación web DemoBlaze.

El objetivo de esta práctica fue aplicar navegación entre páginas,
estrategias de espera y capturas de pantalla como evidencia de la ejecución
de las pruebas.

## Configuración utilizada

Para desarrollar y ejecutar el proyecto utilicé las siguientes herramientas:

- Visual Studio Code
- Node.js v22.17.0
- TypeScript
- Playwright
- Chromium
- Git y GitHub

## Tarea 2: Navegación, estrategias de espera y capturas de pantalla

## Pruebas realizadas

Se configuraron cuatro pruebas automatizadas:

1. Navegar al carrito y regresar a la página de inicio.
2. Navegar a la categoría Phones y abrir el detalle de un producto.
3. Capturar por separado la barra de navegación y el footer.
4. Verificar que la página principal cargue en menos de 10 segundos.

## Resultado de las pruebas

Los cuatro tests se ejecutaron correctamente en Chromium.

El resultado obtenido fue:

```text
Running 4 tests using 1 worker

✓ Navegar al carrito y regresar al inicio
✓ Navegar a la categoría Phones y ver un producto
✓ Capturar el navbar y el footer por separado
✓ Verificar tiempo de carga de la página

Tiempo de carga: 834ms

4 passed

## Clase 03 - Locators en Playwright

En esta práctica se utilizaron diferentes estrategias de localización de
elementos en Playwright sobre la aplicación DemoBlaze.

Se trabajó con:

- Locators por texto.
- Locators CSS.
- Locators por ID.
- Locators por atributo.
- Locators encadenados.
- Negaciones.
- Locator por rol.
- Locator con filter().
- Selector por atributo parcial.

### Resultado de ejecución

Se ejecutaron 9 pruebas automatizadas correspondientes a la Clase 03.

```text
Running 9 tests using 1 worker

9 passed



## Clase 04 - Actions en Playwright

En esta práctica se trabajó con acciones de usuario utilizando Playwright
sobre la aplicación DemoBlaze.

Se realizaron pruebas relacionadas con registro de usuarios, inicio de sesión,
interacción con productos, carrito de compras, formularios y manejo de campos
de texto.

### Pruebas realizadas

1. Registrar un nuevo usuario.
2. Login con el usuario registrado.
3. Flujo completo: login, agregar producto y verificar carrito.
4. Intentar login con credenciales incorrectas.
5. Llenar el formulario Place Order utilizando fill().
6. Cerrar el modal de login utilizando el botón Close.
7. Llenar y limpiar un campo utilizando clear().

### Resultado de ejecución

Los siete tests se ejecutaron correctamente en Chromium.

```text
Running 7 tests using 1 worker

✓ Registrar un nuevo usuario
✓ Login con el usuario registrado
✓ Flujo completo: login -> agregar producto -> verificar carrito
✓ Intentar login con credenciales incorrectas
✓ Reto 1 - Llenar formulario Place Order con fill()
✓ Reto 2 - Cerrar modal de login con Close
✓ Reto 3 - Llenar y limpiar un campo con clear()

7 passed