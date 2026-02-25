const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const dotenv = require('dotenv');

const env = dotenv.config().parsed || {};

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  entry: './server/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-ssr'),
    filename: 'server.js',
    library: { type: 'commonjs2' },
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
          }
        }
      },
      {
        test: /\.(s?css|svg|png|jpg|jpeg|gif|woff2?|ttf|eot)$/,
        loader: 'null-loader'
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'containerSsr',
      library: { type: 'commonjs-module' },
      remoteType: 'commonjs-module',
      remotes: {
        Flights: `flights@${env.REACT_APP_FLIGHTS_REMOTE_MFE || 'http://localhost:4101'}/ssrRemoteEntry.js`,
        Hotels: `hotels@${env.REACT_APP_HOTELS_REMOTE_MFE || 'http://localhost:4102'}/ssrRemoteEntry.js`
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ],
  externalsPresets: { node: true }
};
