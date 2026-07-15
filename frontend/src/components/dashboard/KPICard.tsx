import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { KPIStat } from '@/types';
import { Sparkline } from '@/components/charts/Sparkline';
import { formatCurrency, formatNumber, formatPercent, calcTrend, cn } from '@/utils';

const COLOR_CFG = {
  teal:   { icon: 'rgba(14,165,233,0.12)',  text: '#0EA5E9', spark: '#0EA5E9' },
  violet: { icon: 'rgba(139,92,246,0.12)',  text: '#8B5CF6', spark: '#8B5CF6' },
  cyan:   { icon: 'rgba(6,182,212,0.12)',   text: '#0E7490', spark: '#06B6D4' },
  gold:   { icon: 'rgba(245,158,11,0.12)',  text: '#B45309', spark: '#F59E0B' },
  pink:   { icon: 'rgba(236,72,153,0.12)',  text: '#BE185D', spark: '#EC4899' },
};

function fmtVal(s: KPIStat) {
  if (s.format === 'currency') return formatCurrency(s.value);
  if (s.format === 'percent') return formatPercent(s.value);
  return formatNumber(s.value);
}

export function KPICard({ stat, index }: { stat: KPIStat; index: number }) {
  const c = COLOR_CFG[stat.color];
  const trend = calcTrend(stat.value, stat.previousValue);
  const isUp = stat.trend === 'up';
  const trendGood = stat.id === 'churn' ? !isUp : isUp;
  const IconComp = (Icons as any)[stat.icon] ?? Icons.BarChart2;

  return (
    <div className={cn('kpi-card', stat.color, 'animate-slide-up')} style={{ animationDelay: `${index * 70}ms` }}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{stat.label}</p>
          <p className="font-display font-black text-2xl leading-none" style={{ color: 'var(--text-1)' }}>{fmtVal(stat)}</p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.icon }}>
          <IconComp size={20} style={{ color: c.text }} />
        </div>
      </div>

      {/* Trend row */}
      <div className="flex items-center gap-1.5 mb-3">
        {stat.trend === 'neutral' ? <Minus size={13} style={{ color: 'var(--text-muted)' }} />
          : isUp ? <TrendingUp size={13} style={{ color: trendGood ? '#0EA5E9' : '#EF4444' }} />
          : <TrendingDown size={13} style={{ color: trendGood ? '#0EA5E9' : '#EF4444' }} />}
        <span className="text-xs font-bold" style={{ color: stat.trend === 'neutral' ? 'var(--text-muted)' : trendGood ? '#0369A1' : '#DC2626' }}>
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs last month</span>
      </div>

      {/* Sparkline */}
      <div className="h-11 -mx-1">
        <Sparkline data={stat.sparkline} color={c.spark} height={44} />
      </div>
    </div>
  );
}
