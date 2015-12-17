var webpack = require('webpack');

var webpackConfig = require('./webpack-base.config');

module.exports = {

  entry: webpackConfig.entry,

  output: webpackConfig.output,

  plugins: webpackConfig.plugins.concat([
    new webpack.DefinePlugin({ __PROD__: true, __DEV__: false }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]),

  module: webpackConfig.module
};
