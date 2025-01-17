import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface FiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const brands = ['Dior', 'Chanel', 'Guerlain', 'Hermès', 'Yves Saint Laurent'];

export function PerfumeFilters({
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4">Prix</h3>
        <div className="space-y-4">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={200000}
            step={1000}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="py-4"
          />
          <div className="flex gap-4">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full"
              placeholder="Min"
            />
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full"
              placeholder="Max"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-lg font-semibold mb-4">Marques</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Button
              key={brand}
              variant={selectedBrands.includes(brand) ? 'default' : 'outline'}
              onClick={() => {
                if (selectedBrands.includes(brand)) {
                  setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                } else {
                  setSelectedBrands([...selectedBrands, brand]);
                }
              }}
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              {selectedBrands.includes(brand) && <Check className="h-4 w-4" />}
              {brand}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}