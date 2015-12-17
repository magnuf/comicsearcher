var webpack = require('webpack');

var webpackConfig = require('./webpack-base.config');

module.exports = {

  entry: webpackConfig.entry,

  output: Object.assign({}, webpackConfig.output, {
    publicPath: "/bekkops-comicsearcher-www/"
  }),

  plugins: webpackConfig.plugins.concat([
    new webpack.DefinePlugin({ __PROD__: true, __DEV__: false }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]),

  module: webpackConfig.module
};
