module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
  collectCoverage: true,
  coverageDirectory: 'coverage/',
  transform: {
    '.(ts)': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', './src/utils'],
  globals: {
    'ts-jest': {
      diagnostics: {
        pathRegex: '/.(spec|test).(ts)$/',
      },
    },
  },
  collectCoverageFrom: ['src/**/*.ts'],
};
