# Tabla de Decisión - Proceso de Checkout en Sauce Demo

## Objetivo

La presente tabla de decisión tiene como objetivo analizar diferentes
combinaciones de condiciones que pueden presentarse durante el proceso
de checkout en Sauce Demo y establecer el resultado esperado para cada
una de ellas.

## Condiciones consideradas

Se utilizaron las siguientes condiciones:

1. Usuario autenticado.
2. Carrito con productos.
3. Formulario de checkout completo.
4. Se realiza la acción necesaria para finalizar el proceso.

## Tabla de decisión

| Condición / Acción | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Usuario autenticado | Sí | Sí | Sí | Sí | No | Sí |
| Carrito con productos | Sí | No | Sí | Sí | No | Sí |
| Formulario completo | Sí | Sí | No | Sí | No | Sí |
| Se intenta finalizar | Sí | Sí | No | No | No | Sí |
| **Permitir avanzar al checkout** | Sí | Sí | Sí | Sí | No | Sí |
| **Mostrar error por datos faltantes** | No | No | Sí | No | No | No |
| **Completar la compra** | Sí | Sí | No | No | No | Sí |
| **Permanecer en el proceso** | No | No | Sí | Sí | Sí | No |

## Descripción de las reglas

### Regla 1 - Usuario autenticado, carrito con productos y datos completos

El usuario inició sesión correctamente, agregó al menos un producto al
carrito y completó todos los datos solicitados durante el checkout.

**Resultado esperado:** el usuario puede continuar con el proceso y
finalizar la compra.

---

### Regla 2 - Usuario autenticado con carrito vacío

El usuario inició sesión correctamente, pero ingresó al carrito sin agregar
ningún producto.

**Resultado esperado:** el carrito contiene cero productos. El comportamiento
del botón Checkout debe validarse según el funcionamiento de Sauce Demo.

---

### Regla 3 - Formulario incompleto

El usuario inició sesión, posee productos en el carrito, pero deja uno o más
campos obligatorios del formulario de checkout sin completar.

**Resultado esperado:** el sistema muestra un mensaje de error y no permite
continuar normalmente con la finalización de la compra.

---

### Regla 4 - No se finaliza el proceso

El usuario inició sesión, posee un producto y completó los datos necesarios,
pero no realiza la acción final para completar la compra.

**Resultado esperado:** el proceso permanece pendiente y la compra todavía
no debe considerarse finalizada.

---

### Regla 5 - Usuario no autenticado

No existe una sesión válida de usuario.

**Resultado esperado:** no debe considerarse completado correctamente el
flujo normal de compra. El comportamiento real debe verificarse mediante
una prueba específica de acceso directo a las páginas del checkout.

---

### Regla 6 - Flujo completo válido

El usuario está autenticado, tiene productos en el carrito, completa
correctamente los datos del checkout y realiza la acción para finalizar.

**Resultado esperado:** el flujo de checkout concluye correctamente y se
muestra la confirmación correspondiente.

## Conclusión

La tabla de decisión permite analizar el proceso de checkout considerando
distintas combinaciones de condiciones y resultados. Esta técnica ayuda a
reducir la cantidad de pruebas necesarias sin perder cobertura sobre los
escenarios principales y permite identificar casos positivos, negativos y
situaciones especiales dentro del flujo de compra.