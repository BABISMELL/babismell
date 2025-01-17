import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FiltersState {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  sortBy?: 'price' | 'name' | 'brand';
  sortOrder?: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  onReset: () => void;
}

const CATEGORIES = ['Pour Elle', 'Pour Lui', 'Unisexe'];
const BRANDS = ['Dior', 'Chanel', 'Lancôme', 'Yves Saint Laurent'];
const SORT_OPTIONS = [
  { value: 'price', label: 'Prix' },
  { value: 'name', label: 'Nom' },
  { value: 'brand', label: 'Marque' }
];

export function AdvancedFilters({ filters, setFilters, onReset }: AdvancedFiltersProps) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Button variant="ghost" onClick={onReset}>
          Réinitialiser
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Catégorie</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Marque</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => setFilters(prev => ({ ...prev, brand: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les marques" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Prix</Label>
          <div className="pt-2 px-2">
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 200000]}
              min={0}
              max={200000}
              step={1000}
              onValueChange={([min, max]) => 
                setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
              }
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{filters.minPrice?.toLocaleString() || 0} FCFA</span>
            <span>{filters.maxPrice?.toLocaleString() || '200 000'} FCFA</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="new">Nouveautés</Label>
            <Switch
              id="new"
              checked={filters.isNew}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, isNew: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sale">En promotion</Label>
            <Switch
              id="sale"
              checked={filters.isOnSale}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, isOnSale: checked }))
              }
            />
          </div>
        </div>

        <div>
          <Label>Trier par</Label>
          <div className="flex gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  sortBy: value as 'price' | 'name' | 'brand' 
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortOrder}
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: value as 'asc' | 'desc' 
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordre..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Croissant</SelectItem>
                <SelectItem value="desc">Décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}