import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";
interface ExecutorOptions {
  verbose?: boolean;
  env?: "debug" | "develop" | "main";
}
//! 수정 예정 배포 커맨드로 쓰면 어떨까?
export default function executor(options: ExecutorOptions, context: ExecutorContext) {
  const { env } = options;
  const { projectRoot, projectName, runInProject, runInWorkspace } = getExecutor(context);
  if (!env) {
    throw new Error(
      "env is required. Please provide env. env : debug |development | main \n        ex)nx release-ios --env=debug\n"
    );
  }
  runInWorkspace(
    `cross-env NEXT_PUBLIC_ENV=${env} NEXT_PUBLIC_OPERATION_MODE=cloud APP_OPERATION_MODE=release nx build-csr ${projectName}  `
  );
  // * 1. Add ios platform
  const isAdded = fs.existsSync(`${projectRoot}/ios/App/Podfile`);
  if (!isAdded) {
    runInProject(`npx cap add ios`);
    runInProject(`npx @capacitor/assets  generate`);
  } else logger.info(`iOS already added, skip adding process`);

  //* 2. Sync and run
  runInProject(`cross-env APP_OPERATION_MODE=release  npx cap sync ios`);
  //!하려면 xcodebuild에서 device 정보 받아오고, 리스트로 선택하게 한 다음 xcodebuild cli로 release해야됨.
  return { success: true };
}
