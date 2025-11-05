
import { http, HttpResponse } from 'msw';
import { mockProducts } from './data';
import { ProductSchema } from '../tipos/producto';

export const handlers = [
  http.get('/api/menu', () => {
    return HttpResponse.json(mockProducts, { status: 200 });
  }),


  http.post('/api/orders', async ({ request }) => {
    const body = await request.json();
    console.log('Pedido recibido:', body);
    
    return HttpResponse.json({ orderId: 'ORD-' + Date.now(), status: 'confirmed' }, { status: 201 });
  }),
];