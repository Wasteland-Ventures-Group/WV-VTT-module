/* globals module */

module.exports = {
  env: {
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        browser: true
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
      rules: {
        'tsdoc/syntax': 'warn'
      }
    }
  ],
  parserOptions: {
    sourceType: 'module'
  }
};
