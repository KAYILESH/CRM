import { avatarColor, getInitials, cn } from '@/utils';

interface AvatarProps {
  src?: string; name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string; showStatus?: boolean; status?: 'active' | 'inactive' | 'pending';
}
const sizeMap = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
const statusColors = { active: 'bg-teal-500', inactive: 'bg-slate-500', pending: 'bg-yellow-500' };
const statusSizes = { xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-3.5 h-3.5' };

export function Avatar({ src, name, size = 'md', className, showStatus, status }: AvatarProps) {
  const color = avatarColor(name);
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizeMap[size])}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className={cn('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizeMap[size])}
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
          {getInitials(name)}
        </div>
      )}
      {showStatus && status && (
        <span className={cn('absolute bottom-0 right-0 rounded-full ring-2', 'ring-[var(--bg-surface)]', statusColors[status], statusSizes[size])} />
      )}
    </div>
  );
}
