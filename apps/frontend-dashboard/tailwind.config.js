/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f0',
          100: '#ffdfde',
          200: '#ffc4c2',
          300: '#ff9c99',
          400: '#ff615c',
          500: '#ff2d26',
          600: '#ff0100',
          700: '#d90100',
          800: '#b30100',
          900: '#940504',
          950: '#520100',
        },
        secondary: {
          50: '#f6f6f7',
          100: '#e8e9eb',
          200: '#d0d1d5',
          300: '#a8abb3',
          400: '#7a7e88',
          500: '#5a5e68',
          600: '#3a3d42',
          700: '#34373b',
          800: '#2d2f33',
          900: '#292b2e',
          950: '#1a1b1d',
        },
        brand: {
          text: {
            primary: '#212529',
            secondary: '#6C757D',
          }
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
