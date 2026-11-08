/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,astro}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Permanent Marker', 'cursive'],
        'body': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#8B0000',
        'secondary': '#111111',
        'silver': '#C0C0C0',
        'accent': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
