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
            test: /\.m?js$/, // Handle both .js and .mjs files
            exclude: /node_modules\/(?!uuid|swr|mapbox-gl|color-convert)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  '@babel/plugin-proposal-logical-assignment-operators',
                  '@babel/plugin-proposal-numeric-separator',
                ],
              },
            },
          },
          {
            test: /\.mjs$/, // Ensure Babel handles .mjs files
            include: /node_modules/,
            type: 'javascript/auto', // This tells Webpack to process `.mjs` files correctly
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
          },
        ],
      },
    },
  },
  babel: {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-transform-runtime'],
  },
};
