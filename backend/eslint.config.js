const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['eslint.config.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['src/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['tests/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    rules: {
      'no-console': 'off',
    },
  },
];