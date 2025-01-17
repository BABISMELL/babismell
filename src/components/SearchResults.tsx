import { motion } from 'framer-motion';
import { PerfumeCard } from '@/components/PerfumeCard';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  totalResults: number;
}

export function SearchResults({ results, isLoading, totalResults }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </p>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {results.map((perfume) => (
          <motion.div
            key={perfume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PerfumeCard {...perfume} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}