/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'plugin:@stylistic/all-extends',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@stylistic'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/indent': ['error', 2],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/multiline-ternary': ['error', 'always-multiline', { ignoreJSX: true }],
    '@stylistic/array-element-newline': ['error', 'consistent'],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-paren-newline': ['error', 'multiline'],
    '@stylistic/newline-per-chained-call': ['off'],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
    '@stylistic/operator-linebreak': ['error', 'before'],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/space-before-function-paren': ['error', 'always'],
    '@stylistic/object-curly-newline': ['error', { multiline: true }],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'block-like',
      },
      {
        blankLine: 'always',
        prev: 'block-like',
        next: '*',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
    },
  ],
};
