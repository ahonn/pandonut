module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '1/2screen': '50vh',
      },
      minHeight: {
        '96': '24rem',
      }
    },
  },
  plugins: [],
}
