import { imageHostingSummaryDictionary } from "../imageHosting/imageHosting.dictionary";
import { promptSummaryDictionary } from "../prompt/prompt.dictionary";
import { resultSummaryDictionary } from "../result/result.dictionary";
import { testSummaryDictionary } from "../test/test.dictionary";
import { userSummaryDictionary } from "../user/user.dictionary";

import { ExtendModelDictionary, SignalDictionary } from "@core/base";
import type { SummarySignal } from "./summary.signal";
import type { SyrsSummary } from "./summary.constant";

const modelDictionary = {
  // * ==================== Model ==================== * //
...imageHostingSummaryDictionary,
...promptSummaryDictionary,
...resultSummaryDictionary,
...testSummaryDictionary,
  ...userSummaryDictionary,
  // * ==================== Model ==================== * //

  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies ExtendModelDictionary<SyrsSummary>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SummarySignal, SyrsSummary>;

export const summaryDictionary = { ...modelDictionary, ...signalDictionary };
