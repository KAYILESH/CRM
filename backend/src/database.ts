import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, 'db.json');

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
  productId: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
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

interface DatabaseSchema {
  customers: Customer[];
  orders: Order[];
}

function readDb(): DatabaseSchema {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    return { customers: [], orders: [] };
  }
}

function writeDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const getCustomers = (): Customer[] => readDb().customers;

export const getCustomerById = (id: number): Customer | undefined =>
  readDb().customers.find((c) => c.id === id);

export const addCustomer = (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate'>): Customer => {
  const data = readDb();
  const nextId = data.customers.reduce((max, c) => (c.id > max ? c.id : max), 0) + 1;
  const newCustomer: Customer = {
    ...customer,
    id: nextId,
    image: customer.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.firstName}_${nextId}`,
    totalOrders: 0,
    totalSpent: 0,
    joinDate: new Date().toISOString(),
  };
  data.customers.push(newCustomer);
  writeDb(data);
  return newCustomer;
};

export const updateCustomer = (id: number, patch: Partial<Customer>): Customer | undefined => {
  const data = readDb();
  const idx = data.customers.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  data.customers[idx] = { ...data.customers[idx], ...patch };
  writeDb(data);
  return data.customers[idx];
};

export const deleteCustomer = (id: number): boolean => {
  const data = readDb();
  const before = data.customers.length;
  data.customers = data.customers.filter((c) => c.id !== id);
  if (data.customers.length === before) return false;
  writeDb(data);
  return true;
};

export const getOrders = (): Order[] => readDb().orders;

export const getOrderById = (id: number): Order | undefined =>
  readDb().orders.find((o) => o.id === id);

export const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'customerName' | 'customerAvatar'>): Order => {
  const data = readDb();
  const nextId = data.orders.reduce((max, o) => (o.id > max ? o.id : max), 0) + 1;
  const customer = data.customers.find((c) => c.id === orderData.customerId);
  const customerName = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  const customerAvatar = customer?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=order_${nextId}`;
  const newOrder: Order = { ...orderData, id: nextId, customerName, customerAvatar, date: new Date().toISOString() };
  data.orders.push(newOrder);
  if (customer) {
    const cIdx = data.customers.findIndex((c) => c.id === customer.id);
    data.customers[cIdx].totalOrders += 1;
    data.customers[cIdx].totalSpent += newOrder.discountedTotal;
  }
  writeDb(data);
  return newOrder;
};

export const updateOrderStatus = (id: number, status: OrderStatus): Order | undefined => {
  const data = readDb();
  const idx = data.orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  data.orders[idx].status = status;
  writeDb(data);
  return data.orders[idx];
};

export const deleteOrder = (id: number): boolean => {
  const data = readDb();
  const before = data.orders.length;
  const orderToDelete = data.orders.find((o) => o.id === id);
  data.orders = data.orders.filter((o) => o.id !== id);
  if (data.orders.length === before) return false;
  if (orderToDelete) {
    const cIdx = data.customers.findIndex((c) => c.id === orderToDelete.customerId);
    if (cIdx !== -1) {
      data.customers[cIdx].totalOrders = Math.max(0, data.customers[cIdx].totalOrders - 1);
      data.customers[cIdx].totalSpent = Math.max(0, data.customers[cIdx].totalSpent - orderToDelete.discountedTotal);
    }
  }
  writeDb(data);
  return true;
};
