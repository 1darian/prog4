import { Router } from "express";
import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  deleteOrder 
} from "../controllers/orderController";

const router = Router();

// GET /orders - Obtener todas las órdenes
router.get("/", getAllOrders);

// GET /orders/:id - Obtener una orden por ID
router.get("/:id", getOrderById);

// POST /orders - Crear una nueva orden
router.post("/", createOrder);

// PUT /orders/:id - Actualizar una orden existente
router.put("/:id", updateOrder);

// DELETE /orders/:id - Eliminar una orden
router.delete("/:id", deleteOrder);

export default router;
