const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    context: path.join(__dirname, 'src'),
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: isDevelopment ? '/' : '/covid_us_viz'
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
                  options: { 
                    modules: {
                      localIdentName: '[local]__[hash:base64:5]'
                    },
                    modules: true,
                    sourceMap: true
                  },
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
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'src', 'index.html') }),
      // new CopyPlugin( 
      //   [
      //     { from: 'data', to: 'data' }
      //   ],
      // ),
    ],
    devtool: isDevelopment ? "eval-cheap-module-source-map" : false,
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true
    },
    resolve: {
      extensions: [".js", ".scss"],
    }
  };
};
