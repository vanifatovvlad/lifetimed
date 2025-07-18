import { createJsWithTsEsmPreset } from "ts-jest"

export default {
  ...createJsWithTsEsmPreset(),
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/*.test.ts'],
};