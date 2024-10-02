import { ExecutorContext } from "@nx/devkit";
import { createTunnel , getCredentials , getExecutor } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
  environment?: "debug" | "develop" | "main";
}
export default async function executor(
  { environment = "debug" }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectName, spawnInWorkspace } = getExecutor(context);
  const secret = getCredentials({ workspaceRoot, projectName, environment });
  const mongoAccount = secret.mongo.account.user;
  const localUrl = await createTunnel({ appName: projectName, environment });
  const mongoUri = `mongodb://${mongoAccount.username}:${encodeURIComponent(
    mongoAccount.password
  )}@${localUrl}/${projectName}-${environment}`;
  await spawnInWorkspace("mongodump", [`--uri=${mongoUri}`]);
  return { success: true };
}
