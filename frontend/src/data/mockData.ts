import type { KPIStat, ActivityItem, RevenueDataPoint, SegmentData, FunnelData } from '@/types';

export const kpiStats: KPIStat[] = [
  { id: 'revenue', label: 'Total Revenue', value: 2847392, previousValue: 2401250, prefix: '$', format: 'currency', trend: 'up', color: 'teal', icon: 'DollarSign', sparkline: [180,210,195,240,220,265,250,290,275,310,295,328] },
  { id: 'customers', label: 'Active Customers', value: 14826, previousValue: 12940, format: 'number', trend: 'up', color: 'violet', icon: 'Users', sparkline: [90,98,102,115,108,120,125,130,128,140,145,148] },
  { id: 'new_customers', label: 'New This Month', value: 1247, previousValue: 1089, format: 'number', trend: 'up', color: 'cyan', icon: 'UserPlus', sparkline: [60,72,68,85,78,92,88,95,102,110,118,124] },
  { id: 'conversion', label: 'Conversion Rate', value: 6.82, previousValue: 5.91, suffix: '%', format: 'percent', trend: 'up', color: 'gold', icon: 'TrendingUp', sparkline: [4.2,4.8,5.1,5.4,5.2,5.7,5.9,6.1,6.3,6.5,6.6,6.8] },
  { id: 'churn', label: 'Churn Rate', value: 1.24, previousValue: 1.58, suffix: '%', format: 'percent', trend: 'down', color: 'pink', icon: 'UserMinus', sparkline: [2.8,2.5,2.4,2.1,2.0,1.9,1.7,1.6,1.5,1.4,1.3,1.2] },
];

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 185000, customers: 310, orders: 842 },
  { month: 'Feb', revenue: 210000, customers: 340, orders: 921 },
  { month: 'Mar', revenue: 198000, customers: 325, orders: 876 },
  { month: 'Apr', revenue: 240000, customers: 402, orders: 1043 },
  { month: 'May', revenue: 228000, customers: 380, orders: 987 },
  { month: 'Jun', revenue: 275000, customers: 450, orders: 1182 },
  { month: 'Jul', revenue: 261000, customers: 427, orders: 1124 },
  { month: 'Aug', revenue: 295000, customers: 498, orders: 1287 },
  { month: 'Sep', revenue: 282000, customers: 470, orders: 1213 },
  { month: 'Oct', revenue: 318000, customers: 534, orders: 1372 },
  { month: 'Nov', revenue: 304000, customers: 512, orders: 1318 },
  { month: 'Dec', revenue: 351392, customers: 578, orders: 1496 },
];

export const segmentData: SegmentData[] = [
  { name: 'Enterprise', value: 38, color: '#0EA5E9' },
  { name: 'Mid-Market', value: 28, color: '#8B5CF6' },
  { name: 'SMB', value: 22, color: '#F59E0B' },
  { name: 'Startup', value: 12, color: '#06B6D4' },
];

export const funnelData: FunnelData[] = [
  { stage: 'Visitors', value: 124000, percentage: 100 },
  { stage: 'Leads', value: 28400, percentage: 22.9 },
  { stage: 'Qualified', value: 8920, percentage: 7.2 },
  { stage: 'Proposals', value: 3240, percentage: 2.6 },
  { stage: 'Closed', value: 1247, percentage: 1.0 },
];

export const activityFeed: ActivityItem[] = [
  { id: '1', type: 'new_order', title: 'New Order #ORD-7842', description: 'Sarah Mitchell placed an Enterprise plan order — $4,800/yr', time: new Date(Date.now()-4*60000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', amount: 4800 },
  { id: '2', type: 'new_customer', title: 'New Customer Onboarded', description: 'Vertex Solutions joined as an Enterprise customer', time: new Date(Date.now()-18*60000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vertex' },
  { id: '3', type: 'payment', title: 'Payment Received', description: 'TechNova Inc. auto-renewed annual subscription', time: new Date(Date.now()-45*60000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechNova', amount: 12000 },
  { id: '4', type: 'upgrade', title: 'Plan Upgrade', description: 'DataStream Co. upgraded from Pro to Enterprise', time: new Date(Date.now()-2*3600000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataStream', amount: 8400 },
  { id: '5', type: 'support', title: 'Support Ticket Resolved', description: 'Critical integration issue for CloudBase Ltd resolved', time: new Date(Date.now()-3*3600000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CloudBase' },
  { id: '6', type: 'refund', title: 'Refund Processed', description: 'Refund of $299 issued to Marcus Johnson', time: new Date(Date.now()-5*3600000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', amount: 299 },
  { id: '7', type: 'new_order', title: 'New Order #ORD-7841', description: 'PrimeEdge Corp purchased Starter plan — $99/mo', time: new Date(Date.now()-6*3600000).toISOString(), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PrimeEdge', amount: 99 },
];
