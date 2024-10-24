/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4981ff',
          second: '#5b8dff',
          third: '#e7efff',
          fourth: '#6896ff'
        },
        black: {
          DEFAULT: '#212225',
          second: '#202224'
        },
        gray: {
          DEFAULT: '#7d7c7f',
          light: '#e0e0e0',
          second: '#f4f5f9',
          third: '#f5f6fa',
          fourth: '#d5d5d5',
          fifth: '#7a7b7d',
          six: '#c8c8c8'
        },
        green: {
          DEFAULT: '#00B69B'
        }
      },
      height: {
        header: '70px'
      },
      fontFamily: {
        'nunito-sans': ['Nunito Sans', 'sans-serif']
      }
    }
  },
  plugins: [require('tailwind-scrollbar-hide')],
  corePlugins: {
    preflight: true // <== disable this!
  }
}
