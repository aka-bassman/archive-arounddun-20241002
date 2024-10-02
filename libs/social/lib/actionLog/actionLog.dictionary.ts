import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { ActionLog, ActionLogFilter, ActionLogInsight, ActionLogSummary } from "./actionLog.constant";
import type { ActionLogSignal } from "./actionLog.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["ActionLog", "액션로그"],
  modelDesc: ["ActionLog", "액션로그"],

  // * ==================== Model ==================== * //
  value: ["Value", "값"],
  "desc-value": ["Value", "값"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  target: ["Target", "타겟"],
  "desc-target": ["Target", "타겟"],

  user: ["User", "유저"],
  "desc-user": ["User", "유저"],

  action: ["Action", "액션"],
  "desc-action": ["Action", "액션"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<ActionLog, ActionLogInsight, ActionLogFilter>;

export const actionLogSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalActionLog: ["Total ActionLog", "총 액션로그수"],
  "desc-totalActionLog": ["Total ActionLog", "총 액션로그수"],

  haActionLog: ["HA ActionLog", "시간당 액션로그수"],
  "desc-haActionLog": ["HA ActionLog", "시간당 액션로그수"],

  daActionLog: ["DA ActionLog", "일간 액션로그수"],
  "desc-daActionLog": ["DA ActionLog", "일간 액션로그수"],

  waActionLog: ["WA ActionLog", "주간 액션로그수"],
  "desc-waActionLog": ["WA ActionLog", "주간 액션로그수"],

  maActionLog: ["MA ActionLog", "월간 액션로그수"],
  "desc-maActionLog": ["MA ActionLog", "월간 액션로그수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ActionLogSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("actionLog" as const),
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ActionLogSignal, ActionLog>;

export const actionLogDictionary = { ...modelDictionary, ...signalDictionary };
