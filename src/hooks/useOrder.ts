import { useContext } from 'react';
import { OrderContext } from '@/contexts/OrderContext';

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
