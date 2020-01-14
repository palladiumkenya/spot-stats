const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const APP_PATH = path.resolve(__dirname, "src");
const webpack = require("webpack");
const PUB_PATH = path.join(__dirname, "/../server/dist/wwwroot");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  entry: {
    stats: path.join(APP_PATH, "stats.ts")
  },
  output: {
    filename: "[name].js",
    libraryTarget: "amd",
    path: PUB_PATH
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css"
    }),

    // Compress CSS files
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false
        }
      }
    }),
    new webpack.DefinePlugin({
      SERVICE_HOST: JSON.stringify("68.183.47.234")
    })
  ],
  externals: [
    /^lodash$/,
    /^single-spa$/,
    /^react$/,
    /^react\/lib.*/,
    /^react-dom$/,
    /.*react-dom.*/,
    /^rxjs\/?.*$/,
    /^prime$/
  ]
});
