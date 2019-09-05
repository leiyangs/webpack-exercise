const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin") // 自动生成index.html
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 每次打包清空文件夹
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css分离

module.exports = {
  context: process.cwd(),
  mode: "development", // 开发环境和生产环境配置有很多不同，webpack4以后可以配置mode development/production 用于提供模式配置选项告诉webpack相应地使用其内置的优化
  devtool: "eval", // eval会有sourcemap
  // entry: "./src/index.js", // 入口文件 如果是一个文件就是单入口 多入口要变成对象 输出文件filename不能写单个
  entry: {
    index: "./src/index.js",
    login: "./src/login.js"
  },
  output: { // 输出文件
    path: path.resolve(__dirname, "dist"), // 输出目录只能是绝对目录
    filename: "[name].[hash].js", // 输出文件名(bundle.js,如果是单入口，输出的文件名就是main)   防止缓存有三种hash: hash chunkHash contentHash   [hash:8](只要八位)
    publicPath: "/" // 根路径
  },
  devServer: { // 安装webpack-dev-server –D (其实是express开发服务器) package.json可以配置--open 运行时自动打开页面
    contentBase: path.resolve(__dirname, "dist"), // 配置开发服务器运行时的根路径(产出文件的根目录)
    port: 8082, // 监听的端口
    host: "localhost", // 开发服务器监听的主机地址
    compress: true // 开发服务器是否启动gzip等压缩
  },
  module: {
    rules: [
      {
        test: /\.css/,
        // use: ["style-loader", "css-loader"] // loader三种写法: use/loader/use+loader; 从右到左处理css文件
        use: [{loader: MiniCssExtractPlugin.loader}, "css-loader"] // css分离
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        // use: ["file-loader"] // url-loader比file-loader 功能强(url-loader内置了file-loader)
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024 // 如果图片大小小于10k，就转为base64编码
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // 产出html文件,编译时候会读取模板文件
      template: "./src/index.html", // 指定模板文件
      filename: "index.html", // 产出后的文件名
      hash: true, // 为了避免缓存，可以在产出的资源后面添加hash值
      chunks: ["login", "index"], // 对应入口文件 如果配置了chunksSorteMode,就可以根据代码逻辑进行排序，引入的先后顺序
      chunksSortMode:'manual' // 对引入代码块进行排序的模式chunksSortMode: 默认auto  manual手动  dependency依赖项 Funtion
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css", // 代码块名字
      chunkFilename: "[id].css" // 异步加载用
    })
  ]
}