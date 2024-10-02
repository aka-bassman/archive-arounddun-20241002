import { ExecutorContext } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
}
export default async function executor(
  options: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { runTask } = getExecutor(context);
  await runTask("serve-nest", "development");
  return { success: true };
}
