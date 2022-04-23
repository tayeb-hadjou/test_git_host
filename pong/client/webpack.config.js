const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PRODUCTION = false;

module.exports = {
  entry: path.resolve(__dirname, './src/scripts/pong.js'),
  output: {
    path: path.resolve(__dirname, '../server/public/dist') ,
    filename: 'scripts/bundle.js'
  },
  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'eval-source-map'),
  devServer: {
      static: {
         publicPath: path.resolve(__dirname, 'dist'),
         watch : true
      },
      host: 'localhost',
      port : 8888,
      open : true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new CopyPlugin({
  	    patterns: [
          {
            context: path.resolve(__dirname, "src", "html"),
            from: '**/*.html',
            to:   'html/[name].html',
            noErrorOnMissing: true
          },
          {
            context: path.resolve(__dirname, "src", "images"),
            from: '**/*',
            to:   'images/[name][ext]',
            noErrorOnMissing: true
          },
          {
            context: path.resolve(__dirname, "src", "style"),
            from: '**/*',
            to:   'style/[name][ext]',
            noErrorOnMissing: true
          },
  	    ]
  	})
  ]
};
