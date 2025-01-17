import api from '@/lib/api';
import { Category } from '@/types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async create(data: { name: string; description?: string }): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id: string, data: { name?: string; description?: string }): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
};