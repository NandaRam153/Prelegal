import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // @react-pdf/renderer uses canvas/browser APIs unavailable in jsdom
    '^@react-pdf/renderer$': '<rootDir>/__mocks__/@react-pdf/renderer.ts',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/components/**/*.tsx',
    'src/app/**/*.tsx',
    '!**/*.d.ts',
  ],
};

export default createJestConfig(config);
