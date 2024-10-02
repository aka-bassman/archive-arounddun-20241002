import { ExtendModelDictionary, SignalDictionary } from "@core/base";
import type { SettingSignal } from "./setting.signal";
import type { SyrsSettingInput } from "./setting.constant";

const modelDictionary = {
  // * ==================== Model ==================== * //
  // * ==================== Model ==================== * //
  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies ExtendModelDictionary<SyrsSettingInput>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SettingSignal, SyrsSettingInput>;

export const settingDictionary = { ...modelDictionary, ...signalDictionary };
