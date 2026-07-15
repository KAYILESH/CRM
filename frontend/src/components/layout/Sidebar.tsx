import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingCart, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap, HelpCircle,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils';

const NAV_ITEMS = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard',  shortcut: '⌘1' },
  { to: '/dashboard/customers', icon: Users,           label: 'Customers',  shortcut: '⌘2' },
  { to: '/dashboard/orders',    icon: ShoppingCart,    label: 'Orders',     shortcut: '⌘3' },
  { to: '/dashboard/settings',  icon: Settings,        label: 'Settings',   shortcut: '⌘,' },
];

const NAV_SECTIONS = [
  { label: 'WORKSPACE', items: NAV_ITEMS.slice(0, 3) },
  { label: 'ACCOUNT',   items: NAV_ITEMS.slice(3) },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { closeMobileSidebar, mobileSidebarOpen, toggleMobileSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'sidebar',
          collapsed && 'icon-only',
          mobileSidebarOpen && 'mobile-open'
        )}
        aria-label="Main navigation"
      >
        {/* ── Logo / Brand ── */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-5 border-b flex-shrink-0',
          collapsed && 'justify-center px-2'
        )}
          style={{ borderColor: 'var(--glass-border)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}
          >
            <Zap size={18} style={{ color: '#ffffff' }} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-display font-bold text-sm leading-tight gradient-text">NexusFlow</h1>
              <p className="text-[10px] tracking-[0.12em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                CRM Suite
              </p>
            </div>
          )}

          {/* Collapse button (desktop) */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex ml-auto p-1.5 rounded-lg transition-all',
              collapsed && 'mx-auto ml-0'
            )}
            style={{ color: 'var(--text-muted)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight size={14} />
              : <ChevronLeft size={14} />
            }
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-3 space-y-4" aria-label="Sidebar navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.1em]"
                  style={{ color: 'var(--text-muted)' }}>
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label, shortcut }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) => cn('nav-item group', isActive && 'active')}
                    title={collapsed ? `${label}  ${shortcut}` : undefined}
                    aria-label={label}
                  >
                    <span className="nav-icon">
                      <Icon size={16} />
                    </span>
                    {!collapsed && (
                      <span className="flex-1 min-w-0 truncate">{label}</span>
                    )}
                    {!collapsed && (
                      <span className="text-[10px] opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0 font-mono"
                        style={{ color: 'var(--text-muted)' }}>
                        {shortcut}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Help ── */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <a
              href="#"
              className="nav-item w-full text-left"
              aria-label="Help & documentation"
            >
              <span className="nav-icon">
                <HelpCircle size={15} />
              </span>
              <span className="text-sm">Help & Support</span>
            </a>
          </div>
        )}

        {/* ── User Profile Section ── */}
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3.5 border-t flex-shrink-0',
            collapsed && 'justify-center px-2'
          )}
          style={{ borderColor: 'var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}
        >
          <div className="relative flex-shrink-0">
            <Avatar
              src={user?.avatar}
              name={user?.name ?? 'User'}
              size="sm"
              showStatus
              status="active"
            />
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-sm font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                {user?.role}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              'p-1.5 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400 flex-shrink-0',
              collapsed && 'mx-auto'
            )}
            style={{ color: 'var(--text-muted)' }}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Mobile close button shown at top of sidebar */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[110] p-2 rounded-xl glass-card"
        onClick={toggleMobileSidebar}
        aria-label="Toggle navigation menu"
        id="mobile-menu-button"
      >
        <LayoutDashboard size={18} style={{ color: 'var(--accent-teal)' }} />
      </button>
    </>
  );
}
