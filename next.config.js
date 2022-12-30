const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.net = require.resolve('net-browserify');
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      tls: false,
      async_hooks: false,
    };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: ['preset-default'],
            },
            dimensions: false,
            memo: true,
            svgProps: {
              role: 'img',
            },
          },
        },
      ],
    });

    // We were getting an annoying Critical dependency warning that we
    // couldn't do anything about. This filters that out of our console.
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: [/Critical dependency/],
      }),
    );

    return config;
  },
};

module.exports = nextConfig;
