const path = require("path");
const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const APP_PATH = path.resolve(__dirname, "src");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  entry: {
    main: path.join(APP_PATH, "index.tsx")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(APP_PATH, "index.html"),
      favicon: path.join(APP_PATH, "favicon.ico")
    }),
    new webpack.DefinePlugin({
      SERVICE_HOST: JSON.stringify("localhost")
    })
  ]
});
