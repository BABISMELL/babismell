export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: 'Pour Elle' | 'Pour Lui' | 'Unisexe';
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  stock?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
  deliveryFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  perfumeId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zone: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CLIENT';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}