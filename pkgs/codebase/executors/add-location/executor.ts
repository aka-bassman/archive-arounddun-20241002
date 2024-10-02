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
  const { projectRoot, projectName, runInWorkspace } = getExecutor(context);
  // * 1. Check if android and ios platform is added
  const isExistAndroid = fs.existsSync(`${projectRoot}/android/build.gradle`);
  const isExistIos = fs.existsSync(`${projectRoot}/ios/App/Podfile`);
  if (!isExistAndroid || !isExistIos) {
    logger.info(
      `Platform is not added, Please add platform first\n nx serve-android ${projectName} \n nx serve-ios ${projectName}`
    );
    return { success: false };
  }

  //* 2. check if the location plugin is installed
  const androidManifest = fs.readFileSync(`${projectRoot}/android/app/src/main/AndroidManifest.xml`, "utf8");
  const iosPlist = fs.readFileSync(`${projectRoot}/ios/App/App/Info.plist`, "utf8");
  const isPluginInstalled = androidManifest.includes(
    `<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`
  );
  const isPluginInstalledIos = iosPlist.includes(`<key>NSLocationAlwaysUsageDescription</key>`);
  if (isPluginInstalled && isPluginInstalledIos) {
    logger.error(`Location plugin is already installed`);
    return { success: false };
  }
  //* 3. Sync and run
  runInWorkspace(
    `npx trapeze run ./pkgs/codebase/executors/add-location/config.yaml --android-project ${projectRoot}/android --ios-project ${projectRoot}/ios/App`
  );

  return { success: true };
}
