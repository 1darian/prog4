import request from 'supertest';
import app from '../../app';
import { PizzaSize, OrderStatus } from '../../models/orderModel';
import pool from '../../config/database';


// Mock para evitar la conexión real a la base de datos en tests
jest.mock('../../config/database', () => {
  const mockPool = {
    query: jest.fn()
  };
  return mockPool;
});

describe('Order API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid data', async () => {
      const mockOrder = {
        id: 1,
        customer_name: 'John Doe',
        customer_phone: '1234567890',
        address: '123 Main Street, Apt 4B',
        status: 'pending',
        total_price: 12.97,
        items: [{ size: 'M', toppings: ['cheese', 'tomato'], quantity: 1 }],
        created_at: new Date().toISOString()
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockOrder] });

      const response = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          customerPhone: '1234567890',
          address: '123 Main Street, Apt 4B',
          items: [
            {
              size: PizzaSize.M,
              toppings: ['cheese', 'tomato'],
              quantity: 1
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerName).toBe('John Doe');
    });

    it('should return 422 for invalid order data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          customerPhone: '1234567890',
          address: '123 Main', // Too short
          items: [
            {
              size: PizzaSize.M,
              toppings: ['cheese', 'tomato'],
              quantity: 1
            }
          ]
        });

      expect(response.status).toBe(422);
    });

    it('should return 422 for empty items array', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          customerPhone: '1234567890',
          address: '123 Main Street, Apt 4B',
          items: [] // Empty items array
        });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 1,
        customer_name: 'John Doe',
        customer_phone: '1234567890',
        address: '123 Main Street, Apt 4B',
        status: 'pending',
        total_price: 12.97,
        items: [{ size: 'M', toppings: ['cheese', 'tomato'], quantity: 1 }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockOrder] });

      const response = await request(app).get('/api/orders/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent order', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/orders/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    it('should cancel an order with valid id', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ 
        rows: [{ status: OrderStatus.PENDING }] 
      });
      
      (pool.query as jest.Mock).mockResolvedValueOnce({ 
        rows: [{ 
          id: 1, 
          status: OrderStatus.CANCELLED 
        }] 
      });

      const response = await request(app).post('/api/orders/1/cancel');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', OrderStatus.CANCELLED);
    });

    it('should return 409 when trying to cancel a delivered order', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ 
        rows: [{ status: OrderStatus.DELIVERED }] 
      });

      const response = await request(app).post('/api/orders/1/cancel');

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        {
          id: 1,
          customer_name: 'John Doe',
          customer_phone: '1234567890',
          address: '123 Main Street, Apt 4B',
          status: 'pending',
          total_price: 12.97,
          items: [{ size: 'M', toppings: ['cheese', 'tomato'], quantity: 1 }],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          customer_name: 'Jane Smith',
          customer_phone: '0987654321',
          address: '456 Oak Avenue, Suite 7C',
          status: 'delivered',
          total_price: 25.94,
          items: [{ size: 'L', toppings: ['cheese', 'pepperoni'], quantity: 2 }],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockOrders });

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should filter orders by status', async () => {
      const mockOrders = [
        {
          id: 1,
          customer_name: 'John Doe',
          customer_phone: '1234567890',
          address: '123 Main Street, Apt 4B',
          status: 'pending',
          total_price: 12.97,
          items: [{ size: 'M', toppings: ['cheese', 'tomato'], quantity: 1 }],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockOrders });

      const response = await request(app).get('/api/orders?status=pending');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('pending');
    });
  });
});