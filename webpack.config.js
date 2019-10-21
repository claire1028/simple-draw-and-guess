const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = true;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html'}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
      contentBase: './dist',
  },
  module: {
    rules: [
     {
       test: /\.jsx?/,
       exclude: /node_modules/,
       use: [{
           loader: 'babel-loader', 
       }]
      },
      {
				test: /\.less$/,
				use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              ident: 'postcss',
              plugins: () => {
                const rt = [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    flexbox: 'no-2009'
                  })
                ];
                return rt;
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              relativeUrls: false,
              sourceMap: isDev
            }
          }
        ]
			},
    ]
  }
}