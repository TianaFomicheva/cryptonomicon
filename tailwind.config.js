module.exports = {
  purge: {content: [
    './src/**/*.html',
    './src/**/*.vue',
  ]},
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
    plugins: [
      require('@tailwindcss/forms'),
      // ...
    ],
  }