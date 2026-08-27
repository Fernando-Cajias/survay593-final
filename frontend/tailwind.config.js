/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488', // Teal 600
          light: '#14B8A6',   // Teal 500
          dark: '#0F766E',    // Teal 700
          50: 'rgba(13, 148, 136, 0.1)',
          glow: 'rgba(13, 148, 136, 0.35)',
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo 500
          light: '#818CF8',   // Indigo 400
          50: 'rgba(99, 102, 241, 0.1)',
        },
        dark: {
          bg: '#0B1121',      // Slate 950 ultra dark
          alt: '#0F172A',     // Slate 900
          surface: '#1E293B', // Slate 800
          hover: '#273548',
          elevated: '#334155',// Slate 700
          border: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'stitch': '8px',
        'stitch-lg': '12px',
        'stitch-xl': '16px',
        'stitch-2xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(13, 148, 136, 0.35)',
        'glow-sm': '0 0 12px rgba(13, 148, 136, 0.25)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
