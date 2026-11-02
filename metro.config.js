const path = require('path');
const { mergeConfig } = require('@react-native/metro-config');

const defaultConfig = {
  resolver: {
    assetResolvers: {
      assetExtensions: ['ttf', 'otf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'],
    },
  },
};

module.exports = mergeConfig(defaultConfig, {});