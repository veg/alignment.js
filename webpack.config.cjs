const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');


const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    main: path.resolve('src', 'app.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Alignment UI'
    }),
  ].concat(false ? [] : [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    })
  ]),
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  mode: devMode ? 'development' : 'production',
  devServer: {
    liveReload: true,
    hot: false
  },
  devtool: devMode ? 'eval-cheap-module-source-map' : false,
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  }
};
