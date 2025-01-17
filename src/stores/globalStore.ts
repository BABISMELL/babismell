import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { socketManager } from '@/lib/socket';

// Types pour les données globales (partagées entre tous les utilisateurs)
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  image: string;
  isNew: boolean;
  isOnSale: boolean;
  discount: number;
  stock: number;
  isFeatured: boolean;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface Countdown {
  isEnabled: boolean;
  endDate: string;
  title: string;
  description: string;
}

interface Order {
  id: string;
  items: { productId: string; quantity: number }[];
  status: string;
  createdAt: string;
}

interface GlobalStoreState {
  countdown: Countdown;
  products: Product[];
  brands: Brand[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  updateCountdown: (settings: Partial<Countdown>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, productUpdate: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, brandUpdate: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  updateOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  initializeSocket: () => void;
}

interface UserStoreState {
  cart: { productId: string; quantity: number }[];
  orders: Order[];
  currentOrder: Order | null;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

// Store pour les données globales
export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    (set, get) => ({
      countdown: {
        isEnabled: false,
        endDate: '',
        title: '',
        description: ''
      },
      products: [],
      brands: [],
      orders: [],
      isLoading: false,
      error: null,

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      updateOrders: (orders) => {
        set({ orders });
        // Sauvegarder dans le localStorage pour la persistance
        localStorage.setItem('orders', JSON.stringify(orders));
      },

      initializeSocket: () => {
        const socket = socketManager;

        socket.on('newOrder', (order: Order) => {
          const currentOrders = get().orders;
          const newOrders = [order, ...currentOrders];
          set({ orders: newOrders });
          localStorage.setItem('orders', JSON.stringify(newOrders));
        });

        socket.on('orderStatusUpdated', ({ orderId, status }) => {
          const currentOrders = get().orders;
          const newOrders = currentOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
          );
          set({ orders: newOrders });
          localStorage.setItem('orders', JSON.stringify(newOrders));
        });

        // Écouter les mises à jour du compte à rebours
        socket.on('countdownUpdated', (countdown: Countdown) => {
          set({ countdown });
        });

        // Gérer la déconnexion
        socket.on('disconnect', () => {
          set({ error: 'La connexion au serveur a été perdue' });
        });

        // Gérer la reconnexion
        socket.on('connect', () => {
          set({ error: null });
        });

        socket.connect();
      },

      updateCountdown: (settings) => {
        set((state) => ({
          countdown: { ...state.countdown, ...settings }
        }));
        socketManager.emit('countdownUpdate', get().countdown);
      },

      addProduct: (product) => {
        const newProduct = { ...product, id: crypto.randomUUID() };
        set((state) => ({
          products: [...state.products, newProduct]
        }));
        socketManager.emit('productsUpdate', get().products);
      },

      updateProduct: (id, productUpdate) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === id ? { ...product, ...productUpdate } : product
          )
        }));
        socketManager.emit('productsUpdate', get().products);
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
        socketManager.emit('productsUpdate', get().products);
      },

      addBrand: (brand) => {
        const newBrand = { ...brand, id: crypto.randomUUID() };
        set((state) => ({
          brands: [...state.brands, newBrand]
        }));
        socketManager.emit('brandsUpdate', get().brands);
      },

      updateBrand: (id, brandUpdate) => {
        set((state) => ({
          brands: state.brands.map(brand => 
            brand.id === id ? { ...brand, ...brandUpdate } : brand
          )
        }));
        socketManager.emit('brandsUpdate', get().brands);
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter(brand => brand.id !== id)
        }));
        socketManager.emit('brandsUpdate', get().brands);
      }
    }),
    {
      name: 'babismell-global-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        countdown: state.countdown,
        products: state.products,
        brands: state.brands,
        orders: state.orders
      })
    }
  )
);

// Store pour les données utilisateur
export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      currentOrder: null,

      addToCart: (productId, quantity) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.productId === productId);
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            cart: [...state.cart, { productId, quantity }]
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.productId !== productId)
        }));
      },

      updateCartQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
          currentOrder: order
        }));
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status }
              : order
          )
        }));
      }
    }),
    {
      name: 'babismell-user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);