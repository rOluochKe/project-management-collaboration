module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([jt]sx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
