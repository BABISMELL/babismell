import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore, useUserStore } from '@/stores/globalStore';
import { useToast } from '@/components/ui/use-toast';
import { socketManager } from '@/lib/socket';
import api from '@/lib/axios';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zone: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress: ShippingAddress;
  deliveryFee: number;
  paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  isLoading: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateOrders = useGlobalStore(state => state.updateOrders);
  const setCurrentOrder = useUserStore(state => state.setCurrentOrder);

  const createOrder = async (orderData: any): Promise<Order> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Sending order data:', orderData);
      const response = await api.post('/orders', orderData);
      const newOrder = response.data;

      // Mettre à jour le state local
      setOrders(prev => [newOrder, ...prev]);
      
      // Mettre à jour le store global
      updateOrders([newOrder, ...orders]);
      
      // Émettre l'événement socket
      socketManager.emit('newOrder', newOrder);

      // Définir la commande courante
      setCurrentOrder(newOrder);

      return newOrder;
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Une erreur est survenue lors de la création de la commande';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.put(`/orders/${orderId}/status`, { status });
      const updatedOrder = response.data;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );

      // Émettre l'événement socket
      socketManager.emit('updateOrderStatus', { orderId, status });

      toast({
        title: "Succès",
        description: "Le statut de la commande a été mis à jour"
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Une erreur est survenue lors de la mise à jour du statut';
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  useEffect(() => {
    // Écouter les mises à jour des commandes via socket
    socketManager.on('orderUpdate', (updatedOrder: Order) => {
      setOrders(prev => 
        prev.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      updateOrders(orders);
    });

    return () => {
      socketManager.off('orderUpdate');
    };
  }, [orders, updateOrders]);

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    isLoading,
    error
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}