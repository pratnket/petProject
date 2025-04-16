module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.web.tsx'],
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
