# Preguntas de Teoría

## 1. Ciclo Rojo → Verde → Refactor

El ciclo Rojo → Verde → Refactor es la base del desarrollo guiado por pruebas (TDD). Comienza escribiendo una prueba que falla (rojo), luego se implementa el código mínimo necesario para que la prueba pase (verde), y finalmente se mejora el código manteniendo las pruebas en verde (refactor). El tamaño de los pasos es crucial porque pasos pequeños permiten localizar errores rápidamente, mantener el enfoque en una sola funcionalidad y construir confianza gradualmente. Pasos grandes pueden llevar a código complejo difícil de depurar, mientras que pasos demasiado pequeños pueden ralentizar el desarrollo. El equilibrio adecuado permite avanzar con seguridad mientras se mantiene la calidad del código.

## 2. Diferencia entre tests unitarios, de integración y E2E en APIs

**Tests unitarios**: Prueban componentes individuales aislados (funciones, clases) sin dependencias externas. En APIs, verifican la lógica de negocio, validaciones y transformaciones de datos. Ejemplo: probar una función de validación de formato de email.

**Tests de integración**: Prueban la interacción entre múltiples componentes del sistema. En APIs, verifican la comunicación entre controladores, servicios y bases de datos. Ejemplo: probar que un endpoint guarde correctamente datos en la base de datos y retorne la respuesta esperada.

**Tests E2E (End-to-End)**: Prueban el sistema completo simulando el comportamiento del usuario final. En APIs, verifican flujos completos desde la solicitud HTTP hasta la respuesta, incluyendo todas las capas intermedias. Ejemplo: probar un flujo de registro, autenticación y acceso a recursos protegidos.

## 3. Dobles de prueba: mock, stub y spy

Un **doble de prueba** es un objeto que reemplaza a un componente real durante las pruebas para aislar el código bajo prueba. Los tipos principales son:

**Mock**: Objeto preprogramado con expectativas sobre cómo será llamado. Verifica tanto el comportamiento como el estado. Conviene usarlo cuando necesitamos verificar que ciertos métodos son llamados con parámetros específicos. Ejemplo: verificar que un servicio de notificaciones es llamado cuando se crea un usuario.

**Stub**: Proporciona respuestas predefinidas a llamadas durante la prueba, sin verificar cómo es utilizado. Conviene usarlo cuando necesitamos simular comportamientos específicos sin preocuparnos por las interacciones. Ejemplo: simular una respuesta de una API externa o una consulta a base de datos.

**Spy**: Registra las llamadas realizadas sin alterar el comportamiento. Conviene usarlo cuando queremos observar el comportamiento sin modificarlo. Ejemplo: verificar cuántas veces se llamó a un método de logging durante una operación.

## 4. Separación de app y server

Separar la aplicación (app) del servidor (server) permite probar la aplicación sin iniciar un servidor HTTP real, facilitando pruebas más rápidas y aisladas. La función `makeApp()` encapsula la configuración de Express, mientras que el servidor gestiona la escucha de puertos y el ciclo de vida.

```javascript
// app.js
export function makeApp() {
  const app = express();
  app.use(express.json());
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/users', userRouter);
  return app;
}

// server.js
import { makeApp } from './app';
const app = makeApp();
app.listen(3000, () => console.log('Server running'));

// test.js
import request from 'supertest';
import { makeApp } from './app';

describe('API', () => {
  it('should return health status', async () => {
    const app = makeApp();
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
```

## 5. Zod: parse vs safeParse

**parse**: Lanza una excepción si la validación falla, lo que interrumpe la ejecución. Es útil cuando queremos que el programa falle rápidamente ante datos inválidos.

**safeParse**: Retorna un objeto con propiedades `success` y `data` o `error`, sin lanzar excepciones. Es más adecuado para entornos donde necesitamos manejar errores de forma controlada.

En una ruta Express, usaría `safeParse` en el controlador para validar los datos de entrada porque permite manejar errores de validación de forma elegante y enviar respuestas apropiadas al cliente sin interrumpir la ejecución del servidor:

```javascript
router.post('/users', (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ errors: result.error.format() });
  }
  // Continuar con la lógica de negocio usando result.data
});
```

## 6. Reglas de dominio para tests unitarios

1. **Cálculo de descuentos**: Una regla que determina el descuento aplicable según el total de la compra, tipo de cliente y productos adquiridos. Ejemplo: "Clientes premium reciben 15% en compras superiores a $100, excepto en productos en oferta".

2. **Validación de disponibilidad de inventario**: Una regla que verifica si hay suficiente stock para completar un pedido considerando reservas pendientes y umbrales mínimos de inventario. Ejemplo: "No se pueden vender productos que dejen el inventario por debajo del umbral de seguridad".

## 7. Malos olores en suites de tests

1. **Nombres poco descriptivos**: Tests con nombres genéricos como "test1" o "should work correctly" que no indican qué se está probando ni el comportamiento esperado, dificultando el mantenimiento y la comprensión.

2. **Aserciones débiles**: Tests que verifican aspectos superficiales sin comprobar realmente la funcionalidad, como verificar que una función retorna un objeto sin comprobar sus propiedades específicas o valores esperados.

3. **Dependencias entre tests**: Tests que dependen del estado dejado por tests anteriores, causando fallos intermitentes y dificultando la ejecución aislada. Por ejemplo, un test que asume que existe un registro en la base de datos creado por otro test.

## 8. Trazabilidad entre criterios de aceptación y tests

La trazabilidad se puede lograr mediante identificadores únicos, etiquetas o referencias explícitas en los nombres de los tests:

| Criterio de Aceptación | Test Correspondiente |
|------------------------|----------------------|
| CA1: Un usuario puede registrarse proporcionando email y contraseña válidos | `test('CA1: debería registrar un usuario con credenciales válidas', ...)` |
| CA2: El sistema debe rechazar registros con contraseñas de menos de 8 caracteres | `test('CA2: debería rechazar registro con contraseña corta', ...)` |

## 9. Limitaciones de perseguir 100% de cobertura

Perseguir 100% de cobertura a toda costa puede ser contraproducente por varias razones:

1. **Falsa sensación de seguridad**: Alta cobertura no garantiza calidad; los tests pueden ejecutar código sin verificar correctamente su comportamiento.
2. **Costo-beneficio desfavorable**: El esfuerzo para cubrir el último 10-20% suele ser desproporcionado respecto al valor añadido.
3. **Tests frágiles o artificiales**: Para alcanzar cobertura total, se pueden crear tests que no reflejan casos de uso reales.
4. **Mantenimiento costoso**: Más tests implican más código que mantener, especialmente problemático cuando se prueban detalles de implementación que cambian frecuentemente.

## 10. Helper/builder para tests

Un helper/builder para tests es un patrón que facilita la creación de objetos complejos para pruebas, mejorando la legibilidad y mantenibilidad. Ejemplo:

```javascript
// OrderBuilder para crear órdenes de prueba con valores predeterminados
class OrderBuilder {
  constructor() {
    this.order = {
      id: 1,
      items: [],
      address: "Calle Test 123",
      status: "pendiente",
      createdAt: new Date()
    };
  }

  withId(id) {
    this.order.id = id;
    return this;
  }

  withItems(items) {
    this.order.items = items;
    return this;
  }

  withStatus(status) {
    this.order.status = status;
    return this;
  }

  build() {
    return { ...this.order };
  }
}

// Uso en tests
const order = new OrderBuilder()
  .withId(123)
  .withItems([{ name: "Pizza", quantity: 2 }])
  .withStatus("entregado")
  .build();
```