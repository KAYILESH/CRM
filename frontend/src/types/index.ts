export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  address: { city: string; state: string; country: string };
  company?: { name: string };
  status: 'active' | 'inactive' | 'pending';
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number; title: string; price: number; quantity: number; total: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  discountedTotal: number;
}

export interface KPIStat {
  id: string; label: string; value: number; previousValue: number;
  prefix?: string; suffix?: string;
  format: 'currency' | 'number' | 'percent';
  trend: 'up' | 'down' | 'neutral';
  color: 'teal' | 'violet' | 'gold' | 'cyan' | 'pink';
  icon: string;
  sparkline: number[];
}

export interface ActivityItem {
  id: string;
  type: 'new_customer' | 'new_order' | 'payment' | 'support' | 'upgrade' | 'refund';
  title: string; description: string; time: string; avatar?: string; amount?: number;
}

export interface User {
  id: string; name: string; email: string; avatar: string; role: string; company: string;
}

export interface RevenueDataPoint {
  month: string; revenue: number; customers: number; orders: number;
}

export interface SegmentData { name: string; value: number; color: string; }
export interface FunnelData { stage: string; value: number; percentage: number; }

export type SortDirection = 'asc' | 'desc';
export interface SortConfig { key: string; direction: SortDirection; }
