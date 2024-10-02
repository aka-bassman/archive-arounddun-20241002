const { composePlugins, withNx } = require("@nx/webpack");
const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");
const appName = process.env.NX_TASK_TARGET_PROJECT ?? "unknown";
const GeneratePackageJsonPlugin = require("generate-package-json-webpack-plugin");

module.exports = composePlugins(withNx(), (config) => {
  const tsloaderRule = config.module.rules.find((rule) => rule.loader?.includes("ts-loader"));
  if (tsloaderRule)
    tsloaderRule.exclude = [
      /\.tsx$/, // Explicitly exclude .tsx files
      /\/ui\/.*\.(ts|tsx)$/, // Exclude .ts and .tsx files in any "ui" directory
      /\/client\/.*\.(ts|tsx)$/, // Exclude .ts and .tsx files in any "client" directory
      /\/next\/.*\.(ts|tsx)$/, // Exclude .ts and .tsx files in any "client" directory
      /\.store\.ts$/, // Exclude files ending with .store.ts
    ];
  const basePackage = {
    name: `${appName}/backend`,
    version: "1.0.0",
    main: "./main.js",
    engines: { node: ">= 18" },
  };
  config.plugins.push(new GeneratePackageJsonPlugin(basePackage));

  if (process.env.NX_TASK_TARGET_TARGET !== "serve-backend") return config;
  Object.assign(config, {
    entry: [path.join(__dirname, "../../../node_modules/webpack/hot/poll?100"), `./main.ts`],
    mode: "development",
    output: {
      path: path.join(__dirname, `../../../dist/apps/${appName}/backend`),
      filename: "main.js",
    },
  });
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new RunScriptWebpackPlugin({ name: "main.js", autoRestart: true })
  );
  config.externals.push(nodeExternals({ allowlist: ["webpack/hot/poll?100"] }));
  return config;
});
