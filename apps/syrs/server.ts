import * as shared from "@shared/server";
import * as social from "@social/server";
import { registerImageHostingModule } from "./lib/imageHosting/_server";
import { registerPromptModule } from "./lib/prompt/_server";
import { registerResultModule } from "./lib/result/_server";
import { registerSettingModule } from "./lib/setting/_server";
import { registerSummaryModule } from "./lib/summary/_server";
import { registerSyrsBatchModule } from "./lib/_syrs/_server";
import { registerTestModule } from "./lib/test/_server";
import { registerUserModule } from "./lib/user/_server";
import type { ModulesOptions } from "./lib/option";

export { fetch } from "./lib/fetch";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const type = process.env.EDGE_WALLPAD;
  const modules = [
    ...shared.registerModules(options, true),
    ...social.registerModules(options, true),
    registerUserModule(),
    registerSummaryModule(),
    registerSettingModule(),
    registerTestModule(),
    registerResultModule(),
    registerPromptModule(),
    registerImageHostingModule(),
  ];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...shared.registerBatches(options, true),
    ...social.registerModules(options, true),
    registerSyrsBatchModule(),
  ];
  return modules;
};
