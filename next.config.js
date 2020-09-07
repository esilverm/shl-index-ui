// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins(
  [
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
        responsive: {
          adapter: require('responsive-loader/sharp'),
        },
      },
    ],
    // your other plugins here
  ],
  {
    basePath: '/',
  }
);
