import { useAdmin } from '@/contexts/AdminContext';
import { motion } from 'framer-motion';
import { PerfumeCard } from '@/components/PerfumeCard';
import { Button } from '@/components/ui/button';
import { Timer, Percent, Zap } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function Promotions() {
  const { products } = useAdmin();
  const discountedPerfumes = products.filter(perfume => perfume.isOnSale);
  const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-3 sm:px-4 py-6 sm:py-8 md:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-16">
          <div className="bg-purple-100 text-purple-600 px-3 sm:px-6 py-2 rounded-full inline-flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base font-semibold">Offres limitées</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            Promotions Exclusives
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            Profitez de réductions exceptionnelles sur une sélection de parfums de luxe
          </p>

          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4 sm:p-6 md:p-8 rounded-2xl max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Vente Flash</h2>
            </div>
            <CountdownTimer endDate={promoEndDate} />
          </div>
        </div>

        {discountedPerfumes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {discountedPerfumes.map((perfume) => (
              <motion.div
                key={perfume.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PerfumeCard {...perfume} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <Percent className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Aucune promotion en cours</h2>
            <p className="text-gray-600 mb-8">
              Revenez bientôt pour découvrir nos prochaines offres exceptionnelles
            </p>
            <Button onClick={() => window.history.back()}>
              Retourner aux parfums
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}