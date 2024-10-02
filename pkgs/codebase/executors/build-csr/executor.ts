import { ExecutorContext } from "@nx/devkit";
import { getDependencies, getExecutor, syncAssets } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
}
export default async function executor(
  options: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectRoot, projectName, runTask, runInWorkspace } = getExecutor(context);
  const { libDeps, npmDeps } = await getDependencies(projectName);
  await syncAssets({ workspaceRoot, projectRoot, libDeps });

  runInWorkspace(
    `cross-env NEXT_PUBLIC_OPERATION_MODE=${process.env.NEXT_PUBLIC_OPERATION_MODE} NEXT_PUBLIC_ENV=${process.env.NEXT_PUBLIC_ENV} APP_OPERATION_MODE=${process.env.APP_OPERATION_MODE} nx build-react ${projectName}`
  );
  // await runTask(`build-react`, "production");
  return { success: true };
}
