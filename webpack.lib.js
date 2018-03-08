const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin'),
  merge = require('webpack-merge'),
  path = require('path'),
  common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "dist"),
    library: "alignment",
    libraryTarget: "commonjs2",
    filename: "alignment.js"
  },
  entry: path.resolve(__dirname, 'src', 'alignment.js'),
  externals: [
    'react',
    'react-bootstrap',
    'd3',
    'underscore'
  ]
});
