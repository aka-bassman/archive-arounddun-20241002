import * as fs from "fs";

export interface AppInfo {
  appName: string;
  projectConfig: any;
}

export interface LibInfo {
  libName: string;
  projectConfig: any;
}
export const getScriptExecutor = () => {
  const workspaceRoot = process.cwd();
  const apps: AppInfo[] = fs
    .readdirSync(`${workspaceRoot}/apps`)
    .filter((appName) => {
      const isDirectory = fs.lstatSync(`${workspaceRoot}/apps/${appName}`).isDirectory();
      if (!isDirectory) return false;
      const hasProjectJson = fs.existsSync(`${workspaceRoot}/apps/${appName}/project.json`);
      if (!hasProjectJson) return false;
      return true;
    })
    .map((appName) => {
      const projectConfig = JSON.parse(
        fs.readFileSync(`${workspaceRoot}/apps/${appName}/project.json`, "utf8")
      ) as Record<string, any>;
      return { appName, projectConfig };
    });
  const libs: LibInfo[] = fs
    .readdirSync(`${workspaceRoot}/libs`)
    .filter((libName) => {
      const isDirectory = fs.lstatSync(`${workspaceRoot}/libs/${libName}`).isDirectory();
      if (!isDirectory) return false;
      const hasProjectJson = fs.existsSync(`${workspaceRoot}/libs/${libName}/project.json`);
      if (!hasProjectJson) return false;
      return true;
    })
    .map((libName) => {
      const projectConfig = JSON.parse(
        fs.readFileSync(`${workspaceRoot}/libs/${libName}/project.json`, "utf8")
      ) as Record<string, any>;
      return { libName, projectConfig };
    });
  return {
    apps,
    libs,
    workspaceRoot,
  };
};
