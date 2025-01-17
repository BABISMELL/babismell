// Définition des routes de l'application
export const ROUTES = {
  HOME: '/',
  PARFUMS: '/parfums',
  NOUVEAUTES: '/nouveautes',
  PROMOTIONS: '/promotions',
  FAVORIS: '/favoris',
  COMMANDE: '/commande',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  ORDER_TRACKING: (orderId: string) => `/order-tracking/${orderId}`,
} as const;