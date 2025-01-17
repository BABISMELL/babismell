import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useToast } from '@/components/ui/use-toast';

export function useOrderNotifications() {
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const notificationSound = new Audio('/notification.mp3');

  useEffect(() => {
    // Connexion au serveur Socket.IO
    socket.connect();

    // Écouter les nouvelles commandes
    socket.on('newOrder', (order) => {
      setOrders(prev => [order, ...prev]);
      notificationSound.play();
      toast({
        title: "Nouvelle commande !",
        description: `Commande #${order.id} reçue`,
      });
    });

    // Écouter les mises à jour de statut
    socket.on('orderStatusUpdated', ({ orderId, status }) => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    });

    // Nettoyage
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateOrderStatus = (orderId: string, status: string) => {
    socket.emit('updateOrderStatus', { orderId, status });
  };

  return {
    orders,
    updateOrderStatus
  };
}