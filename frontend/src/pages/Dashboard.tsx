import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageShell } from '@/components/layout/PageShell';
import { KPICard } from '@/components/dashboard/KPICard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { CustomerDonutChart } from '@/components/charts/CustomerDonutChart';
import { SalesFunnelChart } from '@/components/charts/SalesFunnelChart';
import { useAuthStore } from '@/store';
import { ExternalLink, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomers, fetchOrders } from '@/api';
import type { KPIStat } from '@/types';

const SEGMENTS = [
  { label: 'Enterprise', val: '38%', color: '#0EA5E9' },
  { label: 'Mid-Market', val: '28%', color: '#8B5CF6' },
  { label: 'SMB',        val: '22%', color: '#F59E0B' },
  { label: 'Startup',    val: '12%', color: '#06B6D4' },
];

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  // Fetch real data
  const { data: customers, refetch: refetchCust, isFetching: isFetchingCust } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const { data: orders, refetch: refetchOrd, isFetching: isFetchingOrd } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const handleRefreshAll = () => {
    refetchCust();
    refetchOrd();
  };

  const dynamicKPIs = useMemo<KPIStat[]>(() => {
    // 1. Total Revenue calculation
    const revenueVal = orders?.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.discountedTotal : 0), 0) ?? 0;
    const prevRevenueVal = Math.round(revenueVal * 0.85);

    // 2. Active Customers calculation
    const activeCount = customers?.filter((c) => c.status === 'active').length ?? 0;
    const prevActiveCount = Math.round(activeCount * 0.9);

    // 3. New Customers calculation
    const newCount = customers?.length ?? 0;
    const prevNewCount = Math.round(newCount * 0.8);

    // 4. Conversion Rate Calculation
    const totalCustCount = customers?.length ?? 1;
    const totalOrderCount = orders?.length ?? 0;
    const conversion = totalCustCount > 0 ? (totalOrderCount / totalCustCount) * 10 : 0;
    const prevConversion = Math.max(1, conversion * 0.8);

    return [
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: revenueVal,
        previousValue: prevRevenueVal,
        prefix: '$',
        format: 'currency',
        trend: 'up',
        color: 'teal',
        icon: 'DollarSign',
        sparkline: [120, 150, 130, 180, 160, 210, 200, 240, 220, 260, 240, revenueVal || 10],
      },
      {
        id: 'customers',
        label: 'Active Customers',
        value: activeCount,
        previousValue: prevActiveCount,
        format: 'number',
        trend: 'up',
        color: 'violet',
        icon: 'Users',
        sparkline: [10, 15, 12, 18, 22, 25, 28, 32, 30, 36, 40, activeCount || 2],
      },
      {
        id: 'new_customers',
        label: 'New Customers',
        value: newCount,
        previousValue: prevNewCount,
        format: 'number',
        trend: 'up',
        color: 'cyan',
        icon: 'UserPlus',
        sparkline: [5, 8, 12, 10, 14, 18, 20, 22, 25, 28, 30, newCount || 3],
      },
      {
        id: 'conversion',
        label: 'Conversion Rate',
        value: Number(conversion.toFixed(2)),
        previousValue: Number(prevConversion.toFixed(2)),
        suffix: '%',
        format: 'percent',
        trend: 'up',
        color: 'gold',
        icon: 'TrendingUp',
        sparkline: [2.5, 3.2, 4.0, 3.8, 4.5, 5.0, 5.2, 5.8, 6.0, 6.2, 6.5, conversion || 1],
      },
      {
        id: 'churn',
        label: 'Churn Rate',
        value: 1.24,
        previousValue: 1.58,
        suffix: '%',
        format: 'percent',
        trend: 'down',
        color: 'pink',
        icon: 'UserMinus',
        sparkline: [2.8, 2.5, 2.4, 2.1, 2.0, 1.9, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2],
      },
    ];
  }, [orders, customers]);

  return (
    <>
      <Helmet>
        <title>Dashboard — NexusFlow CRM</title>
        <meta name="description" content="View your CRM dashboard with real-time revenue, customer, and order analytics." />
      </Helmet>

      <PageShell
        title="Dashboard"
        subtitle={`${greeting}, ${user?.name?.split(' ')[0]}! Here's today's overview.`}
      >
        {/* ── Welcome Banner ── */}
        <div
          className="glass-card p-5 mb-6 relative overflow-hidden"
          style={{ borderColor: 'rgba(14,165,233,0.2)' }}
        >
          {/* Glass shimmer accent */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 85% 50%, rgba(14,165,233,0.07), transparent 65%)',
          }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)',
          }} />

          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} style={{ color: 'var(--accent-teal)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-teal)' }}>
                  Live Dashboard
                </span>
              </div>
              <h2 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                {greeting}, {user?.name?.split(' ')[0]}! 🚀
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(now.toISOString(), 'long')} · Your CRM is performing <span className="font-semibold gradient-text">excellently</span> this month.
              </p>
            </div>
            <button className="btn-primary text-sm" id="view-report-btn" aria-label="View full analytics report">
              <ExternalLink size={14} /> View Full Report
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          {dynamicKPIs.map((stat, i) => (
            <KPICard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card-elevated p-5">
            <SectionHeader
              title="Revenue & Orders — 2025"
              action={
                <button
                  onClick={handleRefreshAll}
                  disabled={isFetchingCust || isFetchingOrd}
                  className="btn-secondary py-1.5 px-3 text-xs"
                  id="refresh-revenue-btn"
                  aria-label="Refresh revenue chart"
                >
                  <RefreshCw size={11} className={isFetchingCust || isFetchingOrd ? 'animate-spin' : ''} /> Refresh
                </button>
              }
            />
            <RevenueAreaChart />
          </div>

          {/* Customer Segments */}
          <div className="glass-card-elevated p-5">
            <SectionHeader title="Customer Segments" />
            <CustomerDonutChart />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {SEGMENTS.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="text-xs font-bold ml-auto" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sales Funnel */}
          <div className="glass-card-elevated p-5">
            <SectionHeader title="Sales Funnel" />
            <SalesFunnelChart />
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: 'var(--glass-border)' }}>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg. Deal Size</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>$2,284</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Win Rate</p>
                <p className="font-bold text-sm mt-0.5 gradient-text">68.4%</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 glass-card-elevated p-5">
            <SectionHeader title="Recent Activity" />
            <ActivityFeed />
          </div>
        </div>
      </PageShell>
    </>
  );
}
