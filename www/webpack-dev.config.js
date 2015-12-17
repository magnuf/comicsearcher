var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

var webpackConfig = require('./webpack-base.config');

module.exports = {

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server'
  ].concat(webpackConfig.entry.app),

  output: webpackConfig.output,

  plugins: webpackConfig.plugins.concat([
    new webpack.DefinePlugin({ __PROD__: false, __DEV__: true }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackNotifierPlugin()
  ]),

  module: {
    loaders:
      [
        {
          loader: 'react-hot',
          test: /\.js$/,
          include: path.join(__dirname, 'js')
        }
      ].concat(webpackConfig.module.loaders)
  }
};