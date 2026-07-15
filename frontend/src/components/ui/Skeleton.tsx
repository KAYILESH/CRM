import { cn } from '@/utils';

interface SkeletonProps { className?: string; width?: string|number; height?: string|number; rounded?: string; }
export function Skeleton({ className, width, height, rounded = 'rounded-lg' }: SkeletonProps) {
  return <div className={cn('skeleton', rounded, className)} style={{ width, height: height ?? 16 }} />;
}

export function SkeletonCard() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton width={48} height={48} rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={14} /><Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={40} /><Skeleton width="80%" height={12} />
    </div>
  );
}

export function SkeletonTableRow({ cols = 7 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton height={14} width={i === 0 ? 180 : i === 1 ? 140 : 90} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonKPICard() {
  return (
    <div className="kpi-card teal space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width={100} height={13} /><Skeleton width={40} height={40} rounded="rounded-xl" />
      </div>
      <Skeleton width={140} height={32} />
      <div className="flex items-center gap-2"><Skeleton width={60} height={12} /><Skeleton width={80} height={12} /></div>
      <Skeleton height={40} className="mt-2" />
    </div>
  );
}
