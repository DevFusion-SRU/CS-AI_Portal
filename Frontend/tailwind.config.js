/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pt: ['"Pt Sans"', 'serif'],
        quicksand: ['"Quicksand"', 'sans-serif'],
        lato: ['"Lato"', 'sans-serif'],
      },
      fontSize: {
        'ag-body': '17px', // Custom font size
        'ag-body-small': '16px',
        'h5': '22px',
        'h6':'48px'
      },
      lineHeight: {
        'auto': 'normal', // Auto line height
        '36': '36px',
        '72':'72px'
      },
      colors: {
        customGray: '#3A3A3A', // Custom color
      },

    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}