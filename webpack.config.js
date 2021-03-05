const path = require('path');
const webpack = require('webpack');
require("@babel/register");
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
} );

const config = {
  entry: {
    'bundle.js': ['@babel/polyfill', './src/index.js', './src/useAxios.js', './src/useCoda.js', './src/useMaps.js']
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  module: {
    rules : [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.CODA_API_KEY': JSON.stringify(dotenv.parsed.CODA_API_KEY)
    }),
  ],
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  watch: false,
  devtool: 'source-map',
};

module.exports = config;
