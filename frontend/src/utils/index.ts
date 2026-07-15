import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (v: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

export const formatNumber = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(1)}K` : v.toString();

export const formatPercent = (v: number, d = 1) => `${v.toFixed(d)}%`;

export const formatDate = (dateStr: string, style: 'short' | 'long' | 'relative' = 'short'): string => {
  const date = new Date(dateStr);
  if (style === 'relative') {
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
  }
  if (style === 'long') return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const calcTrend = (current: number, previous: number) =>
  previous === 0 ? 0 : ((current - previous) / previous) * 100;

export const truncate = (s: string, max: number) => s.length <= max ? s : s.slice(0, max) + '…';

export const avatarColor = (name: string): string => {
  const colors = ['#00D4AA','#7C3AED','#F59E0B','#06B6D4','#EC4899','#10B981','#F97316','#8B5CF6','#EF4444','#3B82F6'];
  return colors[name.charCodeAt(0) % colors.length];
};

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }) as any;
}
