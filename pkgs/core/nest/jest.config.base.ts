import type { Config } from "@jest/types";

export const withBase = (name: string): Config.InitialOptions => {
  process.env.NEXT_PUBLIC_ENV = "testing";
  process.env.NEXT_PUBLIC_OPERATION_MODE = "local";
  process.env.NEXT_PUBLIC_APP_NAME = name;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.NEXT_PUBLIC_LOG_LEVEL = "debug";
  return {
    displayName: name,
    preset: "../../pkgs/core/nest/jest.preset.js",
    globalSetup: "../../pkgs/core/nest/jest.globalSetup.ts",
    setupFilesAfterEnv: ["../../pkgs/core/nest/jest.setupFilesAfterEnv.ts"],
    globalTeardown: "../../pkgs/core/nest/jest.globalTeardown.ts",
    testMatch: ["**/?(*.)+(test).ts?(x)"],
    testPathIgnorePatterns: ["/node_modules/", "/app/"],
    maxWorkers: 1,
    transform: {
      "signal\\.(test)\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: `../../coverage/libs/${name}`,
  };
};
