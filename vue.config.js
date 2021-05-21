const webpack = require('webpack')
module.exports = {
  publicPath: '',
  lintOnSave: true,
  productionSourceMap: false,
  // 修改启动默认端口
  devServer: {
    port: 8081
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].env = process.env.NODE_ENV
      args[0].title = '湖北执业权利保障监督平台'
      return args
    })
    // 全局解析Sass
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: ['./src/assets/mixin.scss']
        })
        .end()
    })
  },
  configureWebpack: {
    // 取消打包后文件大于244k警告
    performance: {
      hints: false
    },
    plugins: [
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "windows.jQuery":"jquery"
      })
    ]
  }
}
