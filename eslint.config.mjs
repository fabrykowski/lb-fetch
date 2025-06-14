// noinspection SpellCheckingInspection
//
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules', 'build', '*.*']
  },
  eslint.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true
        }
      ],
      'array-callback-return': [
        'error',
        {
          checkForEach: true
        }
      ],
      camelcase: [
        'error',
        {
          allow: []
        }
      ],
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true
        }
      ],
      // Note: The first element of the array is for the rule severity!
      // The other elements in the array are the identifiers that you want to disallow.
      'id-denylist': ['error'],
      'max-params': [
        'error',
        {
          max: 5
        }
      ],
      'one-var': ['error', 'never'],
      radix: ['error', 'as-needed'],
      'no-magic-numbers': [
        'error',
        {
          ignore: [0]
        }
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true
        }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true
        }
      ],
      ...[
        'capitalized-comments',
        'sort-keys',
        'max-statements',
        'no-continue',
        'no-plusplus',
        'no-ternary',
        'no-undefined',
        'prefer-destructuring',
        'sort-imports'
      ].reduce((rules, name) => {
        rules[name] = 'off';
        return rules;
      }, {})
    }
  }
);
