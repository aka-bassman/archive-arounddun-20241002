import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";
interface ExecutorOptions {
  verbose?: boolean;
  open?: boolean;
  env?: "debug" | "develop" | "main";
  operation?: "local" | "release";
}

export default function executor(
  { env = "debug", operation = "local", open }: ExecutorOptions,
  context: ExecutorContext
) {
  const { projectRoot, projectName, runInProject, runInWorkspace } = getExecutor(context);
  runInWorkspace(
    `cross-env NEXT_PUBLIC_ENV=${env} NEXT_PUBLIC_OPERATION_MODE=${
      operation === "local" ? operation : "cloud"
    } APP_OPERATION_MODE=${operation} nx build-csr ${projectName} `
  );

  // * 1. Add android platform
  const isAdded = fs.existsSync(`${projectRoot}/android/build.gradle`);
  if (!isAdded) {
    runInProject(`npx cap add android`);
    runInProject(`npx @capacitor/assets generate`);
  } else logger.info(`Android already added, skip adding process`);

  //* 2. Sync and run
  runInProject(`npx cap sync android`);
  if (open) runInProject(`npx cap open android`);
  runInProject("npx trapeze run config.yaml");
  runInProject(`cross-env APP_OPERATION_MODE=${operation} npx cap run android`);

  return { success: true };
}
