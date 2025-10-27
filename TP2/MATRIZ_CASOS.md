# Matriz de Casos de Prueba - Sistema de Pedidos

| ID | Caso / Descripción | Precondición | Input | Acción | Resultado esperado | Test |
|----|-------------------|--------------|-------|--------|-------------------|------|
| CA1 | Crear un pedido válido | Servidor en ejecución, base de datos disponible | JSON con datos válidos: customerName, customerPhone, address y al menos un item con size, toppings y quantity | POST /api/orders | Código 201, pedido creado con ID asignado y datos correctos | `it('should create a new order with valid data')` |
| CA2 | Obtener un pedido por ID | Existe un pedido con ID=1 | ID del pedido (1) | GET /api/orders/1 | Código 200, datos completos del pedido | `it('should return an order by id')` |
| CA3 | Listar todos los pedidos | Existen pedidos en la base de datos | Ninguno | GET /api/orders | Código 200, array con todos los pedidos | `it('should return all orders')` |
| CA4 | Filtrar pedidos por estado | Existen pedidos con estado "pending" | Query param: status=pending | GET /api/orders?status=pending | Código 200, array con pedidos filtrados | `it('should filter orders by status')` |
| CA5 | Cancelar un pedido pendiente | Existe un pedido con estado "pending" | ID del pedido | POST /api/orders/1/cancel | Código 200, pedido con estado "cancelled" | `it('should cancel an order with valid id')` |
| ERR1 | Crear pedido con dirección corta | Servidor en ejecución | JSON con address menor a 10 caracteres | POST /api/orders | Código 422, mensaje de error de validación | `it('should return 422 for invalid order data')` |
| ERR2 | Crear pedido sin items | Servidor en ejecución | JSON con array de items vacío | POST /api/orders | Código 422, mensaje de error de validación | `it('should return 422 for empty items array')` |
| ERR3 | Obtener pedido inexistente | No existe pedido con ID=999 | ID inexistente (999) | GET /api/orders/999 | Código 404, mensaje "Orden no encontrada" | `it('should return 404 for non-existent order')` |
| ERR4 | Cancelar pedido ya entregado | Existe un pedido con estado "delivered" | ID del pedido | POST /api/orders/1/cancel | Código 409, mensaje de error de conflicto | `it('should return 409 when trying to cancel a delivered order')` |
| ERR5 | Crear pedido con demasiados toppings | Servidor en ejecución | JSON con más de 5 toppings en un item | POST /api/orders | Código 422, mensaje de error de validación | `it('should reject an order with too many toppings')` |
| ERR6 | Crear pedido con nombre corto | Servidor en ejecución | JSON con customerName menor a 3 caracteres | POST /api/orders | Código 422, mensaje de error de validación | `it('should reject an order with short customer name')` |
| ERR7 | Crear pedido con teléfono corto | Servidor en ejecución | JSON con customerPhone menor a 8 caracteres | POST /api/orders | Código 422, mensaje de error de validación | `it('should reject an order with short phone number')` |

## Criterios de Aceptación Principales

1. **CA1**: El sistema debe permitir crear pedidos con datos válidos
2. **CA2**: El sistema debe permitir consultar un pedido específico por su ID
3. **CA3**: El sistema debe permitir listar todos los pedidos
4. **CA4**: El sistema debe permitir filtrar pedidos por su estado
5. **CA5**: El sistema debe permitir cancelar pedidos que no hayan sido entregados

## Validaciones y Manejo de Errores

1. **ERR1**: Validar que la dirección tenga al menos 10 caracteres
2. **ERR2**: Validar que el pedido contenga al menos un item
3. **ERR3**: Manejar correctamente la solicitud de pedidos inexistentes
4. **ERR4**: Impedir la cancelación de pedidos ya entregados
5. **ERR5**: Validar que cada pizza tenga máximo 5 toppings
6. **ERR6**: Validar que el nombre del cliente tenga al menos 3 caracteres
7. **ERR7**: Validar que el teléfono tenga al menos 8 caracteres

## Trazabilidad con Tests

Cada caso de prueba está asociado con un test específico en la suite de pruebas, lo que permite verificar que todos los criterios de aceptación están cubiertos por pruebas automatizadas.