import api from '@/lib/api';
import { Promotion } from '@/types';

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    const response = await api.get('/promotions');
    return response.data;
  },

  async getActive(): Promise<Promotion[]> {
    const response = await api.get('/promotions/active');
    return response.data;
  },

  async getById(id: string): Promise<Promotion> {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  async create(data: {
    name: string;
    description?: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    perfumeIds: string[];
  }): Promise<Promotion> {
    const response = await api.post('/promotions', data);
    return response.data;
  },

  async update(id: string, data: Partial<Promotion>): Promise<Promotion> {
    const response = await api.put(`/promotions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/promotions/${id}`);
  },

  async addPerfumes(id: string, perfumeIds: string[]): Promise<Promotion> {
    const response = await api.post(`/promotions/${id}/perfumes`, { perfumeIds });
    return response.data;
  },

  async removePerfumes(id: string, perfumeIds: string[]): Promise<Promotion> {
    const response = await api.delete(`/promotions/${id}/perfumes`, {
      data: { perfumeIds }
    });
    return response.data;
  }
};