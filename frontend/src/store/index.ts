import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

const MOCK_USER: User = {
  id: '1', name: 'Alexandra Chen', email: 'admin@nexusflow.io',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra&backgroundColor=00D4AA',
  role: 'Super Admin', company: 'NexusFlow Inc.',
};

// ─── Auth ─────────────────────────────────────────
interface AuthState {
  user: User | null; isAuthenticated: boolean; rememberMe: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void; updateUser: (d: Partial<User>) => void;
}
export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user: null, isAuthenticated: false, rememberMe: false,
    login: async (email, password, remember) => {
      await new Promise(r => setTimeout(r, 1100));
      if (email.toLowerCase() === 'admin@nexusflow.io' && password === 'password123') {
        set({ user: MOCK_USER, isAuthenticated: true, rememberMe: remember });
        return true;
      }
      return false;
    },
    logout: () => set({ user: null, isAuthenticated: false }),
    updateUser: (d) => set(s => ({ user: s.user ? { ...s.user, ...d } : null })),
  }), {
    name: 'nexusflow-auth',
    partialize: s => ({ user: s.rememberMe ? s.user : null, isAuthenticated: s.rememberMe ? s.isAuthenticated : false, rememberMe: s.rememberMe }),
  })
);

// ─── Theme ────────────────────────────────────────
// Default = light (sky-blue liquid glass). .dark class = dark override.
function applyTheme(t: 'dark' | 'light') {
  const r = document.documentElement;
  t === 'dark' ? r.classList.add('dark') : r.classList.remove('dark');
}
interface ThemeState {
  theme: 'dark' | 'light'; toggleTheme: () => void; setTheme: (t: 'dark' | 'light') => void;
}
export const useThemeStore = create<ThemeState>()(
  persist((set) => ({
    theme: 'light',
    toggleTheme: () => set(s => { const n = s.theme === 'dark' ? 'light' : 'dark'; applyTheme(n); return { theme: n }; }),
    setTheme: (t) => { applyTheme(t); set({ theme: t }); },
  }), { name: 'nexusflow-theme' })
);

// ─── UI ───────────────────────────────────────────
export interface Toast {
  id: string; type: 'success' | 'error' | 'info' | 'warning';
  title: string; message?: string; duration?: number;
}
interface UIState {
  sidebarOpen: boolean; mobileSidebarOpen: boolean; toasts: Toast[];
  toggleSidebar: () => void; toggleMobileSidebar: () => void; closeMobileSidebar: () => void;
  addToast: (t: Omit<Toast, 'id'>) => void; removeToast: (id: string) => void;
}
export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true, mobileSidebarOpen: false, toasts: [],
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMobileSidebar: () => set(s => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  addToast: (t) => {
    const id = Math.random().toString(36).slice(2);
    set(s => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(x => x.id !== id) })), t.duration ?? 4000);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(x => x.id !== id) })),
}));

// ─── Notifications ────────────────────────────────
interface NotifPrefs {
  emailNewCustomer: boolean; emailNewOrder: boolean; emailWeeklyReport: boolean;
  pushNewOrder: boolean; pushPayment: boolean; smsAlerts: boolean;
  setNotifPref: (k: keyof Omit<NotifPrefs, 'setNotifPref'>, v: boolean) => void;
}
export const useNotifStore = create<NotifPrefs>()(
  persist((set) => ({
    emailNewCustomer: true, emailNewOrder: true, emailWeeklyReport: false,
    pushNewOrder: true, pushPayment: false, smsAlerts: false,
    setNotifPref: (k, v) => set({ [k]: v }),
  }), { name: 'nexusflow-notifs' })
);
