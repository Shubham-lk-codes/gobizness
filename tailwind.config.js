/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/js/**/*.js',
    './public/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'ui-serif', 'Georgia', 'serif']
      },
      boxShadow: {
        elevated: '0 24px 60px rgba(7, 26, 54, 0.16)',
        glow: '0 12px 36px rgba(251, 191, 36, 0.24)'
      },
      keyframes: {
        sheen: {
          '0%, 100%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '55%': { transform: 'translateX(180%) skewX(-18deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.96)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        }
      },
      animation: {
        sheen: 'sheen 8s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
