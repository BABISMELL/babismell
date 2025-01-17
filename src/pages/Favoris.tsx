import { motion } from 'framer-motion';
import { PerfumeCard } from '@/components/PerfumeCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { perfumes } from '@/data/perfumes';

export default function Favoris() {
  // Simuler quelques parfums favoris
  const [favorites, setFavorites] = useState(perfumes.slice(0, 3));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(perfume => perfume.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mes Favoris</h1>
          <p className="text-lg text-muted-foreground">
            Retrouvez tous vos parfums préférés au même endroit
          </p>
        </motion.div>

        {favorites.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {favorites.map((perfume) => (
              <motion.div key={perfume.id} variants={item} className="relative group">
                <div className="absolute top-2 right-2 z-20">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFavorite(perfume.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <PerfumeCard {...perfume} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Aucun favori pour le moment</h2>
            <p className="text-muted-foreground mb-8">
              Explorez notre collection et ajoutez vos parfums préférés à vos favoris
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Découvrir nos parfums
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}