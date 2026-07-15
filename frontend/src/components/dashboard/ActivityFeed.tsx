import { ShoppingCart, UserPlus, CreditCard, Headphones, ArrowUpCircle, RefreshCcw } from 'lucide-react';
import type { ActivityItem, Order, Customer } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatCurrency } from '@/utils';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders, fetchCustomers } from '@/api';

const TYPE_CFG: Record<ActivityItem['type'], { icon: React.ElementType; color: string; bg: string }> = {
  new_order:    { icon: ShoppingCart,   color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)' },
  new_customer: { icon: UserPlus,       color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  payment:      { icon: CreditCard,     color: '#B45309', bg: 'rgba(245,158,11,0.12)' },
  support:      { icon: Headphones,     color: '#0E7490', bg: 'rgba(6,182,212,0.12)'  },
  upgrade:      { icon: ArrowUpCircle,  color: '#BE185D', bg: 'rgba(236,72,153,0.12)' },
  refund:       { icon: RefreshCcw,     color: '#DC2626', bg: 'rgba(239,68,68,0.12)'  },
};

function Row({ item }: { item: ActivityItem }) {
  const cfg = TYPE_CFG[item.type];
  const Icon = cfg.icon;
  return (
    <div className="flex items-start gap-3 py-3 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
      style={{ borderBottom: '1px solid var(--border)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.05)')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}>
      <div className="relative flex-shrink-0">
        <Avatar src={item.avatar} name={item.title} size="sm" />
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
          <Icon size={9} style={{ color: cfg.color }} />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{item.title}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-2)' }}>{item.description}</p>
        <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-3)' }}>{formatDate(item.time, 'relative')}</p>
      </div>
      {item.amount != null && (
        <span className="text-sm font-bold flex-shrink-0" style={{ color: item.type === 'refund' ? '#DC2626' : '#0369A1' }}>
          {item.type === 'refund' ? '-' : '+'}{formatCurrency(item.amount)}
        </span>
      )}
    </div>
  );
}

export function ActivityFeed() {
  const { data: orders } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: fetchOrders });
  const { data: customers } = useQuery<Customer[]>({ queryKey: ['customers'], queryFn: fetchCustomers });

  const activities = useMemo<ActivityItem[]>(() => {
    const list: ActivityItem[] = [];

    // Map orders to activities
    orders?.forEach((o) => {
      list.push({
        id: `order-${o.id}`,
        type: 'new_order',
        title: `New Order #ORD-${String(o.id).padStart(4, '0')}`,
        description: `${o.customerName} placed an order for ${o.items[0]?.title ?? 'products'}`,
        time: o.date,
        avatar: o.customerAvatar,
        amount: o.discountedTotal,
      });
    });

    // Map customers to activities
    customers?.forEach((c) => {
      list.push({
        id: `customer-${c.id}`,
        type: 'new_customer',
        title: 'New Customer Onboarded',
        description: `${c.firstName} ${c.lastName} joined representing ${c.company?.name || 'Independent'}`,
        time: c.joinDate,
        avatar: c.image,
      });
    });

    // Sort by time descending
    return list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 7);
  }, [orders, customers]);

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs opacity-40">
        No recent activities recorded.
      </div>
    );
  }

  return (
    <div>
      {activities.map((item: ActivityItem) => <Row key={item.id} item={item} />)}
    </div>
  );
}
