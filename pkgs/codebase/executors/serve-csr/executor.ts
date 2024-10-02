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
  await syncAssets({ workspaceRoot, projectRoot, libDeps });
  await runTask("serve-react", "development");
  return { success: true };
}
