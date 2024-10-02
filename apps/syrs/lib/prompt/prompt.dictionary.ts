import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Prompt, PromptFilter, PromptInsight, PromptSummary } from "./prompt.constant";
import type { PromptSignal } from "./prompt.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Prompt", "Prompt"],
  modelDesc: ["Prompt description", "Prompt 설명"],

  // * ==================== Model ==================== * //

  apiKey: ["API Key", "API 키"],
  "desc-apiKey": ["API Key", "API 키, 현재 gpt만"],

  isDefault: ["Is Default", "기본 프롬프트 설정"],
  "desc-isDefault": ["Is Default", "기본 프롬프트 설정"],

  assistantName: ["Assistant Name", "Assistant 이름"],
  "desc-assistantName": ["Assistant Name", "Assistant 이름"],

  assistantId: ["Assistant ID", "Assistant ID"],
  "desc-assistantId": ["Assistant ID", "Assistant ID"],

  status: ["Status", "상태"],
  "desc-status": ["Status", "상태"],

  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Prompt count in current query settting", "현재 쿼리 설정에 맞는 Prompt 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Prompt, PromptInsight, PromptFilter>;

export const promptSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalPrompt: ["Total Prompt", "총 Prompt 수"],
  "desc-totalPrompt": ["Total prompt count in the database", "데이터베이스에 저장된 총 Prompt 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<PromptSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("prompt" as const),
  // * ==================== Endpoint ==================== * //
  "api-promptListInPublic": ["Prompt List In Public", "공개된 Prompt 리스트"],
  "apidesc-promptListInPublic": ["Get a list of public prompt", "공개된 Prompt의 리스트를 가져옵니다"],
  "arg-promptListInPublic-statuses": ["Statuses", "상태"],
  "argdesc-promptListInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  "arg-promptListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-promptListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-promptListInPublic-limit": ["Limit", "제한"],
  "argdesc-promptListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-promptListInPublic-sort": ["Sort", "정렬"],
  "argdesc-promptListInPublic-sort": ["Sort order of the items", "아이템의 정렬 순서"],

  "api-promptInsightInPublic": ["Prompt Insight In Public", "공개된 Prompt 인사이트"],
  "apidesc-promptInsightInPublic": [
    "Get insight data for public prompt",
    "공개된 Prompt에 대한 인사이트 데이터를 가져옵니다",
  ],
  "arg-promptInsightInPublic-statuses": ["Statuses", "상태"],
  "argdesc-promptInsightInPublic-statuses": ["Statuses to filter", "필터링할 상태"],

  "api-setPromptDefault": ["Set Prompt Default", "기본 프롬프트 설정"],
  "apidesc-setPromptDefault": ["Set default prompt", "기본 프롬프트를 설정합니다"],

  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<PromptSignal, Prompt>;

export const promptDictionary = { ...modelDictionary, ...signalDictionary };
