import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  price: z.number().positive(),
});

export type Producto = z.infer<typeof ProductSchema>;

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}