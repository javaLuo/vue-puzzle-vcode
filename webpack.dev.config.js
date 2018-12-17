var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'example', 'main.js'),
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        use: ['vue-loader'],
        include: [path.join(__dirname, 'example')],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.join(__dirname, 'example')],
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: path.resolve(__dirname, 'example'),
        use: ['file-loader?name=assets/[name].[ext]'],
      },
      {
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)(\?|$)/,
        include: path.resolve(__dirname, 'example'),
        use: ['url-loader?limit=8192&name=assets/[name].[ext]'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css'], //后缀名自动补全
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
