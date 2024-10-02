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
  // * 1. Add ios platform
  const isAdded = fs.existsSync(`${projectRoot}/ios/App/Podfile`);
  if (!isAdded) {
    runInProject(`npx cap add ios`);
    runInProject(`npx @capacitor/assets  generate`);
  } else logger.info(`iOS already added, skip adding process`);

  //* 2. Sync and run
  runInProject(`npx cap sync ios`);
  if (open) runInProject(`npx cap open ios`);
  runInProject("npx trapeze run config.yaml");
  // runInProject(`cross-env APP_OPERATION_MODE=${operation} npx cap run ios `);
  runInProject(`cross-env APP_OPERATION_MODE=${operation} npx cap run ios `);

  return { success: true };
}
