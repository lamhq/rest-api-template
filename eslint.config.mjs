// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // global ignore config to include only files in `src`directory
  {
    ignores: ['*', '!src'],
  },

  // configuration for Jest test files
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    ...pluginJest.configs['flat/all'],
  },

  // additional rules for Jest test files
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      // allow using `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` hooks
      'jest/no-hooks': 'off',

      // allow test title be written in any case
      'jest/prefer-lowercase-title': 'off',

      // allow mocking operations
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // application rules
  {
    rules: {
      // allow NestJS module classes
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
