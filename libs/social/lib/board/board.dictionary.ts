import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Board, BoardFilter, BoardInsight, BoardSummary } from "./board.constant";
import type { BoardSignal } from "./board.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Board", "게시판"],
  modelDesc: ["Board", "게시판"],

  // * ==================== Model ==================== * //
  name: ["Name", "이름"],
  "desc-name": ["Name", "이름"],

  description: ["Description", "설명"],
  "desc-description": ["Description", "설명"],

  categories: ["Categories", "카테고리"],
  "desc-categories": ["Categories", "카테고리"],

  viewStyle: ["ViewStyle", "뷰스타일"],
  "desc-viewStyle": ["ViewStyle", "뷰스타일"],

  policy: ["Policy", "정책"],
  "desc-policy": ["Policy", "정책"],

  roles: ["Roles", "역할"],
  "desc-roles": ["Roles", "역할"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-policy-autoApprove": ["Auto Approve", "자동 승인"],
  "enumdesc-policy-autoApprove": ["Auto approve policy", "자동 승인 정책"],
  "enum-policy-private": ["Private", "비공개"],
  "enumdesc-policy-private": ["Private policy", "비공개 정책"],
  "enum-policy-one-one": ["One-on-One", "일대일"],
  "enumdesc-policy-one-one": ["One-on-One policy", "일대일 정책"],
  "enum-policy-noti.admin.discord": ["Admin Discord Notification", "관리자 디스코드 알림"],
  "enumdesc-policy-noti.admin.discord": ["Admin Discord notification policy", "관리자 디스코드 알림 정책"],
  "enum-policy-noti.user.email": ["User Email Notification", "사용자 이메일 알림"],
  "enumdesc-policy-noti.user.email": ["User email notification policy", "사용자 이메일 알림 정책"],
  "enum-policy-noti.user.phone": ["User Phone Notification", "사용자 휴대폰 알림"],
  "enumdesc-policy-noti.user.phone": ["User phone notification policy", "사용자 휴대폰 알림 정책"],

  "enum-roles-root": ["Root", "루트"],
  "enumdesc-roles-root": ["Root role", "루트 역할"],
  "enum-roles-admin": ["Admin", "관리자"],
  "enumdesc-roles-admin": ["Admin role", "관리자 역할"],
  "enum-roles-user": ["User", "사용자"],
  "enumdesc-roles-user": ["User role", "사용자 역할"],
  "enum-roles-business": ["Business", "비즈니스"],
  "enumdesc-roles-business": ["Business role", "비즈니스 역할"],
  "enum-roles-guest": ["Guest", "게스트"],
  "enumdesc-roles-guest": ["Guest role", "게스트 역할"],

  "enum-viewStyle-gallery": ["Gallery", "갤러리"],
  "enumdesc-viewStyle-gallery": ["Gallery view style", "갤러리 뷰스타일"],
  "enum-viewStyle-list": ["List", "리스트"],
  "enumdesc-viewStyle-list": ["List view style", "리스트 뷰스타일"],
  "enum-viewStyle-board": ["Board", "게시판"],
  "enumdesc-viewStyle-board": ["Board view style", "게시판 뷰스타일"],
  "enum-viewStyle-youtube": ["YouTube", "유튜브"],
  "enumdesc-viewStyle-youtube": ["YouTube view style", "유튜브 뷰스타일"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Board, BoardInsight, BoardFilter>;

export const boardSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalBoard: ["Total Board", "총 게시판"],
  "desc-totalBoard": ["Total Board", "총 게시판"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<BoardSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("board" as const),
  // * ==================== Endpoint ==================== * //
  "api-boardListInPublic": ["Board List In Public", "공개 게시판 리스트"],
  "apidesc-boardListInPublic": ["List all public boards", "모든 공개 게시판을 나열합니다"],
  "arg-boardListInPublic-statuses": ["Statuses", "상태"],
  "argdesc-boardListInPublic-statuses": ["Statuses of the board", "게시판 상태"],
  "arg-boardListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-boardListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-boardListInPublic-limit": ["Limit", "제한"],
  "argdesc-boardListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-boardListInPublic-sort": ["Sort", "정렬"],
  "argdesc-boardListInPublic-sort": ["Sorting criteria", "정렬 기준"],

  "api-boardInsightInPublic": ["Board Insight In Public", "공개 게시판 인사이트"],
  "apidesc-boardInsightInPublic": ["Get insights for public boards", "공개 게시판에 대한 인사이트를 가져옵니다."],
  "arg-boardInsightInPublic-statuses": ["Statuses", "상태"],
  "argdesc-boardInsightInPublic-statuses": ["Statuses of the board", "게시판 상태"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<BoardSignal, Board>;

export const boardDictionary = { ...modelDictionary, ...signalDictionary };
