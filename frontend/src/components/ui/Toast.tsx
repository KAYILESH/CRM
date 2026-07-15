import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore, type Toast } from '@/store';
import { cn } from '@/utils';

const cfg: Record<Toast['type'], { icon: React.ElementType; border: string; bg: string; iconColor: string }> = {
  success: { icon: CheckCircle2, border: 'rgba(14,165,233,0.35)',  bg: 'rgba(255,255,255,0.85)', iconColor: '#0EA5E9' },
  error:   { icon: AlertCircle,  border: 'rgba(239,68,68,0.35)',   bg: 'rgba(255,255,255,0.85)', iconColor: '#DC2626' },
  warning: { icon: AlertTriangle,border: 'rgba(245,158,11,0.35)',  bg: 'rgba(255,255,255,0.85)', iconColor: '#B45309' },
  info:    { icon: Info,         border: 'rgba(14,165,233,0.35)',  bg: 'rgba(255,255,255,0.85)', iconColor: '#0369A1' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useUIStore(s => s.removeToast);
  const [show, setShow] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);
  const c = cfg[toast.type];
  const Icon = c.icon;
  return (
    <div className={cn(
      'glass-card flex items-start gap-3 p-4 min-w-[300px] max-w-[380px] transition-all duration-300',
      show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
    )} style={{ border: `1px solid ${c.border}`, background: c.bg, backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(100,160,220,0.18)' }}>
      <Icon size={18} style={{ color: c.iconColor }} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{toast.title}</p>
        {toast.message && <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{toast.message}</p>}
      </div>
      <button onClick={() => remove(toast.id)} className="btn-ghost !p-1 flex-shrink-0"><X size={13} /></button>
    </div>
  );
}
export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts);
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
