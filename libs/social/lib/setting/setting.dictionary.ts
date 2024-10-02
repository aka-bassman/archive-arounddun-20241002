import { ExtendModelDictionary, SignalDictionary } from "@core/base";
import type { SettingSignal } from "./setting.signal";
import type { SocialSettingInput } from "./setting.constant";

const modelDictionary = {
  // * ==================== Model ==================== * //
  // * ==================== Model ==================== * //
  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies ExtendModelDictionary<SocialSettingInput>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SettingSignal, SocialSettingInput>;

export const settingDictionary = { ...modelDictionary, ...signalDictionary };
