import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, Zap, ShieldCheck, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store';
import { cn } from '@/utils';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Minimum 6 characters'),
  rememberMe: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    const success = await login(data.email, data.password, data.rememberMe);
    if (success) navigate('/dashboard');
    else setAuthError('Invalid credentials. Use admin@nexusflow.io / password123');
  };

  return (
    <>
      <Helmet>
        <title>Sign In — NexusFlow CRM</title>
        <meta name="description" content="Sign in to your NexusFlow CRM dashboard to manage customers, orders, and revenue analytics." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #BAE0FA 0%, #D6EEFB 25%, #EAF5FF 50%, #D9EDFB 75%, #C5DEFA 100%)',
        }}
      >
        {/* ── Liquid glass background orbs ── */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-orb w-[800px] h-[800px] -top-72 -left-72"
            style={{ background: 'radial-gradient(circle, rgba(186,224,255,0.95), transparent)' }} />
          <div className="aurora-orb w-[600px] h-[600px] bottom-[-20%] right-[-12%]"
            style={{ background: 'radial-gradient(circle, rgba(196,218,255,0.8), transparent)', animationDelay: '-5s' }} />
          <div className="aurora-orb w-96 h-96 top-[30%] right-[20%]"
            style={{ background: 'radial-gradient(circle, rgba(209,234,255,0.7), transparent)', animationDelay: '-2.5s' }} />
          {/* Subtle dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* ── Login Card ── */}
        <div className="relative z-10 w-full max-w-[420px] px-4 animate-slide-up">

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'saturate(220%) blur(40px)',
            WebkitBackdropFilter: 'saturate(220%) blur(40px)',
            border: '1px solid rgba(255,255,255,0.95)',
            borderRadius: '28px',
            boxShadow: `
              0 32px 80px rgba(80,140,210,0.18),
              0 8px 24px rgba(100,160,230,0.14),
              inset 0 2px 0 rgba(255,255,255,1),
              inset 0 -1px 0 rgba(160,200,240,0.3)
            `,
            padding: '40px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}>

            {/* Top highlight */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, transparent 95%)',
              borderRadius: '28px 28px 0 0',
              pointerEvents: 'none',
            }} />

            {/* ── Brand / Icon ── */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-4 animate-pulse-glow"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                  boxShadow: '0 8px 28px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.35)',
                }}
              >
                <Zap size={28} style={{ color: '#ffffff' }} />
              </div>
              <h1 className="font-display font-bold text-2xl" style={{
                background: 'linear-gradient(135deg, #0369A1, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                NexusFlow
              </h1>
              <p className="text-xs tracking-[0.18em] uppercase mt-1 font-medium" style={{ color: '#6B8BAE' }}>
                CRM Suite · v2.0
              </p>
            </div>

            <h2 className="font-display font-bold text-xl mb-1 text-center" style={{ color: '#0A1628' }}>
              Welcome back 👋
            </h2>
            <p className="text-sm text-center mb-7" style={{ color: '#6B8BAE' }}>
              Sign in to access your dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#6B8BAE' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8C0D8' }} />
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="admin@nexusflow.io"
                    className={cn('input pl-10', errors.email && 'error')}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: '#DC2626' }}>
                    <AlertCircle size={11} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B8BAE' }}>
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold transition-colors hover:underline" style={{ color: '#0EA5E9' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8C0D8' }} />
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={cn('input pl-10 pr-11', errors.password && 'error')}
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                    style={{ color: '#A8C0D8' }}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: '#DC2626' }}>
                    <AlertCircle size={11} /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: '#0EA5E9' }}
                />
                <label htmlFor="rememberMe" className="text-sm cursor-pointer select-none" style={{ color: '#2D4A6E' }}>
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Auth error */}
              {authError && (
                <div
                  className="flex items-start gap-2.5 p-3 rounded-xl text-sm animate-scale-in"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#DC2626' }}
                >
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <p>{authError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="login-submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3 text-sm mt-2"
                style={{ borderRadius: '14px', fontSize: '14px' }}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                ) : (
                  <>Sign in to Dashboard <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            {/* ── Demo Credentials hint ── */}
            <div
              className="mt-6 p-4 rounded-2xl"
              style={{
                background: 'rgba(14,165,233,0.06)',
                border: '1px solid rgba(14,165,233,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={13} style={{ color: '#0EA5E9' }} />
                <p className="text-xs font-semibold" style={{ color: '#0369A1' }}>Demo Credentials</p>
              </div>
              <p className="text-xs" style={{ color: '#6B8BAE' }}>
                Email: <span className="font-mono font-semibold" style={{ color: '#2D4A6E' }}>admin@nexusflow.io</span>
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B8BAE' }}>
                Password: <span className="font-mono font-semibold" style={{ color: '#2D4A6E' }}>password123</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: '#6B8BAE' }}>
            © 2026 NexusFlow Inc. ·{' '}
            <a href="#" className="hover:underline" style={{ color: '#0EA5E9' }}>Privacy</a> ·{' '}
            <a href="#" className="hover:underline" style={{ color: '#0EA5E9' }}>Terms</a>
          </p>
        </div>
      </div>
    </>
  );
}
