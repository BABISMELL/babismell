import api from '@/lib/api';

export interface PaymentMethod {
  id: string;
  type: 'MOBILE_MONEY' | 'CARD' | 'CASH';
  provider?: 'ORANGE' | 'MTN' | 'MOOV' | 'WAVE';
  name: string;
  icon: string;
  enabled: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: PaymentMethod;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    paymentMethodId: string;
    orderId: string;
  }): Promise<PaymentIntent> {
    const response = await api.post('/payments/intent', data);
    return response.data;
  },

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await api.post(`/payments/confirm/${paymentIntentId}`);
    return response.data;
  },

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await api.get(`/payments/status/${paymentIntentId}`);
    return response.data;
  }
};