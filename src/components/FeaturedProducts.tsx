import { useState } from 'react';
import { PerfumeCard } from '@/components/PerfumeCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

interface FeaturedProductsProps {
  onDiscoverClick: () => void;
}

export function FeaturedProducts({ onDiscoverClick }: FeaturedProductsProps) {
  const { products = [] } = useAdmin();
  const featuredProducts = products?.filter(product => product.isFeatured) || [];

  if (featuredProducts.length === 0) {
    return (
      <section className="w-full py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Nos Best-Sellers</h2>
            <p className="text-muted-foreground">
              Aucun produit mis en avant pour le moment
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Nos Best-Sellers</h2>
          <Button 
            variant="ghost" 
            className="text-purple-600 hover:text-purple-700 -ml-2 sm:ml-0"
            onClick={onDiscoverClick}
          >
            Voir tout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id}>
              <PerfumeCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}