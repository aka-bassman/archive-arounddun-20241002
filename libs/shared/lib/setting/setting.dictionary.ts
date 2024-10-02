import { ModelDictionary, SignalDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Setting, SettingFilter, SettingInsight } from "./setting.constant";
import type { SettingSignal } from "./setting.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Setting", "설정"],
  modelDesc: [
    "Setting is a system setting that is controll and manage the metrics of the system and the service.",
    "설정은 시스템과 서비스의 지표를 제어하고 관리하는 시스템 설정입니다.",
  ],

  // * ==================== Model ==================== * //
  resignupDays: ["Re-signup Days", "재가입 기간(일)"],
  "desc-resignupDays": ["The number of days to allow re-signup", "재가입을 허용할 일수"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Setting count in current query settting", "현재 쿼리 설정에 맞는 설정 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],

  updateSuccessMsg: ["System setting has been updated.", "시스템 설정이 변경되었습니다."],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Setting, SettingInsight, SettingFilter>;

const signalDictionary = {
  ...getBaseSignalTrans("setting" as const),
  // * ==================== Endpoint ==================== * //
  "api-getActiveSetting": ["Get Active Setting", "활성 설정 가져오기"],
  "apidesc-getActiveSetting": ["Get the active setting from the API", "API에서 활성 설정 가져오기"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SettingSignal, Setting>;

export const settingDictionary = { ...modelDictionary, ...signalDictionary };
