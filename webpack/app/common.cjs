const path = require("path");
const html = require("html-webpack-plugin");
const copy = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("../common.cjs");

module.exports = merge(common, {
  name: "app",
  entry: {
    main: "./src/lib/js/app.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "../../dist/app/"),
  },
  plugins: [
    new html({
      filename: "index.html",
      template: path.resolve(
        __dirname,
        "..",
        "..",
        "index.html"
      ),
      chunks: ["main"],
    }),
    new copy({
      patterns: [
        { from: path.resolve(__dirname, "../../third_party"), to: "third_party" },
        { from: path.resolve(__dirname, "../../css"), to: "css" },
        { from: path.resolve(__dirname, "../../images"), to: "images" },
      ],
    }),
  ],
});
