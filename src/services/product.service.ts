import api from '@/lib/api';

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return api.get(`/products?${params.toString()}`);
  },

  async getProduct(id: string) {
    return api.get(`/products/${id}`);
  },

  async createProduct(data: FormData) {
    return api.post('/products', data);
  },

  async updateProduct(id: string, data: FormData) {
    return api.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string) {
    return api.delete(`/products/${id}`);
  }
};