/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#14211d', paper: '#f6f7f4',
      brand: { 50: '#eefaf5', 100: '#d3f3e5', 500: '#17a37a', 600: '#0f8a68', 700: '#0c6f54', 900: '#0b3d30' },
      sun: { 400: '#f5b841', 500: '#e9a21f' } },
    fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] } } },
  plugins: [],
};
