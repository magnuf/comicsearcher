var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    app: ['./js/index']
  },

  output: {
    path: __dirname + '/dist/',
    filename: './[name].bundle.js',
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'comicsearcher',
      template: 'index-template.html',
      inject: 'body',
      hash: true
    }),
    new webpack.NoErrorsPlugin({ bail: true })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'js'),
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: [ 'transform-react-require', 'transform-object-rest-spread' ],
          presets: [ 'es2015', 'react' ]
        }
      }
    ]
  }
};
