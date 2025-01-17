import { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris au démarrage
  useEffect(() => {
    const deviceId = localStorage.getItem('deviceId') || 
      `device_${Math.random().toString(36).substring(2)}`;
    
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', deviceId);
    }

    const savedFavorites = localStorage.getItem(`favorites_${deviceId}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Sauvegarder les favoris à chaque modification
  useEffect(() => {
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      localStorage.setItem(`favorites_${deviceId}`, JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (id: string) => {
    setFavorites(current => [...new Set([...current, id])]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(current => current.filter(favId => favId !== id));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}