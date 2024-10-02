import { type ExecutorContext, logger } from "@nx/devkit";
import { getExecutor } from "@codebase/devkit";
import fs from "fs";

interface ExecutorOptions {
  android?: boolean;
  ios?: boolean;
}
export default function executor(
  options: ExecutorOptions = {
    android: true,
    ios: true,
  },
  context: ExecutorContext
) {
  const { projectRoot, runTask, projectName, runInProject, runInWorkspace } = getExecutor(context);
  // * 1. Add android platform
  const isExistAndroid = fs.existsSync(`${projectRoot}/android/build.gradle`);
  const isExistIos = fs.existsSync(`${projectRoot}/ios/App/Podfile`);
  if (!isExistAndroid || !isExistIos) {
    logger.info(
      `Android is not added, Please add platform first\n nx serve-android ${projectName} \n nx serve-ios ${projectName}`
    );
    return { success: false };
  }
  //* 2. check if the camera plugin is installed
  //check if the camera plugin is installed
  const androidManifest = fs.readFileSync(`${projectRoot}/android/app/src/main/AndroidManifest.xml`, "utf8");
  const iosPlist = fs.readFileSync(`${projectRoot}/ios/App/App/Info.plist`, "utf8");
  const isCameraPluginInstalled = androidManifest.includes(
    `<uses-permission android:name="android.permission.READ_CONTACTS" />`
  );
  const isCameraPluginInstalledIos = iosPlist.includes(`<key>NSContactsUsageDescription</key>`);
  if (isCameraPluginInstalled && isCameraPluginInstalledIos) {
    logger.error(`Contact plugin is already installed`);
    return { success: false };
  }
  //* 3. Sync and run
  runInWorkspace(
    `npx trapeze run ./pkgs/codebase/executors/add-contact/config.yaml --android-project ${projectRoot}/android --ios-project ${projectRoot}/ios/App`
  );

  return { success: true };
}
