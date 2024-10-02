import fs from "fs";
import fsPromise from "fs/promises";
interface SyncAssetsParams {
  workspaceRoot: string;
  projectRoot: string;
  libDeps: string[];
}
export const syncAssets = async ({ workspaceRoot, projectRoot, libDeps }: SyncAssetsParams) => {
  const projectPublicLibPath = `${workspaceRoot}/${projectRoot}/public/libs`;
  if (fs.existsSync(projectPublicLibPath)) await fsPromise.rm(projectPublicLibPath, { recursive: true });
  const targetDeps = libDeps.filter((dep) => fs.existsSync(`${workspaceRoot}/libs/${dep}/public`));
  await Promise.all(targetDeps.map((dep) => fsPromise.mkdir(`${projectPublicLibPath}/${dep}`, { recursive: true })));
  await Promise.all(
    targetDeps.map((dep) =>
      fsPromise.cp(`${workspaceRoot}/libs/${dep}/public`, `${projectPublicLibPath}/${dep}`, {
        recursive: true,
      })
    )
  );
};
