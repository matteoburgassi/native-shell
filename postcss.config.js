export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 2,
      browsers: 'chrome >= 53',
      features: {
        'cascade-layers': true,
        'nesting-rules': true,
        'custom-properties': { preserve: false },
      },
    },
  },
}
