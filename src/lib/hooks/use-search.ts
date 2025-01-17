import { useState, useEffect, useMemo } from 'react';
import { perfumes } from '@/data/perfumes';

interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  sortBy?: 'price' | 'name' | 'brand';
  sortOrder?: 'asc' | 'desc';
}

export function useSearch(searchTerm: string, filters: SearchFilters = {}) {
  const [results, setResults] = useState(perfumes);
  const [isLoading, setIsLoading] = useState(false);

  const filteredResults = useMemo(() => {
    setIsLoading(true);
    
    let filtered = [...perfumes];

    // Recherche textuelle
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        perfume =>
          perfume.name.toLowerCase().includes(searchLower) ||
          perfume.brand.toLowerCase().includes(searchLower) ||
          perfume.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtres
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.isNew !== undefined) {
      filtered = filtered.filter(p => p.isNew === filters.isNew);
    }

    if (filters.isOnSale !== undefined) {
      filtered = filtered.filter(p => p.isOnSale === filters.isOnSale);
    }

    // Tri
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];
        const order = filters.sortOrder === 'desc' ? -1 : 1;

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue as string) * order;
        }
        
        return ((aValue as number) - (bValue as number)) * order;
      });
    }

    setIsLoading(false);
    return filtered;
  }, [searchTerm, filters]);

  return {
    results: filteredResults,
    isLoading,
    totalResults: filteredResults.length
  };
}