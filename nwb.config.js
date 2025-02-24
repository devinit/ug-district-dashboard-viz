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
      module: {
        rules: [
          {
            test: /\.js$/,
            include: /node_modules[\\/]mapbox-gl/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                ],
              },
            },
          },
        ],
      },
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  },
};
