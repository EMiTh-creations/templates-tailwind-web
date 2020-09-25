module.exports = {
  prefix: 'tw-',
  purge: {
    // layers: ['utilities'], // this flag will revert the purge mode to pre 1.8 changes
    content: ["src/**/*.{php,html}"],
    enabled: false,
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};