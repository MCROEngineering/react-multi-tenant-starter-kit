const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-source-map',
  mode: 'development',
  entry: {
    libs: [
      'classnames',
      'react',
      'react-dom',
      'react-hot-loader',
      'react-redux',
      'react-router',
      'react-router-dom',
      'redux',
      'redux-thunk',
      'reselect',
    ],
  },

  output: {
    filename: '[name].dll.js',
    path: path.resolve('dll'),
    library: '[name]_dll',
  },

  plugins: [
    new webpack.DllPlugin({
      path: 'dll/[name]-manifest.json',
      name: '[name]_dll',
    }),
  ],
};
