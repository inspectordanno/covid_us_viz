const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  console.log(isDevelopment);

  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          loader: "babel-loader",
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          oneOf: [
            {
              test: /\.module\.s?css$/,
              use: [
                isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                  options: { modules: true },
                },
                "sass-loader",
              ],
            },
            {
              use: [
                isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader",
              ],
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isDevelopment ? "[name].css" : "[name].[hash].css",
        chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
      }),
    ],
    devtool: "eval-cheap-module-source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true,
    },
    resolve: {
      extensions: [".js", ".scss"],
    }
  };
};
