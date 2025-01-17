import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CountdownProvider } from '@/contexts/CountdownContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminRoute } from '@/components/AdminRoute';
import { useSocketInit } from '@/hooks/useSocketInit';

// Eager load critical pages
import Home from '@/pages/Home';
import Parfums from '@/pages/Parfums';
import Commande from '@/pages/Commande';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderHistory from '@/pages/OrderHistory';

// Lazy load other pages
const Nouveautes = lazy(() => import('@/pages/Nouveautes'));
const Promotions = lazy(() => import('@/pages/Promotions'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Favoris = lazy(() => import('@/pages/Favoris'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const UpdatePassword = lazy(() => import('@/pages/UpdatePassword'));

// Admin Pages
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminCategories = lazy(() => import('@/pages/admin/Categories'));
const AdminPromotions = lazy(() => import('@/pages/admin/Promotions'));
const AdminBrands = lazy(() => import('@/pages/admin/Brands'));
const CountdownSettings = lazy(() => import('@/pages/admin/CountdownSettings'));
const HeroSettings = lazy(() => import('@/pages/admin/HeroSettings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
      suspense: true
    },
  },
});

export default function App() {
  // Initialize socket connection
  useSocketInit();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <AdminProvider>
            <CountdownProvider>
              <CartProvider>
                <FavoritesProvider>
                  <OrderProvider>
                    <Suspense fallback={null}>
                      <Routes>
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                          <Route index element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="categories" element={<AdminCategories />} />
                          <Route path="promotions" element={<AdminPromotions />} />
                          <Route path="brands" element={<AdminBrands />} />
                          <Route path="countdown" element={<CountdownSettings />} />
                          <Route path="hero" element={<HeroSettings />} />
                        </Route>

                        {/* Client Routes */}
                        <Route element={<Layout />}>
                          <Route index element={<Home />} />
                          <Route path="parfums" element={<Parfums />} />
                          <Route path="nouveautes" element={<Nouveautes />} />
                          <Route path="promotions" element={<Promotions />} />
                          <Route path="favoris" element={<Favoris />} />
                          <Route path="commande" element={<Commande />} />
                          <Route path="checkout" element={<Checkout />} />
                          <Route path="order-confirmation" element={<OrderConfirmation />} />
                          <Route path="order-tracking/:orderId" element={<OrderTracking />} />
                          <Route path="order-history" element={<OrderHistory />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="login" element={<Login />} />
                          <Route path="register" element={<Register />} />
                          <Route path="reset-password" element={<ResetPassword />} />
                          <Route path="update-password" element={<UpdatePassword />} />
                        </Route>
                      </Routes>
                    </Suspense>
                    <Toaster />
                  </OrderProvider>
                </FavoritesProvider>
              </CartProvider>
            </CountdownProvider>
          </AdminProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}