const path = require("path"),
  merge = require("webpack-merge"),
  common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map"
});
