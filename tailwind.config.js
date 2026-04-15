/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        card:   'rgb(var(--card)   / <alpha-value>)',
        inset:  'rgb(var(--inset)  / <alpha-value>)',
        ink:    'rgb(var(--ink)    / <alpha-value>)',
        brand: {
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
        },
      },
      animation: {
        'fade-in':    'fadeIn    0.4s ease-out both',
        'slide-up':   'slideUp   0.5s ease-out both',
        'slide-left': 'slideLeft 0.6s ease-out both',
        'slide-right':'slideRight 0.6s ease-out both',
        'scale-in':   'scaleIn  0.3s ease-out both',
        'pop-in':     'popIn    0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' },                                              '100%': { opacity: '1' } },
        slideUp:    { '0%': { opacity: '0', transform: 'translateY(28px)' },               '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideLeft:  { '0%': { opacity: '0', transform: 'translateX(-28px)' },              '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(28px)' },               '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:    { '0%': { opacity: '0', transform: 'scale(0.9)' },                     '100%': { opacity: '1', transform: 'scale(1)' } },
        popIn:      { '0%': { opacity: '0', transform: 'scale(0.8)' },                     '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
