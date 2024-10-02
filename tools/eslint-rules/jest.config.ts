/* eslint-disable */
export default {
  displayName: "eslint-rules",
  preset: "../../pkgs/core/nest/jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/tools/eslint-rules",
};
