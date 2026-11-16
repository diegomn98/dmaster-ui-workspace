// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Dogfood the per-component entry points (0.12+): the root `@dmaster/ui`
      // is deprecated — import each symbol from its own `@dmaster/ui/<name>`.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@dmaster/ui',
              message:
                "Deprecated root entry point — import from the component's entry point, e.g. '@dmaster/ui/button' or '@dmaster/ui/core'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
]);
