const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const CompressionPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const deps = require('./package.json').dependencies;

const envFile = dotenv.config().parsed || {};
const envKeys = Object.keys(envFile).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(envFile[key]);
  return acc;
}, {});

const isProd = process.env.NODE_ENV === 'production';
const TEMPLATES_TO_BUILD = envFile.REACT_APP_TEMPLATES
  ? envFile.REACT_APP_TEMPLATES.split(',').map((t) => t.trim())
  : ['template1'];

if (!isProd) {
  console.log('\n🎨 Webpack Configuration:');
  console.log(`   Mode: ${isProd ? 'production' : 'development'}`);
  console.log(`   Templates: ${TEMPLATES_TO_BUILD.join(', ')}`);
  console.log('   Strategy: Code splitting with lazy loading\n');
}

const developmentPlugins = [];
if (!isProd) {
  developmentPlugins.push(
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      context: path.resolve(__dirname, 'src'),
      emitWarning: true,
      emitError: true,
      failOnError: false,
      formatter: 'pretty'
    })
  );
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].container[contenthash].js',
    chunkFilename: '[name].container[contenthash].js',
    publicPath: '/',
    uniqueName: 'container',
    chunkLoadingGlobal: 'webpackChunk_container',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      actions: path.resolve(__dirname, 'src/actions'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      fonts: path.resolve(__dirname, 'src/fonts'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      mapper: path.resolve(__dirname, 'src/mapper'),
      pages: path.resolve(__dirname, 'src/pages'),
      Routes: path.resolve(__dirname, 'src/Routes'),
      Store: path.resolve(__dirname, 'core/Store'),
      styles: path.resolve(__dirname, 'src/styles'),
      Types: path.resolve(__dirname, 'src/Types'),
      utils: path.resolve(__dirname, 'core/utils'),
      coreMFEs: path.resolve(__dirname, 'core/Routes'),
      coreHooks: path.resolve(__dirname, 'core/Hooks'),
      coreAssets: path.resolve(__dirname, 'core/Assets'),
      coreApis: path.resolve(__dirname, 'core/api'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.svg$/i,
        oneOf: [
          {
            issuer: /\.[jt]sx?$/,
            resourceQuery: /react/,
            use: [{ loader: '@svgr/webpack', options: { exportType: 'named' } }]
          },
          {
            issuer: /\.[jt]sx?$/,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  exportType: 'named',
                  prettier: false,
                  svgo: false,
                  svgoConfig: { plugins: [{ removeViewBox: false }] },
                  titleProp: true,
                  ref: true
                }
              },
              {
                loader: 'file-loader',
                options: { name: 'static/media/[name].[hash:8].[ext]' }
              }
            ]
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname), path.resolve(__dirname, 'src'), path.resolve(__dirname, 'templates')],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
          }
        }
      },
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: { namedExport: false, exportLocalsConvention: 'asIs' },
              sourceMap: true
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|webp)$/,
        type: 'asset/resource',
        exclude: /\.svg$/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: isProd ? '[name].[contenthash:8].css' : '[name].css' }),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html'), minify: isProd }),
    ...(isProd
      ? [
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10 * 1024,
            minRatio: 0.8
          })
        ]
      : []),
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'remoteEntry.js',
      remotes: {
        Flights: `flights@${envFile.REACT_APP_FLIGHTS_REMOTE_MFE}/remoteEntry.js`,
        Hotels: `hotels@${envFile.REACT_APP_HOTELS_REMOTE_MFE}/remoteEntry.js`,
        Bus: `bus@${envFile.REACT_APP_BUS_REMOTE_MFE}/remoteEntry.js`,
        Train: `train@${envFile.REACT_APP_TRAIN_REMOTE_MFE}/remoteEntry.js`,
        DMC: `dmc@${envFile.REACT_APP_DMC_REMOTE_MFE}/remoteEntry.js`,
        MyAccounts: `myaccounts@${envFile.REACT_APP_MY_ACCOUNTS_REMOTE_MFE}/remoteEntry.js`
      },
      exposes: {
        './sharedSelectors': './core/Store/sharedSelectors.js',
        './sharedActions': './core/Store/sharedActions.js',
        './sharedComponents': './src/components/sharedComponents.js',
        './sharedStore': './core/Store/store.js'
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] }
      }
    }),
    new webpack.DefinePlugin({
      ...envKeys,
      __AVAILABLE_TEMPLATES__: JSON.stringify(TEMPLATES_TO_BUILD)
    })
  ].concat(developmentPlugins),
  optimization: {
    usedExports: false
  },
  devServer: {
    client: { overlay: false },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    open: true,
    hot: true
  }
};
