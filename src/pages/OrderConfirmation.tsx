import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, MapPin, Clock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useUserStore } from '@/stores/globalStore';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const currentOrder = useUserStore((state) => state.currentOrder);
  const setCurrentOrder = useUserStore((state) => state.setCurrentOrder);

  useEffect(() => {
    // Si on arrive directement sur la page avec un state, on le sauvegarde
    if (location.state?.order) {
      setCurrentOrder(location.state.order);
    }
    
    if (!location.state?.order && !currentOrder) {
      navigate('/', { replace: true });
      return;
    }

    // Clear cart and prevent back navigation issues
    clearCart();
    
    // Replace current history state to prevent back navigation issues
    window.history.replaceState({}, '', window.location.pathname);

    return () => {
      // Clean up on unmount
      window.onpopstate = null;
      setCurrentOrder(null);
    };
  }, []);

  if (!currentOrder) return null;

  const orderNumber = String(currentOrder.id).padStart(4, '0');

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: "Copié !",
      description: "Le numéro de suivi a été copié dans le presse-papier"
    });
  };

  const handleContinueShopping = () => {
    navigate('/parfums', { replace: true });
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${orderNumber}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-4">
            Votre commande a été enregistrée avec succès
          </p>

          <div className="bg-purple-100 p-4 rounded-lg inline-flex items-center gap-3">
            <div>
              <p className="text-sm text-purple-600 font-medium">Numéro de suivi</p>
              <p className="text-2xl font-bold text-purple-700">{orderNumber}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={copyTrackingNumber}
              className="hover:bg-purple-200"
            >
              <Copy className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
        </motion.div>

        <Card className="p-6 mb-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Package className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Détails de la commande</h3>
                <p className="text-sm text-gray-600">
                  {currentOrder.items.length} article(s) • Total: {currentOrder.total.toLocaleString()} FCFA
                </p>
                <div className="mt-4 space-y-3">
                  {currentOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-gray-600">{item.price.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <Truck className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Livraison</h3>
                <p className="text-sm text-gray-600">
                  {currentOrder.shipping.method}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Adresse de livraison</h3>
                <p className="text-sm text-gray-600">
                  {currentOrder.shipping.address}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Délai de livraison estimé</h3>
                <p className="text-sm text-gray-600">
                  {currentOrder.shipping.estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleTrackOrder}
          >
            Suivre ma commande
          </Button>
          <Button
            className="flex-1"
            onClick={handleContinueShopping}
          >
            Continuer mes achats
          </Button>
        </div>
      </div>
    </div>
  );
}