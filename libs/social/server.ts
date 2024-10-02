import { DynamicModule } from "@nestjs/common";
import { generateHost } from "@core/nest";
import { registerActionLogModule } from "./lib/actionLog/_server";
import { registerBoardModule } from "./lib/board/_server";
import { registerChatRoomModule } from "./lib/chatRoom/_server";
import { registerCommentModule } from "./lib/comment/_server";
import { registerEmojiModule } from "./lib/emoji/_server";
import { registerGroupCallModule } from "./lib/groupCall/_server";
import { registerOrgModule } from "./lib/org/_server";
import { registerReportModule } from "./lib/report/_server";
import { registerServiceDeskModule } from "./lib/serviceDesk/_server";
import { registerSettingModule } from "./lib/setting/_server";
import { registerModules as registerSharedModules } from "@shared/server";
import { registerSocialBatchModule, registerSocialScalarModule } from "./lib/_social/_server";
import { registerStoryModule } from "./lib/story/_server";
import { registerSummaryModule } from "./lib/summary/_server";
import { registerUserModule } from "./lib/user/_server";
import type { ModulesOptions } from "./lib/option";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? registerSharedModules(options, true) : []),
    registerOrgModule(generateHost(options)),
    registerChatRoomModule(),
    registerServiceDeskModule(),
    registerEmojiModule(),
    registerGroupCallModule(),
    registerSettingModule(),
    registerSocialScalarModule(),
    registerActionLogModule(),
    registerBoardModule(),
    registerStoryModule(),
    registerCommentModule(),
    registerReportModule(),
    registerSummaryModule(),
    registerUserModule(),
  ] as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    registerSocialBatchModule(),
    //
  ] as DynamicModule[];
  return modules;
};
export { env } from "./env/env.server.testing";
export * as db from "./lib/db";
export * as srv from "./lib/srv";
export * as option from "./lib/option";
export { cnst } from "./lib/cnst";
export { fetch } from "./lib/fetch";
