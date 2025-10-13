# API de Pedidos de Pizzería

Este proyecto implementa una API REST para gestionar pedidos de una pizzería, con validaciones, reglas de negocio y tests.

## Requisitos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Postman (para probar la API)
- Jest


## Guía Paso a Paso para Configurar y Ejecutar el Proyecto

### 1. Clonar el Repositorio (si aplica)

Si estás trabajando desde un repositorio Git:

```bash
git clone https://github.com/1darian/prog4.git
cd prog4/TP2
```

### 2. Configurar y Levantar la Base de Datos

1. Navega al directorio de la base de datos:

```bash
cd database
```

2. Inicia el contenedor de PostgreSQL con Docker:

```bash
docker-compose up -d
```

3. Verifica que el contenedor esté corriendo:

```bash
docker ps
```

Deberías ver un contenedor llamado `pizzeria-postgres` en estado "Up".

### 3. Configurar y Levantar el Backend

1. Crear archivo .env que contenga:

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=pizzeria_user
DB_PASSWORD=pizzeria_pass
DB_NAME=pizzeria
```

2. Navega al directorio del backend:

```bash
cd ../backend
```

3. Instala las dependencias:

```bash
npm install
```

4. Compila el código TypeScript:

```bash
npm run build
```

5. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor debería estar corriendo en http://localhost:3000 y mostrar un mensaje como:
```
Servidor corriendo en el puerto 3000
Base de datos inicializada correctamente
```

## Guía Detallada para Probar los Endpoints

### 1. Crear un Pedido

**Endpoint**: `POST /api/orders`

**Descripción**: Crea un nuevo pedido de pizza.

**Ejemplo con Postman**:
1. Abre Postman
2. Crea una nueva solicitud POST a `http://localhost:3000/api/orders`
3. En la pestaña "Headers", agrega:
   - Key: `Content-Type`
   - Value: `application/json`
4. En la pestaña "Body", selecciona "raw" y "JSON", luego ingresa:

```json
{
  "customerName": "Juan Pérez",
  "customerPhone": "1122334455",
  "address": "Av. Siempreviva 742, Springfield",
  "items": [
    {
      "size": "M",
      "toppings": ["cheese", "tomato", "pepperoni"],
      "quantity": 2
    }
  ]
}
```

5. Haz clic en "Send"
6. Deberías recibir una respuesta con código 201 y los datos del pedido creado, incluyendo un ID.

**Ejemplo con curl**:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
  "customerName": "Juan Pérez",
  "customerPhone": "1122334455",
  "address": "Av. Siempreviva 742, Springfield",
  "items": [
    {
      "size": "M",
      "toppings": ["cheese", "tomato", "pepperoni"],
      "quantity": 2
    }
  ]
}'
```

### 3. Listar Todos los Pedidos

**Endpoint**: `GET /api/orders`

**Descripción**: Obtiene todos los pedidos, con opción de filtrar por estado.

**Ejemplo con Postman**:
1. Crea una nueva solicitud GET a `http://localhost:3000/api/orders`
2. Haz clic en "Send"
3. Deberías recibir una respuesta con código 200 y un array con todos los pedidos

**Para filtrar por estado**:
1. Crea una nueva solicitud GET a `http://localhost:3000/api/orders?status=pending`
2. Haz clic en "Send"
3. Deberías recibir solo los pedidos con estado "pending"

**Ejemplo con curl**:
```bash
# Todos los pedidos
curl -X GET http://localhost:3000/api/orders

# Filtrar por estado
curl -X GET http://localhost:3000/api/orders?status=pending
```

## Reglas de Negocio

- **Tamaños de pizza disponibles**: 
  - S (pequeña): precio base $8.99
  - M (mediana): precio base $10.99
  - L (grande): precio base $12.99
- **Toppings**: 
  - Máximo 5 toppings por pizza
  - Cada topping cuesta $0.99 adicional
- **Precio total**: Se calcula como (precio base + precio de toppings) * cantidad
- **Cancelación**: No se puede cancelar un pedido que ya ha sido entregado (estado "delivered")

## Validaciones

- **Items**: El array de items no puede estar vacío
- **Dirección**: Debe tener al menos 10 caracteres
- **Nombre del cliente**: Debe tener al menos 3 caracteres
- **Teléfono**: Debe tener al menos 8 caracteres

## Códigos de Error

- **422**: Datos inválidos (items vacíos, dirección corta, etc.)
- **409**: Conflicto (intentar cancelar un pedido entregado)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Ejecutar Tests

Para ejecutar los tests unitarios y de integración:

```bash
cd backend
npm test
```

## Solución de Problemas Comunes

1. **Error de conexión a la base de datos**:
   - Verifica que el contenedor Docker esté corriendo con `docker ps`
   - Asegúrate de que los datos de conexión en el archivo `.env` sean correctos

2. **Error al iniciar el servidor**:
   - Verifica que no haya otro proceso usando el puerto 3000
   - Asegúrate de haber instalado todas las dependencias con `npm install`

3. **Error en las solicitudes**:
   - Verifica que estés usando el formato JSON correcto
   - Asegúrate de incluir el header `Content-Type: application/json`