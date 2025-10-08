import pool from '../config/database';
import { 
  CreateOrderInput, 
  OrderStatus, 
  PizzaSize, 
  calculateOrderPrice 
} from '../models/orderModel';

// Validar reglas de negocio para la creación de órdenes
export const validateOrderRules = (orderData: CreateOrderInput): { valid: boolean; error?: string } => {
  // Verificar que hay items en la orden
  if (orderData.items.length === 0) {
    return { valid: false, error: 'La orden debe contener al menos un item' };
  }

  // Verificar cada item
  for (const item of orderData.items) {
    // Verificar tamaño válido
    if (!Object.values(PizzaSize).includes(item.size)) {
      return { valid: false, error: `Tamaño de pizza inválido: ${item.size}` };
    }

    // Verificar límite de toppings
    if (item.toppings.length > 5) {
      return { valid: false, error: 'Máximo 5 toppings permitidos por pizza' };
    }
  }

  // Verificar longitud mínima de la dirección
  if (orderData.address.length < 10) {
    return { valid: false, error: 'La dirección debe tener al menos 10 caracteres' };
  }

  return { valid: true };
};

// Crear una nueva orden
export const createNewOrder = async (orderData: CreateOrderInput) => {
  // Calcular precio total
  const totalPrice = calculateOrderPrice(orderData.items);
  
  // Insertar en la base de datos
  const result = await pool.query(
    `INSERT INTO orders 
      (customer_name, customer_phone, address, status, total_price, items) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      orderData.customerName,
      orderData.customerPhone,
      orderData.address,
      OrderStatus.PENDING,
      totalPrice,
      JSON.stringify(orderData.items)
    ]
  );
  
  return result.rows[0];
};

// Cancelar una orden
export const cancelOrderById = async (orderId: number) => {
  // Verificar si la orden existe y su estado actual
  const checkResult = await pool.query(
    'SELECT status FROM orders WHERE id = $1',
    [orderId]
  );
  
  if (checkResult.rows.length === 0) {
    return { success: false, error: 'Orden no encontrada', status: 404 };
  }
  
  const currentStatus = checkResult.rows[0].status;
  
  // No se puede cancelar si ya está entregada
  if (currentStatus === OrderStatus.DELIVERED) {
    return { 
      success: false, 
      error: 'No se puede cancelar una orden que ya ha sido entregada',
      status: 409
    };
  }
  
  // Actualizar el estado a cancelado
  const updateResult = await pool.query(
    `UPDATE orders 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING *`,
    [OrderStatus.CANCELLED, orderId]
  );
  
  return { success: true, order: updateResult.rows[0] };
};

// Obtener una orden por ID
export const getOrderById = async (orderId: number) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
};

// Obtener órdenes con filtro opcional por estado
export const getOrders = async (status?: string) => {
  let query = 'SELECT * FROM orders';
  const queryParams: any[] = [];
  
  // Filtrar por estado si se proporciona
  if (status) {
    query += ' WHERE status = $1';
    queryParams.push(status);
  }
  
  // Ordenar por fecha de creación (más recientes primero)
  query += ' ORDER BY created_at DESC';
  
  const result = await pool.query(query, queryParams);
  return result.rows;
};