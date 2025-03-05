/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '^styled-components': '<rootDir>/node_modules/styled-components',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|fast-xml-parser|styled-components|react-is)/)'
  ]
}; 