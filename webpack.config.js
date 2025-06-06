const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
    clean: true,
  },
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!mapbox-gl)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
          }),
        ]
      : []),
  ],

  externals: {
    d3: 'd3',
  },

  optimization: {
    splitChunks: {
      chunks: 'all', // Split all types of chunks (async and initial)
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: {
      name: 'runtime', // Extract Webpack's runtime into a separate file
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // Add CSS minifier
      new TerserPlugin({
        // JavaScript minifier
        extractComments: false, // Do not extract comments to a separate file
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // removes console.* in prod
          },
          format: {
            comments: false, // Remove comments in production
          },
        },
      }),
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    hot: true,
    open: true,
    historyApiFallback: true,
    port: 3000,
  },
};
