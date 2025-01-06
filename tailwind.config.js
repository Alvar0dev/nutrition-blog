/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Permanent Marker', 'cursive'],
        'body': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#8B0000', // Rojo oscuro
        'secondary': '#111111', // Casi negro
        'silver': '#C0C0C0', // Plateado
        'accent': '#FFFFFF', // Blanco
      },
    },
  },
  plugins: [],
}
