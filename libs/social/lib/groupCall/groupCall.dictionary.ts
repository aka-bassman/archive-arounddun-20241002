import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { GroupCall, GroupCallFilter, GroupCallInsight, GroupCallSummary } from "./groupCall.constant";
import type { GroupCallSignal } from "./groupCall.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["GroupCall", "그룹콜"],
  modelDesc: ["GroupCall", "그룹콜"],

  // * ==================== Model ==================== * //
  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  roomId: ["Room ID", "방번호"],
  "desc-roomId": ["Room ID", "방번호"],

  startAt: ["Start At", "시작 시간"],
  "desc-startAt": ["Start At", "시작 시간"],

  endAt: ["End At", "종료 시간"],
  "desc-endAt": ["End At", "종료 시간"],

  users: ["Users", "전체 유저"],
  "desc-users": ["Users", "전체 유저"],

  totalContribution: ["Total Contribution", "총 기여도"],
  "desc-totalContribution": ["Total Contribution", "총 기여도"],

  totalReview: ["Total Review", "총 리뷰"],
  "desc-totalReview": ["Total Review", "총 리뷰"],

  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-type-call": ["Call", "전화"],
  "enumdesc-type-call": ["Call type", "전화 타입"],
  "enum-type-video": ["Video", "비디오"],
  "enumdesc-type-video": ["Video type", "비디오 타입"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  "enum-status-closed": ["Closed", "종료"],
  "enumdesc-status-closed": ["Closed status", "종료 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<GroupCall, GroupCallInsight, GroupCallFilter>;

export const groupCallSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalGroupCall: ["Total GroupCall", "총 그룹콜"],
  "desc-totalGroupCall": ["Total GroupCall", "총 그룹콜"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<GroupCallSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("groupCall" as const),
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<GroupCallSignal, GroupCall>;

export const groupCallDictionary = { ...modelDictionary, ...signalDictionary };
