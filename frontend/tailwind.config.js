/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aurora Dark Theme
        space: {
          950: '#030508',
          900: '#070B14',
          800: '#0D1526',
          700: '#111D38',
          600: '#162345',
        },
        teal: {
          400: '#2DD4BF',
          500: '#00D4AA',
          600: '#00B894',
          glow: 'rgba(0, 212, 170, 0.3)',
        },
        violet: {
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
          glow: 'rgba(124, 58, 237, 0.3)',
        },
        gold: {
          400: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
        },
        aurora: {
          cyan: '#06B6D4',
          pink: '#EC4899',
          green: '#10B981',
          orange: '#F97316',
        },
        // Light theme
        light: {
          bg: '#F8FAFF',
          surface: '#FFFFFF',
          card: '#F1F5FF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #070B14 0%, #0D1526 30%, #111D38 60%, #070B14 100%)',
        'teal-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 212, 170, 0.15), transparent 70%)',
        'violet-glow': 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15), transparent 70%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #00D4AA, #06B6D4)',
        'violet-gradient': 'linear-gradient(135deg, #7C3AED, #EC4899)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B, #EF4444)',
        'success-gradient': 'linear-gradient(135deg, #10B981, #06B6D4)',
      },
      boxShadow: {
        'teal-glow': '0 0 20px rgba(0, 212, 170, 0.3), 0 0 60px rgba(0, 212, 170, 0.1)',
        'violet-glow': '0 0 20px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.1)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-light': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 0 30px rgba(0, 212, 170, 0.05)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 170, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
