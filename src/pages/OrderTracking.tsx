import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const orderStatuses = {
  'PENDING': {
    label: 'En attente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: AlertCircle,
    step: 0,
    message: 'Votre commande a été reçue et est en attente de confirmation',
    details: 'Notre équipe va bientôt traiter votre commande'
  },
  'PROCESSING': {
    label: 'En préparation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Package,
    step: 1,
    message: 'Votre commande est en cours de préparation',
    details: 'Nous préparons vos articles avec soin'
  },
  'SHIPPING': {
    label: 'En livraison',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Truck,
    step: 2,
    message: 'Votre commande est en cours de livraison',
    details: 'Notre livreur est en route vers l\'adresse indiquée'
  },
  'COMPLETED': {
    label: 'Livrée',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
    step: 3,
    message: 'Votre commande a été livrée avec succès',
    details: 'Nous espérons que vous apprécierez vos produits'
  }
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Récupérer les commandes du localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find((o: any) => String(o.id).padStart(4, '0') === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Commande introuvable</h2>
          <p className="text-gray-600">La commande #{orderId} n'existe pas</p>
        </div>
      </div>
    );
  }

  const currentStatus = orderStatuses[order.status as keyof typeof orderStatuses];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentStatus.bgColor} mb-4`}>
                <StatusIcon className={`h-8 w-8 ${currentStatus.color}`} />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentStatus.label}</h2>
              <p className="text-gray-600">{currentStatus.message}</p>
              <p className="text-sm text-gray-500 mt-2">{currentStatus.details}</p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
              {Object.entries(orderStatuses).map(([key, status], index) => {
                const StatusIcon = status.icon;
                const isActive = status.step <= currentStatus.step;
                const isLast = index === Object.entries(orderStatuses).length - 1;

                return (
                  <div key={key} className={`relative pl-16 ${isLast ? '' : 'mb-8'}`}>
                    <div className={`absolute left-7 -translate-x-1/2 w-3 h-3 rounded-full ${
                      isActive ? status.bgColor : 'bg-gray-200'
                    } border-2 ${
                      isActive ? `border-${status.color.replace('text-', '')}` : 'border-gray-300'
                    }`} />
                    <div className="flex items-center gap-4">
                      <StatusIcon className={`h-6 w-6 ${isActive ? status.color : 'text-gray-400'}`} />
                      <div>
                        <h3 className={`font-semibold ${isActive ? status.color : 'text-gray-400'}`}>
                          {status.label}
                        </h3>
                        {isActive && key === order.status && (
                          <p className="text-sm text-gray-600 mt-1">
                            {status.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Détails de la commande</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{(order.total - order.deliveryFee).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>{order.deliveryFee.toLocaleString()} FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{order.total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}