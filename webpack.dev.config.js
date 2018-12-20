var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const PUBLIC_PATH = '/';
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'example', 'main.js'),
  output: {
    filename: 'bundle.js',
    publicPath: PUBLIC_PATH,
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        use: ['vue-loader'],
        include: [path.join(__dirname, 'example'), path.join(__dirname, 'src')],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.join(__dirname, 'example'), path.join(__dirname, 'src')],
      },
      {
        // .css 解析
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        include: [path.join(__dirname, 'example'), path.join(__dirname, 'src')],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
        include: [path.join(__dirname, 'example'), path.join(__dirname, 'src')],
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: [path.resolve(__dirname, 'example'), path.join(__dirname, 'src')],
        use: ['file-loader?name=assets/[name].[ext]'],
      },
      {
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)(\?|$)/,
        include: [path.resolve(__dirname, 'example'), path.join(__dirname, 'src')],
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
