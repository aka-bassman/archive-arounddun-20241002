import * as imageHosting from "./imageHosting/imageHosting.document";
import * as prompt from "./prompt/prompt.document";
import * as result from "./result/result.document";
import * as setting from "./setting/setting.document";
import * as summary from "./summary/summary.document";
import * as test from "./test/test.document";
import * as user from "./user/user.document";
import { cnst } from "./cnst";
import { dbOf } from "@core/server";

export { db as shared } from "@shared/server";
export { db as social } from "@social/server";
export type * from "./imageHosting/imageHosting.document";
export type * from "./prompt/prompt.document";
export type * from "./result/result.document";
export type * from "./test/test.document";
export type * from "./_syrs/syrs.document";
export type * from "./user/user.document";
export type * from "./summary/summary.document";
export type * from "./setting/setting.document";

export const settingDb = dbOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.SettingModel,
  setting.SettingMiddleware,
  cnst.shared.Setting,
  cnst.shared.SettingInsight,
  cnst.shared.SettingFilter
);
export const summaryDb = dbOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.SummaryModel,
  summary.SummaryMiddleware,
  cnst.shared.Summary,
  cnst.shared.SummaryInsight,
  cnst.shared.SummaryFilter
);
export const userDb = dbOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.UserModel,
  user.UserMiddleware,
  cnst.User,
  cnst.UserInsight,
  cnst.UserFilter,
  cnst.UserSummary
);
export const testDb = dbOf(
  "test" as const,
  test.TestInput,
  test.Test,
  test.TestModel,
  test.TestMiddleware,
  cnst.Test,
  cnst.TestInsight,
  cnst.TestFilter,
  cnst.TestSummary
);
export const resultDb = dbOf(
  "result" as const,
  result.ResultInput,
  result.Result,
  result.ResultModel,
  result.ResultMiddleware,
  cnst.Result,
  cnst.ResultInsight,
  cnst.ResultFilter,
  cnst.ResultSummary
);
export const promptDb = dbOf(
  "prompt" as const,
  prompt.PromptInput,
  prompt.Prompt,
  prompt.PromptModel,
  prompt.PromptMiddleware,
  cnst.Prompt,
  cnst.PromptInsight,
  cnst.PromptFilter,
  cnst.PromptSummary
);
export const imageHostingDb = dbOf(
  "imageHosting" as const,
  imageHosting.ImageHostingInput,
  imageHosting.ImageHosting,
  imageHosting.ImageHostingModel,
  imageHosting.ImageHostingMiddleware,
  cnst.ImageHosting,
  cnst.ImageHostingInsight,
  cnst.ImageHostingFilter,
  cnst.ImageHostingSummary
);
