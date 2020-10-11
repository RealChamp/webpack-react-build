const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ];
  }

  return config;
};


const getStyleLoaders = (options) => {
  const loaders = [
    isDev ? 'style-loader' : {
      loader:MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: isDev,
      },
    },
    {
      loader: 'css-loader',
      options: options,
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['autoprefixer'],
        },
      },
    },
  ];
  return loaders;
};

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      inject: true,
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
      },
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: path.resolve(__dirname, 'src/images'), to: path.resolve(__dirname, 'dist') }],
    // }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
          },
          'sass-loader',
        ),
      },
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            modules: true,
          },
          'sass-loader',
        ),
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
        }),
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          modules: true,
        }),
      },
      {
        test: /\.(js|jsx)/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-react',
              ],
            },
          },
          'eslint-loader',
        ],
      },
      {
        test: /\.(ts|tsx)/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|svg|gif)/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|svg)/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: optimization(),
  devServer: {
    port: 8000,
    hot: isDev,
  },
};
