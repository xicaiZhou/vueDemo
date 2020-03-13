const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
var baseUrl = 'https://api.tygy.top/estate'
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: false,
    host: 'localhost',
    port: 8085,
    open: true,
    proxy: {
      '/api': {
        target: baseUrl,
        // target: 'http://192.168.0.107:8080/estate', // thinkpad local
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
})