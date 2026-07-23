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