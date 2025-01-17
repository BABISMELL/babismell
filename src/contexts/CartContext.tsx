import { createContext, useContext, useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  brand: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { products } = useAdmin();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [items]);

  const addToCart = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const price = product.isOnSale && product.discount 
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentItems, {
        id,
        quantity: 1,
        price,
        name: product.name,
        brand: product.brand,
        image: product.image || ''
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return;

    setItems(currentItems => {
      if (quantity === 0) {
        return currentItems.filter(item => item.id !== id);
      }
      return currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const getItemQuantity = (id: string) => {
    return items.find(item => item.id === id)?.quantity || 0;
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getItemQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}