const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BuildProgressBar = require('progress-bar-webpack-plugin');

const sassThreadLoader = require('thread-loader');

sassThreadLoader.warmup({ workerParallelJobs: 2 }, ['sass-loader', 'postcss-loader', 'css-loader', 'style-loader', 'babel-loader']);

const host = process.env.HOST || 'localhost';
const tenant = process.env.TENANT;
const port = process.env.PORT || 3000;
const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './build');

const stats = {
  assets: true,
  children: false,
  chunks: false,
  hash: false,
  modules: false,
  publicPath: false,
  timings: true,
  version: false,
  warnings: true,
  colors: {
    green: '\u001b[32m',
  },
};

module.exports = function(env) {
  const nodeEnv = env && env.prod ? 'production' : 'development';
  const isProd = nodeEnv === 'production';

  const serviceWorkerBuild = env && env.sw;

  const htmlTemplate = isProd ? 'index.prod.ejs' : 'index.dev.ejs';

  let cssLoader;
  console.log('TENANT =', tenant);
  const plugins = [
    new BuildProgressBar(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
      'tenant': JSON.stringify(tenant)
    }),

    new HtmlWebpackPlugin({
      template: htmlTemplate,
      inject: true,
      production: isProd,
      preload: ['*.css'],
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      sync: /^libs.dll.*$/,
      preload: {
        test: /^0|^main|^style-.*$/,
        chunks: 'all',
      },
    }),
  ];

  if (isProd) {
    plugins.push(CopyWebpackPlugin([path.resolve(__dirname, './public', '404.html')]));
    plugins.push(new ExtractTextPlugin('style-[md5:contenthash:hex:20].css'));

    cssLoader = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'cache-loader',
        {
          loader: 'thread-loader',
          options: {
            workerParallelJobs: 2,
          },
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'collapsed',
            sourceMap: true,
            includePaths: [sourcePath],
          },
        },
      ],
    });
  } else {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dll/libs-manifest.json'), // eslint-disable-line
      }),
      CopyWebpackPlugin([path.resolve(__dirname, './dll/libs.dll.js')])
    );

    cssLoader = [
      'cache-loader',
      {
        loader: 'thread-loader',
        options: {
          workerParallelJobs: 2,
        },
      },
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          module: true,
          importLoaders: 1,
          localIdentName: '[path][name]-[local]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: false,
          includePaths: [sourcePath],
        },
      },
    ];
  }

  if (serviceWorkerBuild) {
    plugins.push(
      new SWPrecacheWebpackPlugin({
        cacheId: 'my-starter-kit',
        filename: 'sw.js',
        maximumFileSizeToCacheInBytes: 800000,
        mergeStaticsConfig: true,
        minify: true,
        runtimeCaching: [
          {
            handler: 'cacheFirst',
            urlPattern: /(.*?)/,
          },
        ],
      })
    );
  }

  const entryPoint = isProd
    ? ['@babel/polyfill', './index.js']
    : [
        '@babel/polyfill',
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${host}:${port}`,
        'webpack/hot/only-dev-server',
        './index.js',
      ];

  return {
    devtool: isProd ? 'cheap-source-map' : 'eval-cheap-module-source-map',
    mode: isProd ? 'production' : 'development',
    context: sourcePath,
    entry: {
      main: entryPoint,
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
        },
      },
      minimizer: isProd
        ? [
            new UglifyJSPlugin({
              parallel: true,
              uglifyOptions: {
                compress: {
                  warnings: false,
                  ie8: false,
                  conditionals: true,
                  unused: true,
                  comparisons: true,
                  sequences: true,
                  dead_code: true,
                  evaluate: true,
                  if_return: true,
                  join_vars: true,
                },
              },
            }),
          ]
        : [],
    },
    output: {
      path: buildDirectory,
      publicPath: '/',
      filename: isProd ? '[name]-[hash:8].js' : '[name].js',
      chunkFilename: isProd ? '[name]-[chunkhash:8].js' : '[name].js',
      hotUpdateChunkFilename: isProd ? '' : '[hash].hot-update.js',
    },
    module: {
      rules: [
        {
          test: /\.(html|svg|jpe?g|png|ttf|woff2?)$/,
          include: sourcePath,
          use: {
            loader: 'file-loader',
            options: {
              name: isProd ? 'static/[name]-[hash:8].[ext]' : 'static/[name].[ext]',
            },
          },
        },
        {
          test: /\.scss$/,
          include: sourcePath,
          use: cssLoader,
        },
        {
          test: /\.(js|jsx)$/,
          include: sourcePath,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workerParallelJobs: 2,
              },
            },
            'babel-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.scss'],
      modules: [path.resolve(__dirname, 'node_modules'), sourcePath],
      symlinks: false,
    },

    plugins,

    performance: isProd && {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: 'warning',
    },

    stats,

    devServer: {
      contentBase: './app',
      publicPath: '/',
      historyApiFallback: true,
      port,
      host,
      hot: !isProd,
      compress: isProd,
      stats,
    },
  };
};
