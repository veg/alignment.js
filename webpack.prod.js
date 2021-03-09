const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.jsx",
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devServer: {
    host: "0.0.0.0",
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: "public"
  }
};
