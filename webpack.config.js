const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkerLoader = require("worker-plugin");

module.exports = ( env, argv ) => ({
  mode: "development",
  entry: './src/index.js',
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader"
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'y')
  },
  // devServer: {
  //   contentBase: path.resolve(__dirname, ''),
  //   watchContentBase: true,
  //   inline: true,
  //   hot: true,
  // }
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" }),new WorkerLoader()]
});