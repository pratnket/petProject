const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 設置應用目錄路徑
const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

// 要編譯的 Node modules
const compileNodeModules = [
  // 將需要編譯的 React Native 模組加入這裡
  'react-native-vector-icons',
  'react-native-calendars', // ✅ enable TS compatibility for web
  'react-native-swipe-gestures',
  // 如果需要其他庫，可以加入這裡
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

// Babel 配置
const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'App.tsx'),
    path.resolve(__dirname, 'src'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web'], // 設置 react-native-web 來適配 Web
    },
  },
};

// 解決 ESM fullySpecified 錯誤
const esFixConfiguration = {
  test: /\.js$/,
  resolve: {
    fullySpecified: false,
  },
};

// SVG 和圖片的 Loader 配置
const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(png|jpe?g|gif|webp)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ],
};

module.exports = {
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      esFixConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },

    compress: true,
    port: 8080,
  },
};
