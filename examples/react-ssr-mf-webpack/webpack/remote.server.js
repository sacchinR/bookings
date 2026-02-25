const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, '../remote/src/server.js'),
  output: {
    path: path.resolve(__dirname, '../remote/dist/server'),
    filename: 'server.js',
    library: { type: 'commonjs2' },
    publicPath: 'auto'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      library: { type: 'commonjs-module' },
      filename: 'remoteEntry.js',
      exposes: {
        './ssr': path.resolve(__dirname, '../remote/src/server-entry.jsx')
      },
      remoteType: 'commonjs-module',
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
