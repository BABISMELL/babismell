import { Perfume } from '@/types';

export const perfumes: Perfume[] = [
  {
    id: '1',
    name: 'J\'adore',
    brand: 'Dior',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2069',
    category: 'Pour Elle',
    description: 'Une fragrance florale lumineuse aux notes de rose et de jasmin',
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'N°5',
    brand: 'Chanel',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070',
    category: 'Pour Elle',
    description: 'L\'essence même de la féminité dans un flacon iconique',
    isOnSale: true,
    discount: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];