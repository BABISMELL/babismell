import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CountdownBanner } from '@/components/CountdownBanner';

export function Layout() {
  const location = useLocation();
  const isCheckoutFlow = location.pathname.includes('/checkout') || 
                        location.pathname.includes('/order-confirmation') ||
                        location.pathname.includes('/order-tracking');

  return (
    <div className="flex min-h-screen flex-col">
      <CountdownBanner />
      <Header />
      <main className="flex-1 bg-gradient-to-b from-purple-50 to-white">
        <Outlet />
      </main>
      {!isCheckoutFlow && <Footer />}
    </div>
  );
}