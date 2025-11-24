// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Polyfills funcionais (que você já instalou)
  stream: require.resolve('stream-browserify'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  crypto: require.resolve('crypto-browserify'),
  url: require.resolve('url'),
  zlib: require.resolve('browserify-zlib'),
  vm: require.resolve('vm-browserify'),
  events: require.resolve('events'),
  buffer: require.resolve('buffer'),
  
  // Mocks vazios (para enganar o WS e permitir o build)
  net: require.resolve('node-libs-react-native/mock/net'),
  tls: require.resolve('node-libs-react-native/mock/tls'),
  fs: require.resolve('node-libs-react-native/mock/empty'),
  path: require.resolve('node-libs-react-native/mock/empty'),
};

module.exports = config;