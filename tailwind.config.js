/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9d7ff',
          300: '#7cb8ff',
          400: '#3498db',
          500: '#1e3a5f',
          600: '#1a3354',
          700: '#162b49',
          800: '#14243e',
          900: '#0f1e35',
        },
        secondary: {
          50: '#fef7e0',
          100: '#feecb3',
          200: '#fedf80',
          300: '#fed24d',
          400: '#fdc426',
          500: '#f39c12',
          600: '#dc890e',
          700: '#c4770a',
          800: '#ab6506',
          900: '#925402',
        },
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e3a5f 0%, #3498db 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f39c12 0%, #fdc426 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(30, 58, 95, 0.12)',
        'card': '0 4px 16px rgba(30, 58, 95, 0.08)',
        'hover': '0 12px 40px rgba(30, 58, 95, 0.15)',
      },
    },
  },
  plugins: [],
}