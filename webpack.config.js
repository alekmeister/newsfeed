const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlInlineScriptWebpackPlugin = require('html-inline-script-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');

const mode = process.env.NODE_ENV || 'production';

const config = {
  mode,
  entry: {
    main: './src/index.tsx',
    initColorScheme: './src/features/colorScheme/initColorScheme.ts',
    sw: './src/features/serviceWorker/service.worker.ts',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /service\.worker\.ts/,
        loader: 'ts-loader',
        type: 'asset/resource',
        generator: {
          filename: 'sw.js',
        },
      },
      {
        test: /\.webmanifest$/i,
        use: 'webpack-webmanifest-loader',
        type: 'asset/resource',
      },
      {
        test: /\.(svg|jpg|png)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /worker\.ts/],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@components': path.resolve('./src/components'),
      '@features': path.resolve('./src/features'),
      '@app': path.resolve('./src/app'),
      '@images': path.resolve('./src/images'),
    },
  },
  optimization: {
    runtimeChunk: mode === 'production' ? false : 'single', // Рантайм код вебпака будет сгенерен только 1 раз
    splitChunks: {
      chunks: 'all', // Создает чанк из node_modules (этот чанк называют вендорами) и нашего кода из src. При изменении кода в src он не изменяется. Кода мы задеплоим сайт, те пользователи у которых уже был этот чанк просто достанут из кеша и не будут заново все грузить
    },
    minimizer: [`...`, new CSSMinimizerWebpackPlugin()], // '... =>, без него перетираются все остальные минимайзеры такие как tenzerPlugin'
  },
  plugins: [
    new BundleAnalyzerPlugin({ openAnalyzer: false }), // Изменить на true если надо посмотреть аналитику
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      favicon: './src/images/favicon.ico',
      excludeChunks: ['sw'], // По умолчанию, все скрипты, описанные в entry:{} добавляются в index.html в тег <script/>. Но мы можем убрать это поведение, добавив необходимый ключ entry в excludeChunks
    }),
    new HtmlInlineScriptWebpackPlugin([/initColorScheme\..+\.js$/]),
    new MiniCssExtractPlugin({
      filename: 'bundle.[contenthash].css',
    }),
    new StylelintPlugin({
      files: 'src/{**/*,*}.css', // Огромный красный экран при ошибках в стилях
    }),
    new ESLintPlugin({
      files: 'src/{**/*,*}.{tsx,ts}', // Огромный красный экран при ошибках в файлах
    }),
  ],
  devServer: {
    client: {
      overlay: false,
    },
    hot: true,
    open: false,
    historyApiFallback: {
      disableDotRule: true, //Позволяет использовать в урле точку (http://localhost:8080/karpov.courses)
    },
  },
  devtool: mode === 'production' ? 'hidden-source-map' : 'eval-cheap-module-source-map',
};

if (process.env.SENTRY_RELEASE) {
  config.plugins.push(
    new SentryPlugin({
      include: './dist',
      release: process.env.SENTRY_RELEASE,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'newsfeed-hf',
      project: 'newsfeed-web',
    })
  );
}

module.exports = config;
