import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { HeroSlide } from '@/types';
import { getDefaultHeroSlides } from '@/lib/utils/hero';
import { useGlobalStore } from '@/stores/globalStore';

interface Admin {
  id: string;
  email: string;
  role: 'ADMIN';
}

interface AdminContextType {
  admin: Admin | null;
  isAdmin: boolean;
  isLoading: boolean;
  products: any[];
  heroSlides: HeroSlide[];
  brands: any[];
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const brands = useGlobalStore(state => state.brands);
  const products = useGlobalStore(state => state.products);
  const addProductToStore = useGlobalStore(state => state.addProduct);
  const updateProductInStore = useGlobalStore(state => state.updateProduct);
  const deleteProductFromStore = useGlobalStore(state => state.deleteProduct);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('hero_slides');
    return saved ? JSON.parse(saved) : getDefaultHeroSlides();
  });

  useEffect(() => {
    const currentAdmin = localStorage.getItem('admin');
    if (currentAdmin) {
      setAdmin(JSON.parse(currentAdmin));
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    try {
      if (email === 'admin@babismell.com' && password === 'admin123') {
        const adminData = {
          id: '1',
          email,
          role: 'ADMIN' as const
        };
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        navigate('/admin/dashboard');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration"
        });
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message
      });
      throw error;
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    navigate('/admin/login');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès"
    });
  };

  const updateHeroSlides = async (slides: HeroSlide[]) => {
    try {
      setHeroSlides(slides);
      localStorage.setItem('hero_slides', JSON.stringify(slides));
      toast({
        title: "Slides mises à jour",
        description: "Les slides ont été mises à jour avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les slides"
      });
      throw error;
    }
  };

  const addProduct = async (product: any) => {
    try {
      await addProductToStore(product);
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit"
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, product: any) => {
    try {
      await updateProductInStore(id, product);
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit"
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromStore(id);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit"
      });
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isAdmin: !!admin,
      isLoading,
      products,
      heroSlides,
      brands,
      loginAdmin,
      logoutAdmin,
      updateHeroSlides,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}