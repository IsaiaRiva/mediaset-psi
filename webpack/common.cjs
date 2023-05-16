module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\/(?!idb)/, /(libs)/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              [
                "@babel/plugin-transform-spread",
                {
                  "loose": true
                }
              ]
            ],
            sourceMap: true
          },
        },
      },
    ],
  },
};
