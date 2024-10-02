import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";
interface ExecutorOptions {
  verbose?: boolean;
  open?: boolean;
}

export default function executor(options: ExecutorOptions, context: ExecutorContext) {
  const { projectRoot, runInProject } = getExecutor(context);

  // * 1. Add ios platform
  const isAdded = fs.existsSync(`${projectRoot}/ios/App/Podfile`);
  if (!isAdded) runInProject(`npx cap add ios`);
  else logger.info(`iOS already added, skip adding process`);
  // runInProject(`npx cap open ios`);

  //* 2. Sync and run
  runInProject(`npx cap sync ios`);
  runInProject(`npx cap build ios`);

  return { success: true };
}
