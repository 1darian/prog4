import { pool } from "../db/connection";

// Interfaces
export interface OrderItem {
  name: string;
  size: "S" | "M" | "L";
  toppings: string[];
}

export interface Order {
  id?: number;
  items: OrderItem[];
  address: string;
  status?: string;
  created_at?: Date;
}

// Obtener todas las órdenes
export async function getAllOrders() {
  const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
  return result.rows;
}

// Obtener una orden por ID
export async function getOrderById(id: number) {
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0];
}

// Crear una nueva orden
export async function createOrder(order: Order) {
  const { items, address } = order;
  const result = await pool.query(
    "INSERT INTO orders (items, address, status) VALUES ($1, $2, $3) RETURNING *",
    [JSON.stringify(items), address, "pendiente"]
  );
  return result.rows[0];
}

// Actualizar una orden
export async function updateOrder(id: number, order: Partial<Order>) {
  const { items, address, status } = order;
  
  // Construir la consulta dinámicamente basada en los campos proporcionados
  let query = "UPDATE orders SET ";
  const values = [];
  const updateFields = [];
  
  let paramIndex = 1;
  
  if (items) {
    updateFields.push(`items = $${paramIndex}`);
    values.push(JSON.stringify(items));
    paramIndex++;
  }
  
  if (address) {
    updateFields.push(`address = $${paramIndex}`);
    values.push(address);
    paramIndex++;
  }
  
  if (status) {
    updateFields.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }
  
  query += updateFields.join(", ");
  query += ` WHERE id = $${paramIndex} RETURNING *`;
  values.push(id);
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Eliminar una orden
export async function deleteOrder(id: number) {
  const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}
