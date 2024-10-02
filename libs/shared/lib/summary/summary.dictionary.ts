import { adminSummaryDictionary } from "../admin/admin.dictionary";
import { bannerSummaryDictionary } from "../banner/banner.dictionary";
import { fileSummaryDictionary } from "../file/file.dictionary";
import { keyringSummaryDictionary } from "../keyring/keyring.dictionary";
import { notificationSummaryDictionary } from "../notification/notification.dictionary";
import { userSummaryDictionary } from "../user/user.dictionary";

import { ModelDictionary, SignalDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { SharedSummary, SummaryFilter, SummaryInsight } from "./summary.constant";
import type { SummarySignal } from "./summary.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Summary", "시스템 요약"],
  modelDesc: [
    "Summary is a group of system and service metrics that is used for the system to be monitored and managed.",
    "Summary는 시스템이 모니터링되고 관리되는 데 사용되는 시스템 및 서비스 지표의 그룹입니다.",
  ],

  // * ==================== Model ==================== * //
  type: ["Type", "타입"],
  "desc-type": ["Type of summary, e.g. periodic, non-periodic...", "요약의 타입, 예를 들어 주기적, 비주기적..."],

  at: ["At", "시각"],
  "desc-at": ["The time when the summary is created", "요약이 생성된 시각"],

  ...adminSummaryDictionary,
  ...bannerSummaryDictionary,
  ...fileSummaryDictionary,
  ...keyringSummaryDictionary,
  ...notificationSummaryDictionary,
  ...userSummaryDictionary,
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Summary count in current query settting", "현재 쿼리 설정에 맞는 요약 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  oldestAt: ["Oldest At", "가장 오래된 시각"],
  "desc-oldestAt": ["Oldest At", "가장 오래된 시각"],
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-type-non-periodic": ["Non-periodic", "비주기적"],
  "enumdesc-type-non-periodic": ["Non-periodic type", "비주기적 타입"],
  "enum-type-active": ["Active", "활성"],
  "enumdesc-type-active": ["Active type", "활성 타입"],
  "enum-type-hourly": ["Hourly", "시간별"],
  "enumdesc-type-hourly": ["Hourly type", "시간별 타입"],
  "enum-type-daily": ["Daily", "일별"],
  "enumdesc-type-daily": ["Daily type", "일별 타입"],
  "enum-type-weekly": ["Weekly", "주간별"],
  "enumdesc-type-weekly": ["Weekly type", "주간별 타입"],
  "enum-type-monthly": ["Monthly", "월별"],
  "enumdesc-type-monthly": ["Monthly type", "월별 타입"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  "enum-status-archived": ["Archived", "보관됨"],
  "enumdesc-status-archived": ["Archived status", "보관됨 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<SharedSummary, SummaryInsight, SummaryFilter>;

const signalDictionary = {
  ...getBaseSignalTrans("summary" as const),
  // * ==================== Endpoint ==================== * //
  "api-getActiveSummary": ["Get active summary", "활성 요약 조회"],
  "apidesc-getActiveSummary": ["API to get the active summary", "활성 요약을 조회하는 API"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SummarySignal, SharedSummary>;

export const summaryDictionary = { ...modelDictionary, ...signalDictionary };
