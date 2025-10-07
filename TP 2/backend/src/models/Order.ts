// Interfaces para el modelo de Order
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

// Validación de datos
export function validateOrder(order: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  // Validar que exista items y sea un array
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push("Debe haber al menos un ítem en el pedido");
  } else {
    // Validar cada item
    for (const item of order.items) {
      if (!item.name) {
        errors.push("Todos los ítems deben tener un nombre");
      }
      
      if (!item.size || !["S", "M", "L"].includes(item.size)) {
        errors.push("Todos los ítems deben tener un tamaño válido (S, M, L)");
      }
      
      if (!item.toppings || !Array.isArray(item.toppings)) {
        errors.push("Todos los ítems deben tener un array de toppings");
      } else if (item.toppings.length > 5) {
        errors.push("No se pueden agregar más de 5 toppings por ítem");
      }
    }
  }

  // Validar dirección
  if (!order.address || order.address.length < 10) {
    errors.push("La dirección es requerida y debe tener al menos 10 caracteres");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}