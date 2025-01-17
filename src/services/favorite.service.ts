import api from '@/lib/api';
import { Perfume } from '@/types';

export const favoriteService = {
  async getAll(): Promise<Perfume[]> {
    const response = await api.get('/favorites');
    return response.data;
  },

  async add(perfumeId: string): Promise<void> {
    await api.post(`/favorites/${perfumeId}`);
  },

  async remove(perfumeId: string): Promise<void> {
    await api.delete(`/favorites/${perfumeId}`);
  },

  async check(perfumeId: string): Promise<boolean> {
    const response = await api.get(`/favorites/check/${perfumeId}`);
    return response.data.isFavorite;
  }
};