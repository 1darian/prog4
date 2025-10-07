import { Request, Response } from 'express';
import { pool } from '../db/connection';
import { Order, validateOrder } from '../models/Order';

// Obtener todas las órdenes
export async function getAllOrders(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
}

// Obtener una orden por ID
export async function getOrderById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    res.status(500).json({ error: "Error al obtener la orden" });
  }
}

// Crear una nueva orden
export async function createOrder(req: Request, res: Response) {
  try {
    const orderData = req.body;
    
    // Validar datos
    const validation = validateOrder(orderData);
    if (!validation.valid) {
      return res.status(422).json({ errors: validation.errors });
    }
    
    const { items, address } = orderData;
    const result = await pool.query(
      "INSERT INTO orders (items, address, status) VALUES ($1, $2, $3) RETURNING *",
      [JSON.stringify(items), address, "pendiente"]
    );
    
    res.status(201).json({ message: "Pedido creado", order: result.rows[0] });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error al crear la orden" });
  }
}

// Actualizar una orden existente
export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    // Verificar que la orden existe
    const checkResult = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    
    const orderData = req.body;
    const { items, address, status } = orderData;
    
    // Construir la consulta dinámicamente
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
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
    }
    
    query += updateFields.join(", ");
    query += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);
    
    const result = await pool.query(query, values);
    res.json({ message: "Pedido actualizado", order: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
}

// Eliminar una orden
export async function deleteOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    // Verificar que la orden existe
    const checkResult = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    
    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);
    res.json({ message: "Pedido eliminado", order: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error al eliminar la orden" });
  }
}