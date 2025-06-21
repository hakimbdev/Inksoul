/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7ff',
          100: '#f3edff',
          200: '#e9deff',
          300: '#d7c4ff',
          400: '#bf9dff',
          500: '#a472ff',
          600: '#8e4fff',
          700: '#7c3aed',
          800: '#6b2fb8',
          900: '#5b2a8a',
        },
        gold: {
          50: '#fffcf0',
          100: '#fff8db',
          200: '#ffedb5',
          300: '#ffdd84',
          400: '#ffc53d',
          500: '#ffb020',
          600: '#f09109',
          700: '#c76f05',
          800: '#a0570c',
          900: '#83470d',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        calligraphy: ['Dancing Script', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(116, 79, 237, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(116, 79, 237, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};