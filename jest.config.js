export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const transform = {
  '^.+\\.ts$': 'ts-jest',
};
export const moduleFileExtensions = ['ts', 'js'];
export const globals = {
  'ts-jest': {
    isolatedModules: true,
  },
};
export const testMatch = ['**/*.test.ts'];
export const verbose = true;
