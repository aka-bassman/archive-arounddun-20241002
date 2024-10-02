import * as imageHosting from "./imageHosting/imageHosting.constant";
import * as prompt from "./prompt/prompt.constant";
import * as result from "./result/result.constant";
import * as setting from "./setting/setting.constant";
import * as summary from "./summary/summary.constant";
import * as test from "./test/test.constant";
import * as user from "./user/user.constant";
import { cnstOf } from "@core/base";
import { cnst as shared } from "@shared";

export { cnst as shared } from "@shared";
export { cnst as social } from "@social";
export * from "./imageHosting/imageHosting.constant";
export * from "./prompt/prompt.constant";
export * from "./result/result.constant";
export * from "./test/test.constant";
export * from "./_syrs/syrs.constant";
export * from "./user/user.constant";
export * from "./summary/summary.constant";
export * from "./setting/setting.constant";

export const promptCnst = cnstOf(
  "prompt" as const,
  prompt.PromptInput,
  prompt.Prompt,
  prompt.LightPrompt,
  prompt.PromptInsight,
  prompt.PromptFilter,
  prompt.PromptSummary
);
export const resultCnst = cnstOf(
  "result" as const,
  result.ResultInput,
  result.Result,
  result.LightResult,
  result.ResultInsight,
  result.ResultFilter,
  result.ResultSummary
);
export const testCnst = cnstOf(
  "test" as const,
  test.TestInput,
  test.Test,
  test.LightTest,
  test.TestInsight,
  test.TestFilter,
  test.TestSummary
);
export const imageHostingCnst = cnstOf(
  "imageHosting" as const,
  imageHosting.ImageHostingInput,
  imageHosting.ImageHosting,
  imageHosting.LightImageHosting,
  imageHosting.ImageHostingInsight,
  imageHosting.ImageHostingFilter,
  imageHosting.ImageHostingSummary
);
export const settingCnst = cnstOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.LightSetting,
  shared.SettingInsight,
  shared.SettingFilter
);
export const summaryCnst = cnstOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.LightSummary,
  shared.SummaryInsight,
  shared.SummaryFilter
);
export const userCnst = cnstOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.LightUser,
  user.UserInsight,
  user.UserFilter,
  user.UserSummary
);
