module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./public/**/*.svg"],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        mint: '#34d399',
        cream: '#fef3c7',
        softbg: '#f3f4f6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
