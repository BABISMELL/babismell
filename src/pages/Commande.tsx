import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from '@/contexts/CartContext';

export default function Commande() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const deliveryFee = 2000;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    navigate('/checkout', { replace: true });
  };

  const handleContinueShopping = () => {
    navigate('/parfums', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <ShoppingBag className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mon Panier</h1>
          <p className="text-lg text-muted-foreground">
            Finalisez votre commande en toute sécurité
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="font-bold mt-2">
                          {item.price.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleCheckout}
                  >
                    Procéder au paiement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-8">
              Découvrez notre collection de parfums et commencez votre shopping
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleContinueShopping}
            >
              Continuer mes achats
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}