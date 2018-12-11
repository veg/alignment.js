const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve("src", "app.jsx"),
  plugins: [
    new HtmlWebpackPlugin({
      title: "Javascript Alignment Viewer"
    }),
    new webpack.ProvidePlugin({
      d3: "d3",
      _: "underscore",
      $: "jquery"
    }),
    new ExtractTextPlugin("alignment.css")
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react", "stage-1"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.scss?$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  stats: {
    colors: true
  }
};
