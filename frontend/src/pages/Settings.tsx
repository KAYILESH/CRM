import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  User, Mail, Phone, Building2, Globe, Lock, Bell, Moon, Sun, Monitor,
  Camera, Save, CheckCircle2, X, Shield, Smartphone, MessageSquare,
  Key, Eye, EyeOff, Palette, ToggleLeft, ToggleRight, AlertTriangle,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore, useThemeStore, useNotifStore } from '@/store';
import { cn } from '@/utils';

// ── Section card wrapper ────────────────────────────────
function SettingsCard({
  title, subtitle, icon: Icon, children, accentColor = 'var(--accent-teal)',
}: {
  title: string; subtitle: string; icon: React.ElementType;
  children: React.ReactNode; accentColor?: string;
}) {
  return (
    <div className="glass-card-elevated rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
          <Icon size={16} style={{ color: accentColor }} />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Form field ──────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Toggle row ──────────────────────────────────────────
function ToggleRow({
  icon: Icon, label, description, checked, onChange, accentColor = 'var(--accent-teal)',
}: {
  icon: React.ElementType; label: string; description: string;
  checked: boolean; onChange: (v: boolean) => void; accentColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b last:border-0"
      style={{ borderColor: 'var(--glass-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}12` }}>
          <Icon size={14} style={{ color: accentColor }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-label={`${label} toggle`}
        className="flex-shrink-0 transition-all"
      >
        {checked
          ? <ToggleRight size={28} style={{ color: accentColor }} />
          : <ToggleLeft size={28} style={{ color: 'var(--text-muted)' }} />
        }
      </button>
    </div>
  );
}

// ── Password input ──────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input w-full pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ── Main Settings Page ──────────────────────────────────
export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const {
    emailNewCustomer, emailNewOrder, emailWeeklyReport,
    pushNewOrder, pushPayment, smsAlerts, setNotifPref,
  } = useNotifStore();

  // Profile form state
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState(user?.company ?? '');
  const [website, setWebsite] = useState('https://nexusflow.io');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    updateUser({ name, email, company });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (currentPw !== 'password123') {
      setPwError('Current password is incorrect.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match.');
      return;
    }
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2500);
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(newPw);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#0EA5E9', '#10B981'][strength];

  return (
    <>
      <Helmet>
        <title>Settings — NexusFlow CRM</title>
        <meta name="description" content="Manage your NexusFlow CRM account profile, preferences, notifications, and security settings." />
      </Helmet>

      <PageShell title="Settings" subtitle="Manage your account, preferences, and security">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Left Column: Profile + Security ── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Profile Card */}
            <SettingsCard
              title="Profile Information"
              subtitle="Update your personal details and public profile"
              icon={User}
            >
              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-6 pb-5 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <div className="relative group">
                  <Avatar src={user?.avatar} name={user?.name ?? 'User'} size="xl" showStatus status="active" />
                  <button
                    className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    aria-label="Change avatar"
                    id="avatar-upload-btn"
                  >
                    <Camera size={16} style={{ color: '#fff' }} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
                  <button
                    className="mt-2 text-xs font-semibold transition-colors"
                    style={{ color: 'var(--accent-teal)' }}
                    id="change-avatar-btn"
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *">
                    <div className="relative">
                      <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className="input w-full pl-9"
                        id="profile-name"
                      />
                    </div>
                  </Field>
                  <Field label="Email Address *">
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="input w-full pl-9"
                        id="profile-email"
                      />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone Number">
                    <div className="relative">
                      <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="input w-full pl-9"
                        id="profile-phone"
                      />
                    </div>
                  </Field>
                  <Field label="Company">
                    <div className="relative">
                      <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Company name"
                        className="input w-full pl-9"
                        id="profile-company"
                      />
                    </div>
                  </Field>
                </div>
                <Field label="Website">
                  <div className="relative">
                    <Globe size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="input w-full pl-9"
                      id="profile-website"
                    />
                  </div>
                </Field>

                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" className="btn-primary" id="save-profile-btn">
                    <Save size={14} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(user?.name ?? '');
                      setEmail(user?.email ?? '');
                      setPhone('');
                      setCompany(user?.company ?? '');
                      setWebsite('https://nexusflow.io');
                    }}
                    className="btn-secondary text-sm"
                    id="reset-profile-btn"
                  >
                    Reset Form
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold animate-fade-in" style={{ color: '#0EA5E9' }}>
                      <CheckCircle2 size={14} /> Saved successfully!
                    </span>
                  )}
                </div>
              </form>
            </SettingsCard>

            {/* Security Card */}
            <SettingsCard
              title="Security & Password"
              subtitle="Update your password to keep your account secure"
              icon={Shield}
              accentColor="#7C3AED"
            >
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Field label="Current Password">
                  <PasswordInput value={currentPw} onChange={setCurrentPw} placeholder="Enter current password" />
                </Field>
                <Field label="New Password">
                  <PasswordInput value={newPw} onChange={setNewPw} placeholder="Min. 8 characters" />
                  {newPw && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{
                            background: i <= strength ? strengthColor : 'var(--glass-border)'
                          }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
                    </div>
                  )}
                </Field>
                <Field label="Confirm New Password">
                  <PasswordInput value={confirmPw} onChange={setConfirmPw} placeholder="Re-enter new password" />
                  {confirmPw && newPw && confirmPw !== newPw && (
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#EF4444' }}>
                      <X size={11} /> Passwords do not match
                    </p>
                  )}
                </Field>

                {pwError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
                    <AlertTriangle size={14} /> {pwError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="btn-secondary" id="change-password-btn">
                    <Key size={14} /> Update Password
                  </button>
                  {pwSaved && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold animate-fade-in" style={{ color: '#0EA5E9' }}>
                      <CheckCircle2 size={14} /> Password updated!
                    </span>
                  )}
                </div>
              </form>

              {/* 2FA Section */}
              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.12)' }}>
                      <Smartphone size={14} style={{ color: '#7C3AED' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-xs py-1.5 px-3" id="enable-2fa-btn">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </SettingsCard>
          </div>

          {/* ── Right Column: Theme + Notifications ── */}
          <div className="space-y-5">

            {/* Appearance Card */}
            <SettingsCard
              title="Appearance"
              subtitle="Customize the look and feel of your workspace"
              icon={Palette}
              accentColor="#F59E0B"
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Color Theme</p>
              <div className="space-y-2">
                {[
                  { value: 'dark', label: 'Aurora Dark', desc: 'Deep space dark mode', icon: Moon },
                  { value: 'light', label: 'Aurora Light', desc: 'Clean bright mode', icon: Sun },
                ].map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => value === 'dark' ? (theme === 'light' && toggleTheme()) : (theme === 'dark' && toggleTheme())}
                    id={`theme-${value}-btn`}
                    className={cn(
                      'w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all',
                      theme === value
                        ? 'border'
                        : 'border hover:border-white/10'
                    )}
                    style={{
                      border: theme === value
                        ? '1px solid rgba(245,158,11,0.4)'
                        : '1px solid var(--glass-border)',
                      background: theme === value ? 'rgba(245,158,11,0.06)' : 'transparent',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: theme === value ? 'rgba(245,158,11,0.15)' : 'var(--bg-glass)' }}>
                      <Icon size={15} style={{ color: theme === value ? '#F59E0B' : 'var(--text-muted)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: theme === value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                    {theme === value && <CheckCircle2 size={14} style={{ color: '#F59E0B' }} />}
                  </button>
                ))}
              </div>

              {/* Accent Preview */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Accent Colors</p>
                <div className="flex gap-2">
                  {['#0EA5E9', '#7C3AED', '#F59E0B', '#06B6D4', '#F87171'].map((color, i) => (
                    <button
                      key={color}
                      id={`accent-color-${i}`}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 ring-offset-2 ring-offset-transparent"
                      style={{ background: color, boxShadow: i === 0 ? `0 0 0 2px ${color}60` : 'none' }}
                      aria-label={`Select accent color ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Mode */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <Monitor size={14} style={{ color: '#F59E0B' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Compact Mode</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reduce spacing for more content</p>
                    </div>
                  </div>
                  <ToggleLeft size={28} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </SettingsCard>

            {/* Notifications Card */}
            <SettingsCard
              title="Notifications"
              subtitle="Control how you receive alerts and updates"
              icon={Bell}
              accentColor="#06B6D4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Email Notifications</p>
              <ToggleRow
                icon={Mail}
                label="New Customer"
                description="When a new customer is onboarded"
                checked={emailNewCustomer}
                onChange={v => setNotifPref('emailNewCustomer', v)}
                accentColor="#06B6D4"
              />
              <ToggleRow
                icon={Bell}
                label="New Order"
                description="When an order is placed"
                checked={emailNewOrder}
                onChange={v => setNotifPref('emailNewOrder', v)}
                accentColor="#06B6D4"
              />
              <ToggleRow
                icon={MessageSquare}
                label="Weekly Report"
                description="Summary every Monday morning"
                checked={emailWeeklyReport}
                onChange={v => setNotifPref('emailWeeklyReport', v)}
                accentColor="#06B6D4"
              />

              <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-1" style={{ color: 'var(--text-muted)' }}>Push Notifications</p>
              <ToggleRow
                icon={Bell}
                label="New Order Alerts"
                description="Instant push for new orders"
                checked={pushNewOrder}
                onChange={v => setNotifPref('pushNewOrder', v)}
                accentColor="#0EA5E9"
              />
              <ToggleRow
                icon={Lock}
                label="Payment Events"
                description="Successful payments & refunds"
                checked={pushPayment}
                onChange={v => setNotifPref('pushPayment', v)}
                accentColor="#0EA5E9"
              />

              <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-1" style={{ color: 'var(--text-muted)' }}>SMS</p>
              <ToggleRow
                icon={Smartphone}
                label="SMS Alerts"
                description="Critical alerts via text message"
                checked={smsAlerts}
                onChange={v => setNotifPref('smsAlerts', v)}
                accentColor="#7C3AED"
              />
            </SettingsCard>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="mt-5 glass-card rounded-2xl p-5" style={{ borderColor: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm" style={{ color: '#F87171' }}>Danger Zone</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-ghost text-sm border" id="export-data-btn"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }}>
              Export My Data
            </button>
            <button className="btn-ghost text-sm border" id="delete-account-btn"
              style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }}>
              Delete Account
            </button>
          </div>
        </div>
      </PageShell>
    </>
  );
}
