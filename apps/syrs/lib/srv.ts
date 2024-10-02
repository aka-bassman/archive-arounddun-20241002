import { ImageHostingService } from "./imageHosting/imageHosting.service";
import { GetServices } from "@core/server";
import { PromptService } from "./prompt/prompt.service";
import { ResultService } from "./result/result.service";
import { SettingService } from "./setting/setting.service";
import { SummaryService } from "./summary/summary.service";
import { TestService } from "./test/test.service";
import { UserService } from "./user/user.service";
import { srv as shared } from "@shared/server";
import { srv as social } from "@social/server";

export { srv as shared } from "@shared/server";
export { srv as social } from "@social/server";
export { UserService } from "./user/user.service";
export { SummaryService } from "./summary/summary.service";
export { SettingService } from "./setting/setting.service";

const type = process.env.EDGE_WALLPAD;
export { TestService } from "./test/test.service";
export { ResultService } from "./result/result.service";
export { PromptService } from "./prompt/prompt.service";
export { ImageHostingService } from "./imageHosting/imageHosting.service";
export const allSrvs = {
  ...shared.allSrvs,
  ...social.allSrvs,
  UserService,
  SummaryService,
  SettingService,
TestService,
ResultService,
PromptService,
ImageHostingService,
};

export type AllSrvs = GetServices<typeof allSrvs>;
