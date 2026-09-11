/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#070708',
        charcoal: '#111216',
        surface: '#181A20',
        surface2: '#1E212A',
        ink: '#F5F5F5',
        muted: '#A8A8B0',
        violet: {
          DEFAULT: '#7C5CFF',
          soft: '#9D85FF',
          deep: '#4B2FCC'
        },
        cyan: {
          DEFAULT: '#3FD0F0',
          soft: '#8CE7F7'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(124, 92, 255, 0.45)',
        card: '0 8px 30px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(124,92,255,0.18), transparent 60%)',
        'aurora': 'linear-gradient(120deg, rgba(124,92,255,0.25), rgba(63,208,240,0.15))'
      }
    }
  },
  plugins: []
}
