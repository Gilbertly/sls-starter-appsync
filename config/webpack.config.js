/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  mode: isLocal ? 'development' : 'production',
  devtool: 'inline-source-map',
  stats: 'normal',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [/nodejs/, /node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  externals: [nodeExternals()],
};
