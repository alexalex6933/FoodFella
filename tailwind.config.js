/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1db954',
        secondary: '#169c46',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};