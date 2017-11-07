const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  output: {
    filename: "source.js",
    path: __dirname +"/build"
  },
  plugins: [
    new UglifyJSPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  },
  entry: "./src/index.js"
}
