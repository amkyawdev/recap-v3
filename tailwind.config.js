/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        strawberry: {
          50: '#ffe5ec',
          100: '#ffb8c9',
          200: '#ff8aa6',
          300: '#ff5c83',
          400: '#ff2e60',
          500: '#e9004d',
          600: '#c4003e',
          700: '#a30032',
          800: '#820027',
          900: '#61001b',
        },
      },
      fontFamily: {
        pyidaungsu: ['Pyidaungsu', 'sans-serif'],
        notoMyanmar: ['Noto Sans Myanmar', 'sans-serif'],
        masterpiece: ['Masterpiece', 'sans-serif'],
        zawgyi: ['Zawgyi', 'sans-serif'],
      },
      animation: {
        'rotate-45': 'rotate 45deg',
      },
    },
  },
  plugins: [],
}