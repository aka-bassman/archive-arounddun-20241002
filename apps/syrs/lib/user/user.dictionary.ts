import { ExtendModelDictionary, SignalDictionary, SummaryDictionary } from "@core/base";
import type { SyrsUser, SyrsUserInsight, SyrsUserSummary, UserFilter } from "./user.constant";
import type { UserSignal } from "./user.signal";

const modelDictionary = {
  // * ==================== Model ==================== * //
  // * ==================== Model ==================== * //
  // * ==================== Insight ==================== * //
  // * ==================== Insight ==================== * //
  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //
  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies ExtendModelDictionary<SyrsUser, SyrsUserInsight, UserFilter>;

export const userSummaryDictionary = {} satisfies SummaryDictionary<SyrsUserSummary>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<UserSignal, SyrsUser>;

export const userDictionary = { ...modelDictionary, ...signalDictionary };
