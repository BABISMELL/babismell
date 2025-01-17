import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  isNew,
  isOnSale,
  discount
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const finalPrice = isOnSale && discount ? price * (1 - discount / 100) : price;
  const favorite = isFavorite(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full overflow-hidden">
        <div className="relative">
          {/* Badges */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            {isNew && (
              <Badge className="bg-purple-500">Nouveau</Badge>
            )}
            {isOnSale && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
          </div>

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => favorite ? removeFromFavorites(id) : addToFavorites(id)}
              >
                <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => addToCart(id)}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{brand}</p>
            <h3 className="text-base font-semibold mt-1 mb-2">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{finalPrice.toLocaleString()} FCFA</span>
              {isOnSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {price.toLocaleString()} FCFA
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}