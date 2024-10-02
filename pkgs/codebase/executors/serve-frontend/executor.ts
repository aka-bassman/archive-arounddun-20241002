import { ExecutorContext } from "@nx/devkit";
import { getDependencies, getExecutor, syncAssets } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
}
export default async function executor(
  options: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectRoot, projectName, runTask } = getExecutor(context);
  const { libDeps } = await getDependencies(projectName);
  process.env.NEXT_PUBLIC_APP_NAME = projectName;
  await syncAssets({ workspaceRoot, projectRoot, libDeps });
  await runTask("serve-next", "development");
  return { success: true };
}
