import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";
interface ExecutorOptions {
  verbose?: boolean;
  environment?: "debug" | "develop" | "main";
}

export default function executor(options: ExecutorOptions, context: ExecutorContext) {
  const { environment } = options;
  const { projectRoot, projectName, runInProject, runInWorkspace } = getExecutor(context);
  if (!environment) {
    throw new Error(
      "environment is required. Please provide environment. environment : debug |development | main \n        ex)nx release-ios --environment=debug\n"
    );
  }
  runInWorkspace(
    `cross-env NEXT_PUBLIC_ENV=${environment} NEXT_PUBLIC_OPERATION_MODE=cloud APP_OPERATION_MODE=release nx build-csr ${projectName}  `
  );
  // * 1. Add android platform
  const isAdded = fs.existsSync(`${projectRoot}/android/App/Podfile`);
  if (!isAdded) {
    runInProject(`npx cap add android`);
    runInProject(`npx @capacitor/assets  generate`);
  } else logger.info(`android already added, skip adding process`);

  //* 2. Sync and run
  runInProject(`cross-env APP_OPERATION_MODE=release  npx cap sync android`);
  //!안드는 해보는 중
  return { success: true };
}
