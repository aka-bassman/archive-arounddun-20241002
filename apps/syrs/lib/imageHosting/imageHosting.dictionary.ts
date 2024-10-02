import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type {
  ImageHosting,
  ImageHostingFilter,
  ImageHostingInsight,
  ImageHostingSummary,
} from "./imageHosting.constant";
import type { ImageHostingSignal } from "./imageHosting.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["ImageHosting", "ImageHosting"],
  modelDesc: ["ImageHosting description", "ImageHosting 설명"],

  // * ==================== Model ==================== * //
  name: ["Name", "이름"],
  "desc-name": ["Name of the imageHosting", "ImageHosting의 이름"],

  image: ["Image", "이미지"],
  "desc-image": ["Image of the imageHosting", "ImageHosting의 이미지"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["ImageHosting count in current query settting", "현재 쿼리 설정에 맞는 ImageHosting 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],

  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<ImageHosting, ImageHostingInsight, ImageHostingFilter>;

export const imageHostingSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalImageHosting: ["Total ImageHosting", "총 ImageHosting 수"],
  "desc-totalImageHosting": ["Total imageHosting count in the database", "데이터베이스에 저장된 총 ImageHosting 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ImageHostingSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("imageHosting" as const),
  // * ==================== Endpoint ==================== * //
  "api-imageHostingListInPublic": ["ImageHosting List In Public", "공개된 ImageHosting 리스트"],
  "apidesc-imageHostingListInPublic": [
    "Get a list of public imageHosting",
    "공개된 ImageHosting의 리스트를 가져옵니다",
  ],
  "arg-imageHostingListInPublic-statuses": ["Statuses", "상태"],
  "argdesc-imageHostingListInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  "arg-imageHostingListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-imageHostingListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-imageHostingListInPublic-limit": ["Limit", "제한"],
  "argdesc-imageHostingListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-imageHostingListInPublic-sort": ["Sort", "정렬"],
  "argdesc-imageHostingListInPublic-sort": ["Sort order of the items", "아이템의 정렬 순서"],

  "api-imageHostingInsightInPublic": ["ImageHosting Insight In Public", "공개된 ImageHosting 인사이트"],
  "apidesc-imageHostingInsightInPublic": [
    "Get insight data for public imageHosting",
    "공개된 ImageHosting에 대한 인사이트 데이터를 가져옵니다",
  ],
  "arg-imageHostingInsightInPublic-statuses": ["Statuses", "상태"],
  "argdesc-imageHostingInsightInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ImageHostingSignal, ImageHosting>;

export const imageHostingDictionary = { ...modelDictionary, ...signalDictionary };
