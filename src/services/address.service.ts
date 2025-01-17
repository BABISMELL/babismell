import api from '@/lib/api';
import { Address } from '@/types';

export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  },

  async create(data: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zone: string;
    isDefault?: boolean;
  }): Promise<Address> {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefault(id: string): Promise<Address> {
    const response = await api.post(`/addresses/${id}/default`);
    return response.data;
  }
};