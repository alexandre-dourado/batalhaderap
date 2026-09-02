/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090909',
        offwhite: '#F4F0E8',
        red: '#FF3030',
        acid: '#F5E600',
        gray: '#777777',
      },
      fontFamily: {
        display: ['Impact', 'Oswald', 'sans-serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(244, 240, 232, 1)',
        'brutal-red': '4px 4px 0px 0px rgba(255, 48, 48, 1)',
        'brutal-acid': '4px 4px 0px 0px rgba(245, 230, 0, 1)',
      }
    },
  },
  plugins: [],
}
