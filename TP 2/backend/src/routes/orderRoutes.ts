import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  cancelOrder, 
  getOrders 
} from '../controllers/orderController';

const router = Router();

// Endpoints de órdenes
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);
router.post('/orders/:id/cancel', cancelOrder);
router.get('/orders', getOrders);

export default router;