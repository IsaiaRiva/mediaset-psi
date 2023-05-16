const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./common.cjs");
const path = require("path");

module.exports = merge(common, {
  devServer: {
    static: {
      directory: path.join(__dirname, "../../dist/app/"),
    },
    compress: true,
    port: 3000,
    https: false,
  },
});
