const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    mainPage: './src/mainPageScript.ts',
    bookAppointmentPage: './src/bookAppointmentPageScript.ts',
    loginPage: './src/loginPageScript.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'html', to: '.' },
        { from: 'assets', to: 'assets' },
      ],
    }),
  ],
  mode: 'development',
};

