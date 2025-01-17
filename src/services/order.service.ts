import api from '@/lib/api';
import { Order } from '@/types';

interface CreateOrderData {
  items: {
    perfumeId: string;
    quantity: number;
    price: number;
  }[];
  addressId: string;
  deliveryFee: number;
}

export const orderService = {
  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getAll(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
};