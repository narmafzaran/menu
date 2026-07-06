export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type SubscriptionType = 'active' | 'inactive' | 'trial';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  phone: string;
  address: string;
  workingHours: string;
  instagram?: string;
  telegram?: string;
  primaryColor: string;
  bgColor: string;
  accentColor: string;
  deliveryRange: number; // in km
  deliveryFee: number; // in Tomans
  subscriptionStatus: SubscriptionType;
  tablesCount: number;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  price: number; // in Tomans
  description: string;
  image: string;
  isActive: boolean;
}

export interface OrderItem {
  id: string; // menu item ID
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  totalPrice: number;
  orderType: OrderType;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryCoordinates?: { lat: number; lng: number };
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface DailyStats {
  date: string;
  sales: number;
  ordersCount: number;
}
