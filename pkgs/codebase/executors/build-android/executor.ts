import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";

interface ExecutorOptions {
  verbose?: boolean;
  open?: boolean;
}

export default function executor(options: ExecutorOptions, context: ExecutorContext) {
  const { projectRoot, runInProject } = getExecutor(context);

  // * 1. Add android platform
  const isAdded = fs.existsSync(`${projectRoot}/android/build.gradle`);
  if (!isAdded) runInProject(`npx cap add android`);
  else logger.info(`Android already added, skip adding process`);

  //* 2. Sync and run
  runInProject(`npx cap sync android`);
  if (options.open) runInProject(`npx cap open android`);
  runInProject(`npx cap build android`);

  return { success: true };
}
