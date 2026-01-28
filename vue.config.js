const { defineConfig } = require('@vue/cli-service')
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
    }
  },
  css: {
    extract: {
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }
  }
})
