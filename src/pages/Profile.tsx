import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrder } from '@/contexts/OrderContext';
import { Package, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const orderStatuses = {
  'PENDING': {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertTriangle
  },
  'PROCESSING': {
    label: 'En préparation',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock
  },
  'SHIPPING': {
    label: 'En livraison',
    color: 'bg-purple-100 text-purple-800',
    icon: Package
  },
  'COMPLETED': {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState('orders');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Mes Commandes</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {orders.length > 0 ? (
              orders.map((order) => {
                const StatusIcon = orderStatuses[order.status].icon;
                const orderNumber = String(order.id).padStart(4, '0');
                
                return (
                  <motion.div key={order.id} variants={item}>
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${orderStatuses[order.status].color}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Commande #{orderNumber}</h3>
                              <Badge className={orderStatuses[order.status].color}>
                                {orderStatuses[order.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold mb-1">{order.total.toLocaleString()} FCFA</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate(`/order-tracking/${orderNumber}`)}
                          >
                            Suivre
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Articles commandés</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                variants={item}
                className="text-center py-12"
              >
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore passé de commande
                </p>
                <Button onClick={() => navigate('/parfums')}>
                  Découvrir nos parfums
                </Button>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
            {/* Contenu du profil à implémenter */}
            <p className="text-gray-600">Cette section sera bientôt disponible</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}