import { funnelData } from '@/data/mockData';
import { formatNumber } from '@/utils';
const COLORS = ['#0EA5E9','#06B6D4','#8B5CF6','#EC4899','#F59E0B'];
export function SalesFunnelChart() {
  return (
    <div className="space-y-3.5">
      {funnelData.map((s, i) => (
        <div key={s.stage}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>{s.stage}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{formatNumber(s.value)}</span>
              <span className="text-xs font-bold w-12 text-right" style={{ color: COLORS[i] }}>{s.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(14,165,233,0.12)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(s.percentage, 0.5)}%`, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}99)`, boxShadow: `0 0 6px ${COLORS[i]}40`, minWidth: '4px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
