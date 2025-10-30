const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    mainPage: './src/typescript/mainPageScript.ts',
    bookAppointmentPage: './src/typescript/bookAppointmentPageScript.ts',
    loginPage: './src/typescript/loginPageScript.ts',
    registrationPage: './src/typescript/registrationPageScript.ts',
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
        { from: 'src/html', to: '' },
        { from: 'src/assets', to: 'assets', noErrorOnMissing: true }
      ],
    }),
  ],
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /^\/$/, to: '/mainPage.html' },
    //   ],
    // },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    ],
    // open: {
    //   target: ['mainPage.html'],
    // },
    port: 8080,
  },
};
