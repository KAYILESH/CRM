import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { revenueData } from '@/data/mockData';
import { formatCurrency } from '@/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(255,255,255,0.95)',
      borderRadius: '12px',
      padding: '12px 16px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(100,160,220,0.2)',
      fontSize: '13px',
    }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{e.name}:</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {e.name === 'Revenue' ? formatCurrency(e.value) : e.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gViolet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,215,245,0.4)" />
        <XAxis dataKey="month" tick={{ fill: '#6B8BAE', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="r" tick={{ fill: '#6B8BAE', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={52} />
        <YAxis yAxisId="o" orientation="right" tick={{ fill: '#6B8BAE', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#6B8BAE' }} />
        <Area yAxisId="r" type="monotone" dataKey="revenue" name="Revenue" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#gBlue)"   dot={false} activeDot={{ r: 5, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 2 }} />
        <Area yAxisId="o" type="monotone" dataKey="orders"  name="Orders"  stroke="#8B5CF6" strokeWidth={2}   fill="url(#gViolet)" dot={false} activeDot={{ r: 4, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
