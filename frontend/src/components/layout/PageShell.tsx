import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, ShoppingCart, Settings,
  Zap, LogOut, Bell, Sun, Moon, Menu, X, Search, HelpCircle,
  Sparkles, ClipboardList, Clock, ArrowRight, UserPlus, CreditCard
} from 'lucide-react';
import { useAuthStore, useThemeStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui/Avatar';
import { fetchCustomers, fetchOrders } from '@/api';
import { cn, formatCurrency } from '@/utils';

const NAV_ITEMS = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/dashboard/customers', icon: Users,           label: 'Customers',  end: false },
  { to: '/dashboard/orders',    icon: ShoppingCart,    label: 'Orders',     end: false },
  { to: '/dashboard/settings',  icon: Settings,        label: 'Settings',   end: false },
];

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'order' | 'customer' | 'system';
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexusflow-search-history');
      return stored ? JSON.parse(stored) : ['Sarah Mitchell', 'Enterprise', 'Refund'];
    } catch {
      return ['Sarah Mitchell', 'Enterprise', 'Refund'];
    }
  });

  // Notifications states
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New Order placed', desc: 'Sarah Mitchell registered an order for $4,800', time: '2 min ago', unread: true, type: 'order' },
    { id: '2', title: 'New customer onboarded', desc: 'Acme Solutions joined NexusFlow', time: '12 min ago', unread: true, type: 'customer' },
    { id: '3', title: 'System Updated', desc: 'CRM updated to version 2.0 successfully', time: '1 hour ago', unread: false, type: 'system' }
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Fetch data for global search indexing
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers, staleTime: 30000 });
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders, staleTime: 30000 });

  // Handle outside click to close notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save search history
  const saveSearchHistory = (history: string[]) => {
    setRecentSearches(history);
    try {
      localStorage.setItem('nexusflow-search-history', JSON.stringify(history));
    } catch { /* ignore */ }
  };

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    const trimmed = query.trim();
    // Add to history, keep max 6, place at front
    const updated = [trimmed, ...recentSearches.filter(x => x.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    saveSearchHistory(updated);
  };

  const clearSearchHistory = () => {
    saveSearchHistory([]);
  };

  const removeSearchHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(x => x !== item);
    saveSearchHistory(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    addToast({ type: 'success', title: 'Notifications cleared', message: 'All alerts marked as read' });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Filtered search results
  const searchResults = (() => {
    if (!searchQuery.trim()) return { pages: NAV_ITEMS, customers: [], orders: [] };
    const q = searchQuery.toLowerCase();

    const matchedPages = NAV_ITEMS.filter(item => item.label.toLowerCase().includes(q));
    
    const matchedCustomers = (customers || []).filter(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company?.name ?? '').toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedOrders = (orders || []).filter(o => 
      String(o.id).includes(q) ||
      o.customerName.toLowerCase().includes(q)
    ).slice(0, 4);

    return { pages: matchedPages, customers: matchedCustomers, orders: matchedOrders };
  })();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-desktop)' }}>
      {/* ── Liquid Glass Background Orbs ── */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb w-[700px] h-[700px] -top-56 -left-56"
          style={{ background: 'radial-gradient(circle, rgba(186,230,255,0.9), transparent)', animationDelay: '0s' }} />
        <div className="aurora-orb w-[600px] h-[600px] bottom-[-15%] right-[-8%]"
          style={{ background: 'radial-gradient(circle, rgba(196,225,255,0.7), transparent)', animationDelay: '-4s' }} />
        <div className="aurora-orb w-[400px] h-[400px] top-1/2 right-1/4"
          style={{ background: 'radial-gradient(circle, rgba(220,240,255,0.65), transparent)', animationDelay: '-8s' }} />
      </div>

      {/* ═══════════════════════════════════════════════
          TOP NAVIGATION BAR
          ═══════════════════════════════════════════════ */}
      <header
        className="relative z-40 sticky top-0"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'saturate(220%) blur(28px)',
          WebkitBackdropFilter: 'saturate(220%) blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 4px 24px rgba(100,160,220,0.12), inset 0 -1px 0 rgba(180,215,245,0.3)',
        }}
      >
        {/* Top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, transparent 95%)',
          pointerEvents: 'none',
        }} />

        <div className="flex items-center gap-4 px-4 lg:px-6" style={{ height: '62px' }}>

          {/* ── Brand Logo ── */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center animate-pulse-glow flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', boxShadow: '0 4px 12px rgba(14,165,233,0.35)' }}
            >
              <Zap size={16} style={{ color: '#fff' }} />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-sm leading-tight gradient-text">NexusFlow</p>
              <p className="text-[9px] tracking-[0.14em] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>CRM Suite</p>
            </div>
          </NavLink>

          {/* ── Divider ── */}
          <div className="hidden lg:block w-px h-6 flex-shrink-0" style={{ background: 'rgba(14,165,233,0.2)' }} />

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-sky-700 font-semibold'
                    : 'hover:text-sky-600'
                )}
                style={({ isActive }) => isActive ? {
                  background: 'rgba(14,165,233,0.12)',
                  color: '#0369A1',
                  boxShadow: '0 2px 8px rgba(14,165,233,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                } : {
                  color: 'var(--text-secondary)',
                }}
                aria-label={label}
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 ml-auto relative">

            {/* Search Button (Triggers global search modal) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all hover:bg-sky-500/10 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(255,255,255,0.95)',
                color: 'var(--text-muted)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset',
              }}
              aria-label="Open Search"
              id="global-search-btn"
            >
              <Search size={12} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Search…</span>
              <span className="font-mono opacity-50 text-[10px] ml-1">⌘K</span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              ref={bellRef}
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                "relative p-2 rounded-xl transition-all cursor-pointer",
                notifOpen && "bg-sky-500/10"
              )}
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => !notifOpen && (e.currentTarget.style.background = 'rgba(14,165,233,0.08)')}
              onMouseLeave={e => !notifOpen && (e.currentTarget.style.background = '')}
              aria-label="Notifications"
              id="notifications-btn"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span 
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white leading-none animate-pulse-glow"
                  style={{ background: '#0EA5E9', boxShadow: '0 0 8px rgba(14,165,233,0.5)' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {notifOpen && (
              <div
                ref={notifRef}
                className="absolute right-0 top-12 w-80 sm:w-96 glass-card-elevated rounded-2xl z-50 p-4 animate-scale-in"
                style={{
                  border: '1px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 20px 48px rgba(80,140,210,0.2), 0 4px 16px rgba(100,160,230,0.1)',
                  background: 'rgba(255,255,255,0.95)'
                }}
              >
                <div className="flex items-center justify-between border-b pb-3 mb-3" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
                  <div>
                    <h4 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>System Notifications</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: '#0EA5E9' }}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-3 rounded-xl transition-colors cursor-pointer border",
                        n.unread ? "bg-sky-500/5 border-sky-500/10" : "bg-transparent border-transparent hover:bg-slate-50"
                      )}
                    >
                      <div className="flex gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                          background: n.type === 'order' ? 'rgba(14,165,233,0.12)' : n.type === 'customer' ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)',
                          color: n.type === 'order' ? '#0EA5E9' : n.type === 'customer' ? '#8B5CF6' : '#10B981'
                        }}>
                          {n.type === 'order' ? <ShoppingCart size={13} /> : n.type === 'customer' ? <UserPlus size={13} /> : <Zap size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-1 leading-normal">{n.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1"><Clock size={9} /> {n.time}</p>
                        </div>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-sky-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              id="theme-toggle"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 mx-0.5" style={{ background: 'rgba(14,165,233,0.2)' }} />

            {/* User menu */}
            <div className="flex items-center gap-2 pl-1">
              <Avatar src={user?.avatar} name={user?.name ?? 'User'} size="xs" />
              <div className="hidden md:block">
                <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl transition-all cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#DC2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2 rounded-xl transition-all ml-1 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
              aria-label="Toggle menu"
              id="mobile-menu-button"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Dropdown ── */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden px-4 pb-4 animate-slide-up"
            style={{ borderTop: '1px solid rgba(255,255,255,0.7)' }}
          >
            <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
              {/* Mobile Search input trigger */}
              <button
                onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left mb-1 w-full"
                style={{ background: 'rgba(14,165,233,0.05)', color: 'var(--text-secondary)' }}
              >
                <Search size={16} />
                <span>Search everything…</span>
              </button>

              {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive ? 'font-semibold' : ''
                  )}
                  style={({ isActive }) => isActive ? {
                    background: 'rgba(14,165,233,0.12)',
                    color: '#0369A1',
                    boxShadow: '0 2px 8px rgba(14,165,233,0.1)',
                  } : {
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
              <div className="border-t mt-2 pt-2" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ color: 'var(--text-muted)' }}>
                  <HelpCircle size={17} />Help & Support
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Page Header (title + subtitle bar) ── */}
      <div
        className="relative z-10 px-4 lg:px-8 py-4 flex items-center gap-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* ── Main Page Content ── */}
      <main
        className="relative z-10 px-4 lg:px-8 py-6 animate-fade-in"
        id="main-content"
        style={{ minHeight: 'calc(100vh - 130px)' }}
      >
        {children}
      </main>

      {/* ═══════════════════════════════════════════════
          GLOBAL GLASS SEARCH DIALOG (MODAL)
          ═══════════════════════════════════════════════ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop blur overlay */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md animate-fade-in"
            onClick={() => setSearchOpen(false)}
          />

          {/* Modal Panel */}
          <div
            className="relative w-full max-w-xl glass-card-elevated rounded-3xl animate-scale-in p-5"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255,255,255,1)',
              boxShadow: '0 24px 64px rgba(80,140,210,0.25), inset 0 1px 0 #fff'
            }}
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 pb-3.5 border-b" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
              <Search size={18} style={{ color: '#0EA5E9' }} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchQuery);
                  }
                }}
                placeholder="Search customers, orders, pages..."
                className="w-full bg-transparent border-0 outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Scrollable Results Area */}
            <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
              
              {/* 1. Related / Recent Searches Section */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Searches</p>
                    <button
                      onClick={clearSearchHistory}
                      className="text-[10px] font-semibold text-slate-400 hover:text-red-500"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item);
                          handleSearchSubmit(item);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors bg-sky-500/5 hover:bg-sky-500/10 text-sky-800 font-semibold cursor-pointer"
                      >
                        <span>{item}</span>
                        <X
                          size={10}
                          className="hover:text-red-500 rounded-full"
                          onClick={(e) => removeSearchHistoryItem(e, item)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Matched Pages results */}
              {searchResults.pages.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pages</p>
                  <div className="space-y-1">
                    {searchResults.pages.map(p => (
                      <button
                        key={p.to}
                        onClick={() => {
                          if (searchQuery) handleSearchSubmit(searchQuery);
                          setSearchOpen(false);
                          navigate(p.to);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-sky-500/5 cursor-pointer"
                      >
                        <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600"><p.icon size={13} /></span>
                        <span>{p.label}</span>
                        <ArrowRight size={10} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matched Customers results */}
              {searchResults.customers.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Customers</p>
                  <div className="space-y-1">
                    {searchResults.customers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (searchQuery) handleSearchSubmit(searchQuery);
                          setSearchOpen(false);
                          navigate(`/dashboard/customers`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs text-slate-700 hover:bg-sky-500/5 cursor-pointer"
                      >
                        <Avatar src={c.image} name={`${c.firstName} ${c.lastName}`} size="xs" />
                        <div>
                          <p className="font-semibold text-slate-800">{c.firstName} {c.lastName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{c.company?.name || 'Independent'} · {c.email}</p>
                        </div>
                        <ArrowRight size={10} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Matched Orders results */}
              {searchResults.orders.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Orders</p>
                  <div className="space-y-1">
                    {searchResults.orders.map(o => (
                      <button
                        key={o.id}
                        onClick={() => {
                          if (searchQuery) handleSearchSubmit(searchQuery);
                          setSearchOpen(false);
                          navigate(`/dashboard/orders`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs text-slate-700 hover:bg-sky-500/5 cursor-pointer"
                      >
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 font-mono text-[10px] font-bold">#{String(o.id).padStart(4, '0')}</span>
                        <div>
                          <p className="font-semibold text-slate-800">{o.customerName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatCurrency(o.discountedTotal)} · {o.status}</p>
                        </div>
                        <ArrowRight size={10} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {searchResults.pages.length === 0 && searchResults.customers.length === 0 && searchResults.orders.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try another search term</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
