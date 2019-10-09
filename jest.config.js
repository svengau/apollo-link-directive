module.exports = {
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      babelConfig: false,
      mapCoverage: true,
      diagnostics: {
        ignoreCodes: [
          151001, // Suppress esModuleInterop suggestion
        ],
      },
    },
  },
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};
