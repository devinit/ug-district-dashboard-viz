module.exports = {
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['react', 'import', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'newline-before-return': 'error',
    eqeqeq: ['error', 'always'],
    'prefer-template': 'error',
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
  },
  globals: {
    d3: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
