var open = require('open');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack-dev.config');

var port = 3000;
var host = 'localhost';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true }
}).listen(port, host, function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at http://' + host + ':' + port);
  open('http://' + host + ':' + port);
});