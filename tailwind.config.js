/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cricket-green': '#228B22',
        'cricket-dark': '#1a1a1a',
        'cricket-light': '#f8f9fa',
        'cricket-gray': '#6b7280',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}