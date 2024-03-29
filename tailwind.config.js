/* eslint-env node */

const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('next-same-element', '& + &');
    })
  ],
  theme: {
    extend: {
      colors: {
        secondary: 'rgb(148, 103, 251)',
        'background-100': '#252a37',
        'background-200': '#2b303f',
        'background-300': '#2e3343',
        'background-800': '#d1d1d1',
        'background-900': 'rgba(148, 103, 251, 0.25)',
        'text-100': '#dadada',
        'text-200': '#d1d1d1',
        'text-300': '#dfdfdf',
        'text-700': '#2e3343',
        'text-800': '#5089ff',
        'text-900': '#9467FB',
        'border-100': '#373e51',
        'border-200': '#252a37',
        'border-900': '#9467FB',
        'bluegray-button': 'rgba(80, 137, 255, 0.1)'
      },
      backgroundImage: {
        'purple-button':
          'linear-gradient(88.63deg, rgb(148, 103, 251) 15.35%, rgb(67, 38, 136) 103.86%)',
        skeleton: 'linear-gradient(to right, #252a37 0px, #2b303f   53.077%, #252a37 100%)'
      },
      fontSize: {
        xs: '0.6rem',
        sm: '1.2rem',
        md: '1.4rem',
        base: '1.6rem',
        lg: '1.8rem',
        xl: '2.4rem',
        '2xl': '3rem'
      },
      screens: {
        sm: '375px',
        md: '768px'
      },
      spacing: {
        1: '0.1rem',
        2: '0.2rem',
        4: '0.4rem',
        6: '0.6rem',
        8: '0.8rem',
        10: '1rem',
        12: '1.2rem',
        16: '1.6rem',
        14: '1.4rem',
        18: '1.8rem',
        20: '2rem',
        24: '2.4rem',
        30: '3rem',
        36: '3.6rem',
        40: '4rem',
        48: '4.8rem',
        50: '5rem',
        60: '6rem',
        70: '7rem',
        72: '7.2rem',
        80: '8rem',
        84: '8.4rem',
        90: '9rem',
        96: '9.6rem',
        100: '10rem',
        120: '12rem',
        130: '13rem',
        140: '14rem',
        150: '15rem',
        160: '16rem',
        170: '17rem',
        180: '18rem',
        190: '19rem',
        200: '20rem',
        210: '21rem',
        220: '22rem',
        230: '23rem',
        240: '24rem',
        250: '25rem',
        260: '26rem',
        270: '27rem',
        280: '28rem',
        290: '29rem',
        300: '30rem',
        310: '31rem',
        320: '32rem',
        330: '33rem',
        340: '34rem',
        350: '35rem',
        360: '36rem',
        370: '37rem',
        380: '38rem',
        390: '39rem',
        400: '40rem',
        410: '41rem',
        420: '42rem',
        430: '43rem',
        440: '44rem',
        450: '45rem',
        460: '46rem',
        470: '47rem',
        480: '48rem',
        490: '49rem',
        500: '50rem',
        510: '51rem',
        520: '52rem',
        530: '53rem',
        540: '54rem',
        550: '55rem',
        560: '56rem',
        570: '57rem',
        580: '58rem',
        590: '59rem',
        600: '60rem',
        960: '96rem'
      },
      maxWidth: {
        96: '96rem'
      },
      minWidth: {
        12: '12rem'
      },
      animation: {
        skeleton: 'skeleton 1.5s ease infinite'
      },
      keyframes: {
        skeleton: {
          from: {
            transform: 'translateX(-100%)'
          },
          to: {
            transform: 'translateX(100%)'
          }
        }
      }
    }
  },
  plugins: []
};
