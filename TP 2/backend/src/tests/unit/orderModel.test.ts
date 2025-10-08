import { 
  PizzaSize, 
  calculateOrderPrice, 
  CreateOrderSchema 
} from '../../models/orderModel';

describe('Order Model', () => {
  describe('calculateOrderPrice', () => {
    it('should calculate correct price for a single pizza', () => {
      const items = [
        {
          size: PizzaSize.M,
          toppings: ['cheese', 'tomato'],
          quantity: 1
        }
      ];
      
      // Base price for M + 2 toppings
      const expectedPrice = 10.99 + (2 * 0.99);
      expect(calculateOrderPrice(items)).toBeCloseTo(expectedPrice);
    });
    
    it('should calculate correct price for multiple pizzas', () => {
      const items = [
        {
          size: PizzaSize.S,
          toppings: ['cheese'],
          quantity: 2
        },
        {
          size: PizzaSize.L,
          toppings: ['cheese', 'pepperoni', 'mushrooms', 'olives', 'onions'],
          quantity: 1
        }
      ];
      
      // 2 * (S + 1 topping) + (L + 5 toppings)
      const expectedPrice = 2 * (8.99 + 0.99) + (12.99 + 5 * 0.99);
      expect(calculateOrderPrice(items)).toBeCloseTo(expectedPrice);
    });
    
    it('should return 0 for empty items array', () => {
      expect(calculateOrderPrice([])).toBe(0);
    });
  });
  
  describe('CreateOrderSchema validation', () => {
    it('should validate a valid order', () => {
      const validOrder = {
        items: [
          {
            size: PizzaSize.M,
            toppings: ['cheese', 'tomato'],
            quantity: 1
          }
        ],
        address: '123 Main Street, Apartment 4B',
        customerName: 'John Doe',
        customerPhone: '1234567890'
      };
      
      const result = CreateOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });
    
    it('should reject an order with empty items array', () => {
      const invalidOrder = {
        items: [],
        address: '123 Main Street, Apartment 4B',
        customerName: 'John Doe',
        customerPhone: '1234567890'
      };
      
      const result = CreateOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
    
    it('should reject an order with too many toppings', () => {
      const invalidOrder = {
        items: [
          {
            size: PizzaSize.M,
            toppings: ['cheese', 'tomato', 'pepperoni', 'mushrooms', 'olives', 'onions'], // 6 toppings
            quantity: 1
          }
        ],
        address: '123 Main Street, Apartment 4B',
        customerName: 'John Doe',
        customerPhone: '1234567890'
      };
      
      const result = CreateOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
    
    it('should reject an order with short address', () => {
      const invalidOrder = {
        items: [
          {
            size: PizzaSize.M,
            toppings: ['cheese', 'tomato'],
            quantity: 1
          }
        ],
        address: '123 Main', // Less than 10 characters
        customerName: 'John Doe',
        customerPhone: '1234567890'
      };
      
      const result = CreateOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
  });
});