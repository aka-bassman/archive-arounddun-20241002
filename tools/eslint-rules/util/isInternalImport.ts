import fs from "fs";
const projectRoot = process.cwd();
const libNames = [...fs.readdirSync(`${projectRoot}/libs`), ...fs.readdirSync(`${projectRoot}/pkgs`)];
const internalImportSet = new Set([
  ...libNames.map((libName) => `@${libName}`),
  "react-icons",
  "react",
  "next",
  "@radix-ui",
  "@playwright",
  ".",
  "..",
]);
export const isInternalImport = (importPaths: string[], appName: string | null) => {
  if (internalImportSet.has(importPaths[0])) return true;
  else if (importPaths[0] === appName) return true;
  else return false;
};
