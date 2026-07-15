import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { segmentData } from '@/data/mockData';
const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.08) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>{`${(percent*100).toFixed(0)}%`}</text>;
};
const CustomTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(255,255,255,0.95)',
      borderRadius: '12px',
      padding: '10px 14px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 24px rgba(100,160,220,0.18)',
      fontSize: '13px',
    }}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span style={{ color: '#6B8BAE' }}>{d.name}:</span>
        <span className="font-bold" style={{ color: '#0A1628' }}>{d.value}%</span>
      </div>
    </div>
  );
};
export function CustomerDonutChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={segmentData} cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel} strokeWidth={0}>
          {segmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Pie>
        <Tooltip content={<CustomTip />} />
        <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
