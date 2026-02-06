const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const buildTimestamp = Date.now()

module.exports = defineConfig({
  devServer: {
    allowedHosts: "all",
  },
  transpileDependencies: [
    'vuetify'
  ],
  filenameHashing: true,
  productionSourceMap: false,
  configureWebpack: {
    output: {
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[contenthash:8].js'
    },
    plugins: [
      new webpack.DefinePlugin({
        '__BUILD_TIMESTAMP__': JSON.stringify(buildTimestamp)
      })
    ]
  },
  css: {
    extract: {
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].buildTimestamp = buildTimestamp
      args[0].cache = false
      return args
    })
  }
})
