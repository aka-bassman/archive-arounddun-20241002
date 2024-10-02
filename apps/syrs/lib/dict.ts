import { imageHostingDictionary } from "./imageHosting/imageHosting.dictionary";
import { promptDictionary } from "./prompt/prompt.dictionary";
import { resultDictionary } from "./result/result.dictionary";
import { settingDictionary } from "./setting/setting.dictionary";
import { summaryDictionary } from "./summary/summary.dictionary";
import { syrsDictionary } from "./_syrs/syrs.dictionary";
import { testDictionary } from "./test/test.dictionary";
import { userDictionary } from "./user/user.dictionary";

import * as sig from "./sig";
import { cnst } from "./cnst";
import { dictionaryOf, makeDictionary, makeTrans } from "@core/base";
import { dictionary as shared } from "@shared";
import { dictionary as social } from "@social";

export const dictionary = makeDictionary(shared, social, {
  ...syrsDictionary,
  // * ==================== Models ==================== * //
imageHosting: dictionaryOf(imageHostingDictionary, cnst.imageHostingCnst, sig.ImageHostingSignal),
prompt: dictionaryOf(promptDictionary, cnst.promptCnst, sig.PromptSignal),
result: dictionaryOf(resultDictionary, cnst.resultCnst, sig.ResultSignal),
test: dictionaryOf(testDictionary, cnst.testCnst, sig.TestSignal),
  // * ==================== Models ==================== * //

  // * ==================== Extended Models ==================== * //
  setting: dictionaryOf(settingDictionary, cnst.settingCnst, sig.SettingSignal),
  summary: dictionaryOf(summaryDictionary, cnst.summaryCnst, sig.SummarySignal),
  user: dictionaryOf(userDictionary, cnst.userCnst, sig.UserSignal),
  // * ==================== Extended Models ==================== * //

  // * ==================== Scalar Models ==================== * //
  // * ==================== Scalar Models ==================== * //

  // * ==================== Service Models ==================== * //
  // * ==================== Service Models ==================== * //
} as const);
export const { Revert, translate, msg } = makeTrans(dictionary);
