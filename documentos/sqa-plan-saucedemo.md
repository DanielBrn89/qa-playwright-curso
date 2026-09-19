# SQA Plan mínimo - Sauce Demo

## Propósito

Verificar que las funciones críticas de Sauce Demo funcionen correctamente antes de considerar la aplicación lista para una entrega o despliegue.

## Alcance

Se probarán el inicio de sesión, inventario, precios, imágenes, carrito, menú, logout y acceso al checkout; no se evaluarán pruebas de carga, seguridad avanzada ni infraestructura interna de la aplicación.

## Herramientas

Las pruebas se realizarán utilizando Playwright, TypeScript, Chromium, Visual Studio Code y el reporte HTML generado por Playwright.

## Criterios de salida

La aplicación se considerará lista cuando el 100% de los tests críticos de login, inventario, carrito y checkout se ejecuten satisfactoriamente y no existan defectos críticos pendientes.