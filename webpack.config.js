const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path')
const webpack = require('webpack');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src', 'scripts', 'main.ts')
  },
  output: {
    path: path.resolve(__dirname, 'pre-dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    publicPath: ''
  },

  resolve: {
    modules: [path.resolve(__dirname, "..", ".."), "node_modules"],
    extensions: ['.ts', '.js', '.html'],
    alias: {
      'vue$': path.resolve(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm.js')
    }
  },

  target: "web",

  module: {
    rules: [
      {
        test: /\.(woff2?|ttf|otf|eot|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.(css|scss)$/,
        exclude: /exclude/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader", options: {
              sourceMap: true,
              importLoaders: 2
            }
          }, {
            loader: "sass-loader", options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'html', 'main.pug')
    }),

    new webpack.DefinePlugin({
      'process.env': {
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
