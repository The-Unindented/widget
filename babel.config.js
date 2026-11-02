module.exports = {
  presets: [
    ['@react-native/babel-preset', { 
      decorators: { 
        legacy: false 
      } 
    }],
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
        root: './src',
      },
    ],
    [
      'babel-plugin-transform-import-meta',
      {
        jsExtensions: ['.js', '.ts', '.tsx'],
      },
    ],
  ],
};