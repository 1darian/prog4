import { z } from 'zod';

// Enumeración para los tamaños de pizza
export enum PizzaSize {
  S = 'S',
  M = 'M',
  L = 'L'
}

// Enumeración para el estado del pedido
export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Esquema para validar los toppings
export const ToppingSchema = z.string();

// Esquema para validar los items (pizzas)
export const PizzaItemSchema = z.object({
  size: z.nativeEnum(PizzaSize),
  toppings: z.array(ToppingSchema).max(5, 'Máximo 5 toppings permitidos'),
  quantity: z.number().int().positive(),
});

// Esquema para validar la creación de órdenes
export const CreateOrderSchema = z.object({
  items: z.array(PizzaItemSchema).nonempty('Debe incluir al menos un item'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  customerName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  customerPhone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
});

// Esquema para validar la actualización de estado
export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// Tipo para representar una orden en la base de datos
export type Order = {
  id: number;
  items: {
    size: PizzaSize;
    toppings: string[];
    quantity: number;
  }[];
  address: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

// Tipo para la creación de una orden
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Precios base según el tamaño
export const BASE_PRICES = {
  [PizzaSize.S]: 8.99,
  [PizzaSize.M]: 10.99,
  [PizzaSize.L]: 12.99,
};

// Precio por topping
export const TOPPING_PRICE = 0.99;

// Función para calcular el precio total de una orden
export function calculateOrderPrice(items: CreateOrderInput['items']): number {
  return items.reduce((total, item) => {
    const basePrice = BASE_PRICES[item.size];
    const toppingsPrice = item.toppings.length * TOPPING_PRICE;
    return total + (basePrice + toppingsPrice) * item.quantity;
  }, 0);
}