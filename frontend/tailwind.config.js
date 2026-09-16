/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: '#f4f7f4',
          100: '#e5ece2',
          200: '#ccdbc8',
          300: '#a8c5a2',
          400: '#81aa7a',
          500: '#5d8d55',
          600: '#4b7344',
          700: '#3c5b37',
          800: '#2e442b',
          900: '#223120',
        },
        coffee: {
          50: '#faf7f2',
          100: '#f2eae0',
          200: '#e3d3c1',
          300: '#cbb59c',
          400: '#ab8f73',
          500: '#8c6d53',
          600: '#6f523d',
          700: '#563e2f',
          800: '#3e2c22',
          900: '#271c15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
