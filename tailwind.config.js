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
        '5/6': '83.33%'
      },
      minWidth: {
        '72': '18rem',
        '38.5': '9.625rem', // 154px
      },
      minHeight: {
        '8': '2rem',
        '144.5':'36.125rem', // 578px
      },
      width: {
        'fit-content': 'fit-content',
        '15': '3.75rem',
      },
      height: {
        'fit-content': 'fit-content',
        '15': '3.75rem'
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
