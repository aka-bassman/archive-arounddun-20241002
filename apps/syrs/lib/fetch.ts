import * as sig from "./sig";
import { cnst } from "./cnst";
import { gqlOf, makeFetch } from "@core/base";
import { fetch as shared } from "@shared";
import { fetch as social } from "@social";

const testGql = gqlOf(cnst.testCnst, sig.TestSignal);
const resultGql = gqlOf(cnst.resultCnst, sig.ResultSignal);
const promptGql = gqlOf(cnst.promptCnst, sig.PromptSignal);
const imageHostingGql = gqlOf(cnst.imageHostingCnst, sig.ImageHostingSignal);
export const settingGql = gqlOf(cnst.settingCnst, sig.SettingSignal, { overwrite: shared.settingGql });
export const summaryGql = gqlOf(cnst.summaryCnst, sig.SummarySignal, { overwrite: shared.summaryGql });
export const userGql = gqlOf(cnst.userCnst, sig.UserSignal, { overwrite: shared.userGql });

export const fetch = makeFetch(shared, social, {
  ...settingGql,
  ...testGql,
  ...resultGql,
  ...promptGql,
  ...imageHostingGql,
...summaryGql,
  ...userGql,
  settingGql,
  testGql,
  resultGql,
  promptGql,
  imageHostingGql,
  summaryGql,
  userGql,
});
