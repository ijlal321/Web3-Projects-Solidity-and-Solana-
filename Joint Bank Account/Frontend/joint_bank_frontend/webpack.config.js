const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Your main JavaScript file
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Your HTML file
      inject: 'body', // Inject JS into the body
    }),
  ],
  mode: 'production', // For production build
};
