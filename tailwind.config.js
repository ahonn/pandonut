module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '1/3screen': '33vh',
      },
      minHeight: {
        '96': '24rem',
      }
    },
  },
  plugins: [],
}
