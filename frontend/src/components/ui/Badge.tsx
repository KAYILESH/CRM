import type { OrderStatus } from '@/types';
import { cn } from '@/utils';

type BV = 'teal'|'violet'|'gold'|'red'|'cyan'|'pink'|'slate'|'green';
const vm: Record<BV,string> = {
  teal:'badge-teal', violet:'badge-violet', gold:'badge-gold', red:'badge-red',
  cyan:'badge-cyan', pink:'badge-pink', slate:'badge-slate', green:'badge-green',
};
const svm: Record<string, BV> = {
  active:'teal', inactive:'slate', pending:'gold', processing:'cyan', shipped:'violet', delivered:'green', cancelled:'red',
};
const dotMap: Record<string,string> = {
  active:'bg-sky-500', inactive:'bg-slate-400', pending:'bg-amber-500',
  processing:'bg-cyan-500', shipped:'bg-violet-500', delivered:'bg-emerald-500', cancelled:'bg-red-500',
};

interface BadgeProps { variant?: BV; status?: OrderStatus|'active'|'inactive'|'pending'; children?: React.ReactNode; className?: string; dot?: boolean; }
export function Badge({ variant, status, children, className, dot = true }: BadgeProps) {
  const rv = status ? svm[status] : (variant ?? 'teal');
  const label = children ?? (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');
  return (
    <span className={cn('badge', vm[rv as BV], className)}>
      {dot && status && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotMap[status])} />}
      {label}
    </span>
  );
}
