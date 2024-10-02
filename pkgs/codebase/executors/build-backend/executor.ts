import { ExecutorContext } from "@nx/devkit";
import { getExecutor, makeDocker } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
  environment?: "debug" | "develop" | "main";
}
export default async function executor(
  { environment = "debug" }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectName, runTask } = getExecutor(context);
  await runTask("build-nest", "production");
  makeDocker("backend", environment, { workspaceRoot, projectName });
  return { success: true };
}
