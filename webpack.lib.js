const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin'),
  merge = require('webpack-merge'),
  path = require('path'),
  common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "lib"),
    library: "alignment",
    libraryTarget: "commonjs2",
    filename: "alignment.js"
  },
  entry: path.resolve(__dirname, 'src', 'library.js'),
  externals: [
    'react',
    'react-bootstrap',
    'd3',
    'underscore'
  ]
});
