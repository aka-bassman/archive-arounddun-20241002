import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { ServiceDesk, ServiceDeskFilter, ServiceDeskInsight, ServiceDeskSummary } from "./serviceDesk.constant";
import type { ServiceDeskSignal } from "./serviceDesk.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["ServiceDesk", "상담"],
  modelDesc: ["ServiceDesk", "상담"],

  // * ==================== Model ==================== * //
  user: ["User", "사용자"],
  "desc-user": ["User", "사용자"],

  chats: ["Chats", "채팅"],
  "desc-chats": ["Chats", "채팅"],

  admin: ["Admin", "관리자"],
  "desc-admin": ["Admin", "관리자"],

  files: ["Files", "파일"],
  "desc-files": ["Files", "파일"],

  emojis: ["Emojis", "이모티콘"],
  "desc-emojis": ["Emojis", "이모티콘"],

  review: ["Review", "후기"],
  "desc-review": ["Review", "후기"],
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
  "enum-status-resolved": ["Resolved", "해결됨"],
  "enumdesc-status-resolved": ["Resolved status", "해결됨 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<ServiceDesk, ServiceDeskInsight, ServiceDeskFilter>;

export const serviceDeskSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalServiceDesk: ["Total ServiceDesk", "총 상담"],
  "desc-totalServiceDesk": ["Total number of service desks", "총 상담 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ServiceDeskSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("serviceDesk" as const),
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ServiceDeskSignal, ServiceDesk>;

export const serviceDeskDictionary = { ...modelDictionary, ...signalDictionary };
