# Backend API - Sistema de Pedidos

Este proyecto implementa una API RESTful para un sistema de pedidos utilizando el patrón de arquitectura MVC (Modelo-Vista-Controlador).

## Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- PostgreSQL (ejecutándose en Docker o localmente)

## Instalación

1. Clonar el repositorio o descargar los archivos
2. Navegar al directorio del backend:
   ```
   cd Practico2/backend
   ```
3. Instalar las dependencias:
   ```
   npm install
   ```
4. Configurar las variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto backend (si no existe)
   - Configurar las variables necesarias para la conexión a la base de datos:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=postgres
     DB_NAME=postgres
     PORT=3000
     ```

## Ejecución

1. Iniciar la base de datos PostgreSQL (usando Docker):
   ```
   cd ../database
   docker-compose up -d
   ```

2. Iniciar el servidor de desarrollo:
   ```
   cd ../backend
   npm start
   ```

3. El servidor estará disponible en `http://localhost:3000`

## Pruebas con Postman

### Configuración de Postman

1. Abrir Postman
2. Crear una nueva colección llamada "Sistema de Pedidos"
3. Configurar las variables de entorno:
   - Crear un nuevo entorno llamado "Local"
   - Agregar una variable `baseUrl` con el valor `http://localhost:3000/api`

### Endpoints disponibles

#### 1. Obtener todas las órdenes

- **Método**: GET
- **URL**: `{{baseUrl}}/orders`
- **Descripción**: Retorna todas las órdenes existentes

#### 2. Obtener una orden por ID

- **Método**: GET
- **URL**: `{{baseUrl}}/orders/:id`
- **Descripción**: Retorna una orden específica por su ID
- **Parámetros de ruta**:
  - `id`: ID de la orden (número entero)

#### 3. Crear una nueva orden

- **Método**: POST
- **URL**: `{{baseUrl}}/orders`
- **Descripción**: Crea una nueva orden
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "items": [
      {
        "name": "Pizza Margherita",
        "size": "M",
        "toppings": ["queso", "tomate", "albahaca"]
      }
    ],
    "address": "Calle Principal 123, Ciudad"
  }
  ```

#### 4. Actualizar una orden existente

- **Método**: PUT
- **URL**: `{{baseUrl}}/orders/:id`
- **Descripción**: Actualiza una orden existente
- **Parámetros de ruta**:
  - `id`: ID de la orden (número entero)
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "items": [
      {
        "name": "Pizza Pepperoni",
        "size": "L",
        "toppings": ["queso", "pepperoni"]
      }
    ],
    "address": "Avenida Central 456, Ciudad",
    "status": "en_preparacion"
  }
  ```

#### 5. Eliminar una orden

- **Método**: DELETE
- **URL**: `{{baseUrl}}/orders/:id`
- **Descripción**: Elimina una orden existente
- **Parámetros de ruta**:
  - `id`: ID de la orden (número entero)

### Ejemplos de pruebas

1. **Crear una orden**:
   - Seleccionar el método POST y la URL `{{baseUrl}}/orders`
   - En la pestaña "Body", seleccionar "raw" y "JSON"
   - Ingresar el JSON de ejemplo para crear una orden
   - Hacer clic en "Send"
   - Verificar que la respuesta tenga un código de estado 201 y contenga la orden creada

2. **Obtener todas las órdenes**:
   - Seleccionar el método GET y la URL `{{baseUrl}}/orders`
   - Hacer clic en "Send"
   - Verificar que la respuesta tenga un código de estado 200 y muestre un array de órdenes

3. **Actualizar una orden**:
   - Seleccionar el método PUT y la URL `{{baseUrl}}/orders/1` (reemplazar "1" con un ID válido)
   - En la pestaña "Body", seleccionar "raw" y "JSON"
   - Ingresar el JSON de ejemplo para actualizar una orden
   - Hacer clic en "Send"
   - Verificar que la respuesta tenga un código de estado 200 y contenga la orden actualizada

## Estructura del proyecto (MVC)

- **Modelos**: `src/models/` - Definiciones de datos y validación
- **Controladores**: `src/controllers/` - Lógica de negocio y manejo de solicitudes
- **Rutas**: `src/routes/` - Definición de endpoints
- **Servicios**: `src/services/` - Interacción con la base de datos
- **Configuración**: `src/app.ts`, `src/server.ts` - Configuración de la aplicación

## Solución de problemas

- **Error de conexión a la base de datos**: Verificar que PostgreSQL esté en ejecución y que las credenciales en el archivo `.env` sean correctas
- **Error "Cannot find module"**: Ejecutar `npm install` para instalar todas las dependencias
- **Error de TypeScript**: Verificar que el archivo `tsconfig.json` esté correctamente configurado