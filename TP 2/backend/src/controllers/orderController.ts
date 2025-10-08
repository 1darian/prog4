import { Request, Response } from 'express';
import { CreateOrderSchema } from '../models/orderModel';
import { 
  validateOrderRules, 
  createNewOrder, 
  getOrderById as getOrder, 
  cancelOrderById, 
  getOrders as getAllOrders 
} from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada con Zod
    const validationResult = CreateOrderSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(422).json({ 
        error: 'Datos inválidos', 
        details: validationResult.error.format() 
      });
    }
    
    const orderData = validationResult.data;
    
    // Validar reglas de negocio
    const rulesValidation = validateOrderRules(orderData);
    if (!rulesValidation.valid) {
      return res.status(422).json({ error: rulesValidation.error });
    }
    
    // Crear la orden
    const newOrder = await createNewOrder(orderData);
    
    res.status(201).json({
      id: newOrder.id,
      customerName: newOrder.customer_name,
      customerPhone: newOrder.customer_phone,
      address: newOrder.address,
      status: newOrder.status,
      totalPrice: newOrder.total_price,
      items: newOrder.items,
      createdAt: newOrder.created_at
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'ID de orden inválido' });
    }
    
    const order = await getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json({
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      address: order.address,
      status: order.status,
      totalPrice: order.total_price,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    });
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'ID de orden inválido' });
    }
    
    const result = await cancelOrderById(orderId);
    
    if (!result.success) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    
    const updatedOrder = result.order;
    
    res.json({
      id: updatedOrder.id,
      status: updatedOrder.status,
      message: 'Orden cancelada exitosamente'
    });
  } catch (error) {
    console.error('Error al cancelar la orden:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    
    const orders = await getAllOrders(status);
    
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      address: order.address,
      status: order.status,
      totalPrice: order.total_price,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};