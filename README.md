# Proyecto de pruebas automatizadas con Playwright

## Datos 

- **Nombre:** JOSE DANIEL BRAN
- **Carné:** 1790-22-15044
- **Curso:** Aseguramiento de la Calidad del Software
- **Universidad:** Universidad Mariano Gálvez de Guatemala
- **Versión de Node.js:** v22.17.0

## Descripción del proyecto

En este proyecto configuré Playwright con TypeScript para realizar pruebas automatizadas sobre la aplicación web Demoblaze.

El objetivo de la práctica fue comprobar que algunos elementos principales del sitio web funcionaran y se mostraran correctamente.

## Configuración utilizada

Para desarrollar y ejecutar el proyecto utilicé las siguientes herramientas:

- Visual Studio Code
- Node.js v22.17.0
- TypeScript
- Playwright
- Chromium
- Git y GitHub

## Pruebas realizadas

Configuré tres pruebas automatizadas:

1. Verifiqué que la página principal cargara correctamente.
2. Verifiqué que el menú de categorías fuera visible.
3. Verifiqué que la barra de navegación mostrara sus enlaces correctamente.

En la tercera prueba comprobé la visibilidad de los siguientes enlaces:

- Home
- Contact
- About us
- Cart
- Log in
- Sign up

## Resultado de las pruebas

Los tres tests se ejecutaron correctamente.

El resultado obtenido fue:

```text
Running 3 tests using 1 worker

✓ La página carga
✓ El menú de categorías es visible
✓ La barra de navegación tiene los enlaces

3 passed
```

## Evidencia de ejecución

![Evidencia de los tests ejecutados correctamente](evidencias/tests-pasando.png)

## Comandos utilizados

### Instalar los navegadores de Playwright

```bash
npx playwright install
```

### Ejecutar los tests

```bash
npx playwright test
```

### Abrir el reporte HTML

```bash
npx playwright show-report
```

### Ejecutar Playwright en modo visual

```bash
npx playwright test --ui
```

## Conclusión

Con esta práctica logré configurar correctamente un proyecto de pruebas automatizadas utilizando Playwright y TypeScript. También aprendí a crear pruebas para verificar la carga de una página, la visibilidad de sus elementos y el funcionamiento de los enlaces de navegación.

Los tres tests fueron ejecutados correctamente en Chromium.