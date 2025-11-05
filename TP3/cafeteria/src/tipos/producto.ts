import { z } from 'zod';

export const ProductoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2), 
  precio: z.number().positive(),
  tipo: z.enum(['Bebida', 'Comida']), 
});

export type Producto = z.infer<typeof ProductSchema>;

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}