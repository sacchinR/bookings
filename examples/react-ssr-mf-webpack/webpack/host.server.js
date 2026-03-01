const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, '../host/src/server.js'),
  output: {
    path: path.resolve(__dirname, '../host/dist/server'),
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
      name: 'host',
      library: { type: 'commonjs-module' },
      remoteType: 'commonjs-module',
      remotes: {
        remoteApp: `remoteApp@${path.resolve(__dirname, '../remote/dist/server/remoteEntry.js')}`
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
