import fsPromise from "fs/promises";

const buildPackages = ["tsconfig-paths", "typescript"];
const testPackages = ["chance", "ethers"];
const backendPackages = [
  "@apollo/server",
  "@aws-sdk/*",
  "@nestjs/*",
  "@socket.io/redis-adapter",
  "apple-signin",
  "axios",
  "bcryptjs",
  "body-parser",
  "bull",
  "caver-js",
  "cookie",
  "cookie-parser",
  "crypto-js",
  "dataloader",
  "discord.js",
  "events",
  "express",
  "graphql-redis-subscriptions",
  "graphql-subscriptions",
  "graphql-type-json",
  "graphql-upload",
  "image-size",
  "ioredis",
  "ip",
  "lqip",
  "mongoose",
  "netmask",
  "nodemailer",
  "passport*",
  "querystring",
  "redis",
  "rxjs",
  "sharp",
  "socket.io",
  "solapi",
  "uuid",
  "ua-parser-js",
  "@langchain/*",
  "langchain",
  "hnswlib-node",
  "tunnel-ssh",
  "meilisearch",
  "iap",
  "firebase-admin",
];
const frontendPackages = [
  "@capacitor/*",
  "@formatjs/intl-localematcher",
  "@imbios/next-pwa",
  "@marsidev/react-turnstile",
  "@metamask/providers",
  "@next/*",
  "@nx/next",
  "@radix-ui/*",
  "@react*",
  "@tailwindcss/*",
  "@udecode/*",
  "@use-gesture/*",
  "@walletconnect/*",
  "capacitor-plugin-safe-area",
  "chart.js",
  "chartjs-adapter-dayjs-4",
  "clsx",
  "file-saver",
  "immer",
  "js-cookie",
  "negotiator",
  "next",
  "next-themes",
  "os",
  "qrcode.react",
  "react*",
  "simple-peer",
  "tailwind*",
  "zustand",
];
const csrPackages = ["expo"];

const explicitDependencies = (
  packageJson: { dependencies: { [key: string]: any } },
  type: "backend" | "frontend"
): { [key: string]: any } => {
  const removePatterns =
    type === "backend"
      ? [...buildPackages, ...testPackages, ...frontendPackages, ...csrPackages]
      : [...buildPackages, ...testPackages, ...backendPackages];
  const removeRegexPatterns = removePatterns.map((pattern) => new RegExp("^" + pattern.replace(/\*/g, ".*") + "$"));
  const newPackageJson = { ...packageJson, dependencies: { ...packageJson.dependencies } };
  Object.keys(newPackageJson.dependencies).forEach((key) => {
    removeRegexPatterns.forEach((regex) => {
      if (regex.test(key)) newPackageJson.dependencies[key] = undefined;
    });
  });
  return newPackageJson;
};

export const explicitPackages = async ({
  workspaceRoot,
  projectName,
  type,
}: {
  workspaceRoot: string;
  projectName: string;
  type: "backend" | "frontend";
}) => {
  const packageJson = JSON.parse(
    await fsPromise.readFile(`${workspaceRoot}/dist/apps/${projectName}/frontend/package.json`, "utf8")
  ) as { dependencies: { [key: string]: any } };
  const newPackageJson = explicitDependencies(packageJson, "frontend");
  await fsPromise.writeFile(
    `${workspaceRoot}/dist/apps/${projectName}/frontend/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  );
};
