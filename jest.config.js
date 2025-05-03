/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  globalSetup: '<rootDir>/setup/globalSetup.js',
  testMatch: [ '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)' ],
  testEnvironment: "node",
  transform: {
    '^.+\.tsx?$': ['ts-jest',{}],
  },
};