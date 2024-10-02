import { ExecutorContext } from "@nx/devkit";
import { createTunnel, getCredentials, getExecutor } from "@codebase/devkit";

interface ExecutorOptions {
  verbose?: boolean;
  environment?: "debug" | "develop" | "main";
  restoreTo?: "debug" | "develop" | "main";
}
export default async function executor(
  { environment = "debug", restoreTo = environment }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { workspaceRoot, projectName, spawnInWorkspace } = getExecutor(context);
  const secret = getCredentials({ workspaceRoot, projectName, environment: restoreTo });
  const mongoAccount = secret.mongo.account.user;
  const localUrl = await createTunnel({ appName: projectName, environment: restoreTo });
  const mongoUri = `mongodb://${mongoAccount.username}:${encodeURIComponent(
    mongoAccount.password
  )}@${localUrl}/${projectName}-${restoreTo}`;
  await spawnInWorkspace("mongorestore", [
    `--uri=${mongoUri}`,
    `--nsFrom=${projectName}-${environment}.*`,
    `--nsTo=${projectName}-${restoreTo}.*`,
    `--drop`,
    `./dump/${projectName}-${environment}`,
  ]);
  return { success: true };
}
