/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d8e9ff',
          500: '#2b6cb0',
          700: '#1d4f8a'
        }
      }
    }
  },
  plugins: []
};
