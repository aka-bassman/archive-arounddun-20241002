import { ExtendModelDictionary, SignalDictionary, SummaryDictionary } from "@core/base";
import type { SocialUser, SocialUserInsight, SocialUserSummary, UserFilter } from "./user.constant";
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
} satisfies ExtendModelDictionary<SocialUser, SocialUserInsight, UserFilter>;

export const userSummaryDictionary = {} satisfies SummaryDictionary<SocialUserSummary>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<UserSignal, SocialUser>;

export const userDictionary = { ...modelDictionary, ...signalDictionary };
