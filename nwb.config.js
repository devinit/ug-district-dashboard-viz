module.exports = {
  type: 'web-app',
  webpack: {
    styles: {
      css: [
        // Create a rule which uses CSS modules for CSS imported from src/components
        {
          test: '*.css',
          // Configuration options for css-loader
          css: {
            modules: false,
          },
        },
      ],
    },
    extractCSS: {
      filename: process.env.NODE_ENV === 'production' ? '[name].[contenthash:8].css' : '[name].css',
    },
    extra: {
      // mode: 'production',
      externals: {
        d3: 'd3',
      },
      devtool: process.env.NODE_ENV === 'production' ? 'none' : 'source-map',
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
  },
};
