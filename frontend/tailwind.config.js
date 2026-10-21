/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b5',
          400: '#fb718d',
          500: '#e15c76', // TravelEase Signature Coral Pink
          600: '#cd526c',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ece5',
          200: '#ccdacc',
          500: '#52796f',
          600: '#354f52',
          700: '#2f3e46',
        },
        gold: {
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b45309',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        yesteryear: ['Yesteryear', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(225, 92, 118, 0.25)',
      }
    },
  },
  plugins: [],
}
