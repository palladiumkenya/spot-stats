const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const APP_PATH = path.resolve(__dirname, "src");
const webpack = require("webpack");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.(scss|sass|css)$/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      },
      { test: /\.(png|svg|jpg|jpeg|gif|ico)$/, loader: ["file-loader"] },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, loader: ["file-loader"] }
    ]
  },
  devServer: {
    https: true,
    port: 4721,
    host: "0.0.0.0",
    publicPath: "/",
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    proxy: {
      "/api": "https://localhost:4720"
    }
  },
  devtool: "source-map",
  externals: [],
  plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()]
};
