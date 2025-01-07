const config = {
  testEnvironment: 'node',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
};

export default config;
