import { getJestProjects } from "@nx/jest";
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  projects: getJestProjects() as string[],
  collectCoverageFrom: [
    "apps/**/*.ts",
    "libs/**/*.ts",
    "pkgs/**/*.ts",
    "!main.ts",
    "!**/*.module.ts",
    "!**/*.input.ts",
    "!**/*.entity.ts",
    "!**/*.args.ts",
    "!**/*.helper.ts",
    "!**/*.types.ts",
    "!**/*.entities.ts",
    "!**/*.helpers.ts",
    "!**/node_modules/**",
  ],
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 50,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: "node",
  testTimeout: 30000,
  detectOpenHandles: true,
};
export default config;
