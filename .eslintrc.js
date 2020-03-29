module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'eslint-config-prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'eslint-plugin-prettier',
    'eslint-plugin-jest',
  ],
  rules: {
      "prettier/prettier": 2
  },
};
