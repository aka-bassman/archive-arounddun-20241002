import { ModulesOptions } from "./lib/option";

// * Module Imports
import { generateHost } from "@core/nest";
import { registerAdminModule } from "./lib/admin/_server";
import { registerBannerModule } from "./lib/banner/_server";
import { registerFileModule } from "./lib/file/_server";
import { registerKeyringModule } from "./lib/keyring/_server";
import { registerNotificationModule } from "./lib/notification/_server";
import { registerSettingModule } from "./lib/setting/_server";
import { registerSharedBatchModule, registerSharedScalarModule } from "./lib/_shared/_server";
import { registerSummaryModule } from "./lib/summary/_server";
import { registerUserModule } from "./lib/user/_server";
import { registerBatches as registerUtilBatches, registerModules as registerUtilModules } from "@util/server";

export { env } from "./env/env.server.testing";
export * as db from "./lib/db";
export * as srv from "./lib/srv";
export * as option from "./lib/option";
export { fetch } from "./lib/fetch";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...registerUtilModules(options, true),
    registerSharedScalarModule(),
    registerFileModule(),
    registerUserModule(),
    registerKeyringModule(options.security, generateHost(options)),
    registerAdminModule(options.rootAdminInfo),
    registerNotificationModule(),
    registerBannerModule(),
    registerSettingModule(),
    registerSummaryModule(),
  ];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [registerSharedBatchModule(), ...registerUtilBatches(options, true)];
  return modules;
};
