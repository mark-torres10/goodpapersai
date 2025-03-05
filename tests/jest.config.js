module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  roots: ['<rootDir>/server'],
  testMatch: ['**/*.test.js', '**/*.test.ts'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  transform: {},
}; 