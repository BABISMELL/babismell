import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  // Gérer la fermeture automatique de la recherche
  useEffect(() => {
    if (isSearchOpen) {
      // Focus sur l'input quand la recherche s'ouvre
      searchInputRef.current?.focus();

      // Démarrer le timer de fermeture automatique
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearchOpen(false);
      }, 5000); // 5 secondes d'inactivité

      // Nettoyer le timer si l'utilisateur interagit avec l'input
      const handleInteraction = () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = setTimeout(() => {
            setIsSearchOpen(false);
          }, 5000);
        }
      };

      searchInputRef.current?.addEventListener('input', handleInteraction);
      searchInputRef.current?.addEventListener('focus', handleInteraction);

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        searchInputRef.current?.removeEventListener('input', handleInteraction);
        searchInputRef.current?.removeEventListener('focus', handleInteraction);
      };
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/parfums" 
                  className="text-lg font-medium"
                  onClick={handleNavigation}
                >
                  Parfums
                </Link>
                <Link 
                  to="/nouveautes" 
                  className="text-lg font-medium"
                  onClick={handleNavigation}
                >
                  Nouveautés
                </Link>
                <Link 
                  to="/promotions" 
                  className="text-lg font-medium"
                  onClick={handleNavigation}
                >
                  Promotions
                </Link>
                <Link 
                  to="/order-history" 
                  className="text-lg font-medium flex items-center gap-2"
                  onClick={handleNavigation}
                >
                  <Clock className="h-4 w-4" />
                  Mes commandes
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-purple-600">
            BABISMELL
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/parfums" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Parfums
            </Link>
            <Link to="/nouveautes" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Nouveautés
            </Link>
            <Link to="/promotions" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Promotions
            </Link>
            <Link to="/order-history" className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Mes commandes
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/favoris">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-[10px] font-medium text-white flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/commande">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-[10px] font-medium text-white flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Rechercher un parfum..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}