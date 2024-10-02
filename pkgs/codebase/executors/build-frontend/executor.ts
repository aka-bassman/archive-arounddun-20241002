import { ExecutorContext } from "@nx/devkit";
import { explicitPackages, getDependencies, getExecutor, makeDocker, syncAssets } from "@codebase/devkit";
import fsPromise from "fs/promises";

interface ExecutorOptions {
  verbose?: boolean;
  environment: "debug" | "develop" | "main";
}
export default async function executor(
  { environment = "debug" }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectRoot, projectName, runTask } = getExecutor(context);
  const { libDeps } = await getDependencies(projectName);
  await syncAssets({ workspaceRoot, projectRoot, libDeps });
  //! Nextjs는 환경변수를 build time에 그냥 하드코딩으로 값을 넣어버림.
  // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#runtime-environment-variables
  process.env.NEXT_PUBLIC_APP_NAME = projectName;
  process.env.NEXT_PUBLIC_ENV = environment;
  await runTask("build-next", "production");
  await fsPromise.cp(
    `${workspaceRoot}/pkgs/core/next/next.base.js`,
    `${workspaceRoot}/dist/apps/${projectName}/frontend/next.base.js`
  );
  makeDocker("frontend", environment, { workspaceRoot, projectName });
  await explicitPackages({ workspaceRoot, projectName, type: "frontend" });
  return { success: true };
}
