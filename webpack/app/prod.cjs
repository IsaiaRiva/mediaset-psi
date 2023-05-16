const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./common.cjs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(
  {
    mode: "production",
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ids.HashedModuleIdsPlugin({
        context: __dirname,
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20,
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: "[name].js.map",
      }),
    ],
    optimization: {
      splitChunks: { chunks: "all" },
    },
  },
  common
);
