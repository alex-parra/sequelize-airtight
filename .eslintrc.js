module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  ignorePatterns: ['node_modules', 'lib'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2017, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        // 'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
      },
    },
  ],
};
