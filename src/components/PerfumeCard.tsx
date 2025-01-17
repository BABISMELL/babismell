import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { motion } from 'framer-motion';

interface PerfumeCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

export function PerfumeCard({
  id,
  name,
  brand,
  price,
  image,
  isNew,
  isOnSale,
  discount
}: PerfumeCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const finalPrice = isOnSale && discount ? price * (1 - discount / 100) : price;
  const favorite = isFavorite(id);

  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          {isNew && (
            <Badge className="bg-purple-500 text-[10px] sm:text-xs">Nouveau</Badge>
          )}
          {isOnSale && (
            <Badge variant="destructive" className="text-[10px] sm:text-xs">-{discount}%</Badge>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => favorite ? removeFromFavorites(id) : addToFavorites(id)}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => addToCart(id)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground">{brand}</p>
          <h3 className="text-xs sm:text-sm font-semibold mt-0.5 mb-1 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold">{finalPrice.toLocaleString()} FCFA</span>
            {isOnSale && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {price.toLocaleString()} FCFA
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}