const { composePlugins, withNx } = require("@nx/next");
const withAnalyze = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });
const runtimeCaching = require("@imbios/next-pwa/cache");
const commandType = process.env.NX_TASK_TARGET_TARGET?.includes("serve")
  ? "serve"
  : process.env.NX_TASK_TARGET_TARGET?.includes("build")
    ? "build"
    : "deploy";
const withPWA = require("@imbios/next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: commandType === "serve",
});
const devDomain = "akamir.com";
const libs = ["game", "mint", "platform", "social", "shared", "util"];

/**
 * @type { (config: import('@nx/next/plugins/with-nx').WithNxOptions) => import('@nx/next/plugins/with-nx').WithNxOptions }
 **/
const withBase = (appName, config, routes = []) => {
  return composePlugins(
    withNx,
    withPWA,
    withAnalyze
  )({
    ...config,
    env: {
      ...config.env,
      basePaths: routes.map(({ basePath }) => basePath).join(","),
    },
    transpilePackages: ["swiper", "ssr-window", "dom7"],
    reactStrictMode: commandType === "serve" ? false : true,
    nx: { svgr: false },
    modularizeImports: {
      "react-icons/?(((\\w*)?/?)*)": {
        transform: "@react-icons/all-files/{{ matches.[1] }}/{{member}}",
        skipDefaultConversion: true,
      },
      lodash: { transform: "lodash/{{member}}", preventFullImport: true },
      ...Object.fromEntries(
        [appName, ...libs].reduce(
          (acc, lib) => [
            ...acc,
            [`@${lib}/ui`, { transform: `@${lib}/ui/{{member}}`, skipDefaultConversion: true }],
            [`@${lib}/next`, { transform: `@${lib}/next/{{member}}`, skipDefaultConversion: true }],
            [`@${lib}/common`, { transform: `@${lib}/common/{{member}}`, skipDefaultConversion: true }],
            [`@${lib}/client`, { transform: `@${lib}/lib/{{ camelCase member }}`, skipDefaultConversion: true }],
          ],
          [
            ["@contract", { transform: `@contract/src/{{member}}`, skipDefaultConversion: true }],
            [`@core/next`, { transform: `@core/next/{{member}}`, skipDefaultConversion: true }],
            [`@core/common`, { transform: `@core/common/{{member}}`, skipDefaultConversion: true }],
          ]
        )
      ),
      ...(config.modularizeImports ?? {}),
    },
    images: {
      formats: ["image/avif", "image/webp"],
      ...(config.images ?? {}),
      remotePatterns: [
        ...(config.images?.remotePatterns ?? []),
        ...routes
          .map(({ domains }) => [
            ...(domains?.main?.map((domain) => ({ protocol: "https", hostname: `**.${domain}` })) ?? []),
            ...(domains?.develop?.map((domain) => ({ protocol: "https", hostname: `**.${domain}` })) ?? []),
            ...(domains?.debug?.map((domain) => ({ protocol: "https", hostname: `**.${domain}` })) ?? []),
          ])
          .flat(),
        { protocol: "https", hostname: `**.${devDomain}` },
      ],
    },
    webpack: (config) => {
      // react-pdf error fix
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      return config;
    },
    async redirects() {
      return routes
        .map(({ basePath, domains }) => [
          { basePath, domain: `${basePath}-debug.${devDomain}` },
          { basePath, domain: `${basePath}-develop.${devDomain}` },
          { basePath, domain: `${basePath}-main.${devDomain}` },
          ...(domains?.main?.map((domain) => ({ basePath, domain })) ?? []),
          ...(domains?.develop?.map((domain) => ({ basePath, domain })) ?? []),
          ...(domains?.debug?.map((domain) => ({ basePath, domain })) ?? []),
        ])
        .flat()
        .map(({ basePath, domain }) => ({
          source: `/:locale/${basePath}/:path*`,
          has: [{ type: "host", value: domain }],
          permanent: true,
          destination: "/:locale/:path*",
        }));
    },
    async rewrites() {
      return routes
        .map(({ basePath, domains }) => [
          { basePath, domain: `${basePath}-debug.${devDomain}` },
          { basePath, domain: `${basePath}-develop.${devDomain}` },
          { basePath, domain: `${basePath}-main.${devDomain}` },
          ...(domains?.main?.map((domain) => ({ basePath, domain })) ?? []),
          ...(domains?.develop?.map((domain) => ({ basePath, domain })) ?? []),
          ...(domains?.debug?.map((domain) => ({ basePath, domain })) ?? []),
        ])
        .flat()
        .map(({ basePath, domain }) => [
          {
            source: "/:locale",
            has: [{ type: "host", value: domain }],
            destination: `/:locale/${basePath}`,
          },
          {
            source: `/:locale/:path((?!${basePath}$)(?!admin(?:/|$)).*)`,
            has: [{ type: "host", value: domain }],
            destination: `/:locale/${basePath}/:path*`,
          },
        ])
        .flat();
    },
  });
};
module.exports = { withBase };
