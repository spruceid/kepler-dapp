module.exports = {
  tableLayout: false,
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.svelte',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      padding: {
        30: '7.5rem', // 120px
        42: '10.5rem', // 168px
      },
      margin: {
        '5.5': '1.375rem', // 22px
        '10.5': '2.625rem', // 42px
      },
      lineHeight: {
        16: '4rem'
      },
      colors: {
        purple: {
          DEFAULT: '#3528B0'
        },
        cyan: {
          DEFAULT: '#00D3DD'
        },
        blue: {
          350: '#1DA1F2',
          550: '#3A83A3'
        },
        gray: {
          1: '#C4C4C4',
          350: '#AAAAAA',
          370: '#A0A4A8',
          650: '#3E3E3E',
          DEFAULT: '#292C36',
          "primary-03": "#262626",
        },
        green: {
          DEFAULT: '#09D1DB',
        },
      },
      maxWidth: {
        '2/3': '66.67%',
        125: '31.25rem', // 500px
      },
      maxHeight: {
        '2/3': '66.67%',
        '5/6': '83.33%',
        78: '19.5rem', // 312px
        '94.5': '23.625rem', // 378px
      },
      minWidth: {
        '72': '18rem',
        26:'6.5rem', // 104px
        '38.5': '9.625rem', // 154px
      },
      minHeight: {
        8: '2rem',
        10: '2.5rem', // 40px
        70: '17.5rem', // 280px
        '144.5':'36.125rem', // 578px
      },
      width: {
        'fit-content': 'fit-content',
        '15': '3.75rem',
      },
      height: {
        'fit-content': 'fit-content',
        '15': '3.75rem',
        '10.5': '2.625rem', // 42px
      },
      fontFamily: {
        'poppins': ['Poppins'],
        'satoshi': ['Satoshi'],
        'inter': ['Inter'],
        'inconsolata': ['Inconsolata'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      opacity: ['disabled'],
      tableLayout: ['hover', 'focus'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
