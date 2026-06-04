/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0d0e11',
          800: '#13151a',
          700: '#1a1d24',
          600: '#22262f',
          500: '#2c3140',
        },
        mtw: {
          amber:  '#f59e0b',
          green:  '#22c55e',
          blue:   '#3b82f6',
          purple: '#a855f7',
          teal:   '#14b8a6',
          red:    '#ef4444',
          gray:   '#6b7280',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
