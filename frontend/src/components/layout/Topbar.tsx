import { useRef, useState } from 'react';
import { Search, Bell, Sun, Moon, X } from 'lucide-react';
import { useAuthStore, useThemeStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addToast } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchVal('');
  };

  const handleBell = () => {
    addToast({ type: 'info', title: 'No new notifications', message: 'You\'re all caught up!' });
  };

  return (
    <header className="topbar" role="banner">
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h2
          className="font-display font-bold text-base leading-tight truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Search bar */}
      <div
        className={cn(
          'relative transition-all duration-300',
          searchOpen ? 'w-72' : 'w-36'
        )}
      >
        {searchOpen ? (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              ref={searchRef}
              type="search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search anything…"
              className="input pl-9 pr-9 py-2 text-sm"
              style={{ borderRadius: '10px' }}
              onKeyDown={(e) => e.key === 'Escape' && handleSearchClose()}
              aria-label="Global search"
              id="global-search"
            />
            <button
              onClick={handleSearchClose}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close search"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSearchOpen}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-[10px] text-sm transition-all"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset',
            }}
            aria-label="Open search"
            id="topbar-search-button"
          >
            <Search size={13} />
            <span className="text-xs">Search…</span>
            <span className="ml-auto text-[10px] font-mono opacity-50">⌘K</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <button
          onClick={handleBell}
          className="relative p-2 rounded-xl transition-all btn-ghost"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Notifications"
          id="notifications-btn"
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--accent-teal)' }}
            aria-hidden="true"
          />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-all btn-ghost"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {theme === 'dark'
            ? <Sun size={17} />
            : <Moon size={17} />
          }
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--glass-border)' }} aria-hidden="true" />

        {/* User avatar */}
        <button
          className="flex items-center gap-2 p-1 pr-2.5 rounded-xl transition-all btn-ghost group"
          aria-label="User menu"
          id="user-menu-btn"
        >
          <Avatar src={user?.avatar} name={user?.name ?? 'User'} size="xs" />
          <span
            className="text-xs font-medium hidden sm:block truncate max-w-[90px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {user?.name?.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
