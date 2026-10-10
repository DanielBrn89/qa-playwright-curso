# Bug Report - BR-CLASE11-001

**Título:** [Broken Images] Dos imágenes no cargan en la página /broken-images

**Fecha:** 10/10/2026

**Reportado por:** JOSE DANIEL BRAN

**Ambiente:** Windows, Firefox, Playwright

## Descripción

En la página `/broken-images` se encontraron dos imágenes que no cargan correctamente. Las solicitudes de `asdf.jpg` y `hjkl.jpg` devuelven código HTTP 404.

## Severidad: Media

El defecto afecta la visualización de contenido de la página, pero no impide continuar utilizando el resto de la aplicación.

## Prioridad: P2

Debe corregirse porque afecta una funcionalidad visible y puede ser detectado por los usuarios.

## Frecuencia: Siempre

El defecto se presenta durante la ejecución de la prueba.

## Pasos para reproducir

1. Ingresar a `https://practice.expandtesting.com/broken-images`.
2. Observar las imágenes mostradas en la página.
3. Ejecutar la prueba de Playwright para verificar que todas las imágenes carguen.
4. Revisar el apartado Network del Trace.

## Resultado esperado

Todas las imágenes de la página deben cargar correctamente y devolver un recurso válido.

## Resultado obtenido

Las imágenes `asdf.jpg` y `hjkl.jpg` no cargan correctamente y sus solicitudes devuelven HTTP 404.

## Evidencia

- Captura del fallo en el reporte HTML de Playwright.
- Video de la ejecución del test.
- Trace de Playwright.
- Network del Trace mostrando las solicitudes 404 de `asdf.jpg` y `hjkl.jpg`.

## Notas adicionales

El defecto fue reproducido mediante una prueba automatizada de Playwright.