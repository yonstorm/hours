module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  globals: {
    jest: {
      extends: '.babel.config.js',
    },
  },
  moduleFileExtensions: ['js'],
  roots: [
    '<rootDir>packages',
  ],
};
