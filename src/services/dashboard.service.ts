import api from '@/lib/api';

interface DashboardStats {
  totalSales: number;
  ordersCount: number;
  newCustomers: number;
  conversionRate: number;
}

interface SalesData {
  date: string;
  amount: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getSalesData(period: 'day' | 'week' | 'month' | 'year'): Promise<SalesData[]> {
    const response = await api.get(`/admin/dashboard/sales?period=${period}`);
    return response.data;
  },

  async getTopProducts(): Promise<any[]> {
    const response = await api.get('/admin/dashboard/top-products');
    return response.data;
  },

  async getRecentOrders(): Promise<any[]> {
    const response = await api.get('/admin/dashboard/recent-orders');
    return response.data;
  }
};