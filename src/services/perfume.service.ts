import api from '@/lib/api';
import { Perfume } from '@/types';

interface PerfumeFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'brand';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface PerfumeResponse {
  data: Perfume[];
  total: number;
  page: number;
  totalPages: number;
}

export const perfumeService = {
  async getAll(filters: PerfumeFilters = {}): Promise<PerfumeResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    const response = await api.get(`/perfumes?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Perfume> {
    const response = await api.get(`/perfumes/${id}`);
    return response.data;
  },

  async create(data: FormData): Promise<Perfume> {
    const response = await api.post('/perfumes', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: FormData): Promise<Perfume> {
    const response = await api.put(`/perfumes/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/perfumes/${id}`);
  },

  async getFavorites(): Promise<Perfume[]> {
    const response = await api.get('/perfumes/favorites');
    return response.data;
  },

  async toggleFavorite(id: string): Promise<void> {
    await api.post(`/perfumes/${id}/favorite`);
  }
};