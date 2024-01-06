const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');
defaultConfig.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = defaultConfig;
