// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [
    optimizedImages,
    {
      optimizeImagesInDev: true,
      optipng: {
        optimizationLevel: 3,
      },
      webp: {
        preset: 'default',
        quality: 80,
      },
      svgo: {
        plugins: [{ removeComments: false }],
      },
    },
  ],

  // your other plugins here
]);
