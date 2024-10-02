const path = require("path");
const webpack = require("webpack");
const { composePlugins, withNx } = require("@nx/webpack");
const { withReact } = require("@nx/react");
const { EnvironmentPlugin } = require("webpack");

module.exports = composePlugins(withNx({ skipTypeChecking: true }), withReact(), (config) => {
  config.resolve = {
    ...(config.resolve ?? {}),
    alias: {
      ...(config.resolve?.alias ?? {}),
      "next/font/local": path.resolve(__dirname, "./createFont"),
      "next/font/google": path.resolve(__dirname, "./createFont"),
      "next/navigation": path.resolve(__dirname, "../client/router"),
      [`@${process.env.NX_TASK_TARGET_PROJECT}/lib`]: path.resolve(
        __dirname,
        `../../../${process.env.NX_TASK_TARGET_PROJECT}/lib/`
      ),
    },
    fallback: {
      ...(config.resolve?.fallback ?? {}),
      url: require.resolve("url"),
      fs: false,
      vm: require.resolve("vm-browserify"),
      process: require.resolve("process"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
    },
  };
  config.plugins = [
    ...(config.plugins?.filter((plugin) => plugin.constructor.name !== "ForkTsCheckerWebpackPlugin") ?? []),
    //add process plugin
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new EnvironmentPlugin({
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? process.env.NX_TASK_TARGET_PROJECT,
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      NEXT_PUBLIC_OPERATION_MODE: process.env.NEXT_PUBLIC_OPERATION_MODE,
      APP_OPERATION_MODE: process.env.APP_OPERATION_MODE,
      RENDER_ENV: "csr",
    }),
  ];
  return config;
});
