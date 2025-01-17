import { Container } from '@/components/Container';
import { PageHeader } from '@/components/PageHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { PerfumeCard } from '@/components/PerfumeCard';
import { PerfumeFilters } from '@/components/PerfumeFilters';
import { useAdmin } from '@/contexts/AdminContext';
import { useState, useMemo } from 'react';

export default function Parfums() {
  const { products } = useAdmin();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('tous');

  const filteredPerfumes = useMemo(() => {
    return products.filter((perfume) => {
      const matchesPrice = perfume.price >= priceRange[0] && perfume.price <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(perfume.brand);
      const matchesCategory = activeCategory === 'tous' || perfume.category.toLowerCase() === activeCategory;
      
      return matchesPrice && matchesBrand && matchesCategory;
    });
  }, [products, priceRange, selectedBrands, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <Container>
        <PageHeader
          title="Notre Collection de Parfums"
          description="Découvrez notre sélection exclusive de fragrances"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <PerfumeFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
          </aside>
          
          <main className="lg:col-span-3">
            {filteredPerfumes.length > 0 ? (
              <ProductGrid>
                {filteredPerfumes.map((perfume) => (
                  <PerfumeCard key={perfume.id} {...perfume} />
                ))}
              </ProductGrid>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Aucun parfum trouvé</h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}