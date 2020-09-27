const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const path = require('path');
const webpack = require('webpack');
module.exports = {
  publicPath: './', // 静态资源访问
  outputDir: process.env.outputDir, // 打包输出路径
  productionSourceMap: false, // 是否生成SourceMap文件定位错误（文件会比较多影响性能建议取消）
  // 配置开发环境的代理用来解决跨域情况，注意devServer只在开发环境有效，打包以后出现的跨域情况可由后端和nginx反向代理解决
  assetsDir: '',
  runtimeCompiler: true,
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://www.zhihu.com',
        // pathRewrite: { // 重写路径
        //   '^/': '/'
        // },
        router: {
          // when request.headers.host == 'dev.localhost:3000',
          // override target 'http://www.example.org' to 'http://localhost:8000'
        }}
    }
  },
  css: {
    loaderOptions: {
      css: {
      // 这里的选项会传递给 css-loader
      },
      postcss: {
      // 这里的选项会传递给 postcss-loader
        plugins: [
          require('postcss-px-to-viewport')({
            viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['.ignore', '.hairlines', 'van'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false // 允许在媒体查询中转换`px`
          })
        ]
      }
    }
  },
  chainWebpack(config) {
    if (isProd) {
      // 配置webpack 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css$/,
          // 超过4kb压缩
          threshold: 4096
        }));
    }
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'));
    // .set('moment', 'moment/min/moment.min.js');
  },
  configureWebpack: config => {
    Object.assign(config, {
      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          feConfig: path.resolve('.', './src/feConfig/' + (process.env.NODE_ENV || 'development'))
          // Enums: path.resolve('.', "./src/constants/enum"),
          // Utils: path.resolve('.', "./src/assets/sruntimeCompilercripts/utils"),
          // moment: 'moment'
        })
      ]
    });
  }
};
