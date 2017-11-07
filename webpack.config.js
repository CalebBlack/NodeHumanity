module.exports = {
  output: {
    filename: "source.js",
    path: __dirname +"/build"
  },
  module: {
    loaders: [
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
