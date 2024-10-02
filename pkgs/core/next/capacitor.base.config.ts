import { CapacitorConfig } from "@capacitor/cli";
import os from "os";

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    if (!iface) continue;
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) return alias.address;
    }
  }
  return "127.0.0.1"; // fallback to localhost if no suitable IP found
};

export const withBase = (applyConfig: (config: CapacitorConfig) => CapacitorConfig) => {
  const projectName = process.env.NX_TASK_TARGET_PROJECT;
  if (!projectName) throw new Error("projectName is not defined, please run with nx command");
  const ip = getLocalIP();
  const baseConfig: CapacitorConfig = {
    appId: `com.${projectName}.app`,
    appName: projectName,
    webDir: `../../dist/apps/${projectName}/csr/`,
    bundledWebRuntime: false,
    server:
      process.env.APP_OPERATION_MODE !== "release"
        ? {
            androidScheme: "http",
            url: `http://${ip}:4201`,
            cleartext: true,
            allowNavigation: [`http://${ip}:8080/*`],
          }
        : undefined,
    plugins: {
      CapacitorCookies: { enabled: true },
    },
  };
  return applyConfig(baseConfig);
};
