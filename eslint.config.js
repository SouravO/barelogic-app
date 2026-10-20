// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'import/no-duplicates': 'off',
    },
  },
]);
