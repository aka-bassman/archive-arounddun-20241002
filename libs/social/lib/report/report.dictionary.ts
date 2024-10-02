import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Report, ReportFilter, ReportInsight, ReportSummary } from "./report.constant";
import type { ReportSignal } from "./report.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Report", "신고"],
  modelDesc: ["Report", "신고"],

  // * ==================== Model ==================== * //
  root: ["Root", "루트"],
  "desc-root": ["Root", "루트"],

  title: ["Title", "제목"],
  "desc-title": ["Title", "제목"],

  files: ["Files", "파일"],
  "desc-files": ["Files", "파일"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  target: ["Target", "타겟"],
  "desc-target": ["Target", "타겟"],

  targetUser: ["TargetUser", "타겟유저"],
  "desc-targetUser": ["TargetUser", "타겟유저"],

  from: ["From", "요청자"],
  "desc-from": ["From", "요청자"],

  content: ["Content", "내용"],
  "desc-content": ["Content", "내용"],

  replyFrom: ["ReplyFrom", "답변자"],
  "desc-replyFrom": ["ReplyFrom", "답변자"],

  replyAt: ["ReplyAt", "답변일"],
  "desc-replyAt": ["ReplyAt", "답변일"],

  replyContent: ["ReplyContent", "답변내용"],
  "desc-replyContent": ["ReplyContent", "답변내용"],
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
  "enum-status-inProgress": ["In Progress", "진행 중"],
  "enumdesc-status-inProgress": ["In Progress status", "진행 중 상태"],
  "enum-status-resolved": ["Resolved", "해결됨"],
  "enumdesc-status-resolved": ["Resolved status", "해결됨 상태"],

  confirm: ["Are you sure to submit this report?", "신고를 제출하시겠습니까?"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Report, ReportInsight, ReportFilter>;

export const reportSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalReport: ["TotalReport", "총 신고"],
  "desc-totalReport": ["TotalReport", "총 신고"],

  activeReport: ["ActiveReport", "미처리 신고"],
  "desc-activeReport": ["ActiveReport", "미처리 신고"],

  inProgressReport: ["InProgressReport", "처리중 신고"],
  "desc-inProgressReport": ["InProgressReport", "처리중 신고"],

  resolvedReport: ["ResolvedReport", "처리된 신고"],
  "desc-resolvedReport": ["ResolvedReport", "처리된 신고"],

  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ReportSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("report" as const),
  // * ==================== Endpoint ==================== * //
  "api-processReport": ["Process Report", "신고 처리"],
  "apidesc-processReport": ["Process the report", "신고를 처리합니다"],
  "arg-processReport-reportId": ["Report ID", "신고 ID"],
  "argdesc-processReport-reportId": ["ID of the report to process", "처리할 신고의 ID"],

  "api-resolveReport": ["Resolve Report", "신고 해결"],
  "apidesc-resolveReport": ["Resolve the report", "신고를 해결합니다"],
  "arg-resolveReport-reportId": ["Report ID", "신고 ID"],
  "argdesc-resolveReport-reportId": ["ID of the report to resolve", "해결할 신고의 ID"],
  "arg-resolveReport-replyContent": ["Reply Content", "답변 내용"],
  "argdesc-resolveReport-replyContent": ["Content of the reply", "답변의 내용"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ReportSignal, Report>;

export const reportDictionary = { ...modelDictionary, ...signalDictionary };
