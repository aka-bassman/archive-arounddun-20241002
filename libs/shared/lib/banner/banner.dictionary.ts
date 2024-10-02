import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Banner, BannerFilter, BannerInsight, BannerSummary } from "./banner.constant";
import type { BannerSignal } from "./banner.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Banner", "배너"],
  modelDesc: [
    "Banner is a temporary notice informations that is displayed on the top or in front of the page",
    "배너는 페이지 상단이나 앞에 표시되는 임시 공지 정보입니다.",
  ],

  // * ==================== Model ==================== * //
  category: ["Category", "카테고리"],
  "desc-category": ["Category of banner, displayed on the top", "배너 카테고리, 상단에 표시됨"],

  title: ["Title", "제목"],
  "desc-title": ["Title of banner, displayed on the top", "배너 제목, 상단에 표시됨"],

  content: ["Content", "내용"],
  "desc-content": ["Content of banner, displayed on the bottom", "배너 내용, 하단에 표시됨"],

  image: ["Image", "이미지"],
  "desc-image": ["Image of banner, displayed on the center", "배너 이미지, 중앙에 표시됨"],

  href: ["Href", "링크"],
  "desc-href": ["Href of banner, link to other page", "배너 링크, 다른 페이지로 이동함"],

  target: ["Target", "타겟"],
  "desc-target": ["Target configuration of <a> tag in banner", "배너의 <a> 태그의 타겟 설정"],

  from: ["From", "시작일"],
  "desc-from": ["Start date of banner", "배너 시작일"],

  to: ["To", "종료일"],
  "desc-to": ["End date of banner", "배너 종료일"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Banner count in current query settting", "현재 쿼리 설정에 맞는 배너 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-target-_blank": ["New tab", "새 탭"],
  "enumdesc-target-_blank": ["Open link in new tab", "새 탭에서 링크 열기"],

  "enum-target-_self": ["Same tab", "현재 탭"],
  "enumdesc-target-_self": ["Open link in same tab", "현재 탭에서 링크 열기"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": [
    "Active banner is successfully created but not displayed yet",
    "활성 배너는 성공적으로 생성되었지만 아직 표시되지 않음",
  ],

  "enum-status-displaying": ["Displaying", "표시중"],
  "enumdesc-status-displaying": [
    "Displaying banner is being displayed and viewable for users",
    "표시중 배너는 사용자에게 표시되고 볼 수 있음",
  ],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Banner, BannerInsight, BannerFilter>;

export const bannerSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalBanner: ["TotalBanner", "총 배너 수"],
  "desc-totalBanner": ["Total banner count in the database", "데이터베이스에 저장된 총 배너 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<BannerSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("banner" as const),
  // * ==================== Endpoint ==================== * //
  "api-bannerListInPublic": ["Banner List In Public", "공개된 Banner 리스트"],
  "apidesc-bannerListInPublic": ["Get a list of public banner", "공개된 Banner의 리스트를 가져옵니다"],
  "arg-bannerListInPublic-category": ["Category", "카테고리"],
  "argdesc-bannerListInPublic-category": ["Category to filter", "필터링할 카테고리"],
  "arg-bannerListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-bannerListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-bannerListInPublic-limit": ["Limit", "제한"],
  "argdesc-bannerListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-bannerListInPublic-sort": ["Sort", "정렬"],
  "argdesc-bannerListInPublic-sort": ["Sort order of the items", "아이템의 정렬 순서"],

  "api-bannerInsightInPublic": ["Banner Insight In Public", "공개된 Banner 인사이트"],
  "apidesc-bannerInsightInPublic": [
    "Get insight data for public banner",
    "공개된 Banner에 대한 인사이트 데이터를 가져옵니다",
  ],
  "arg-bannerInsightInPublic-category": ["Category", "카테고리"],
  "argdesc-bannerInsightInPublic-category": ["Category to filter", "필터링할 카테고리"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<BannerSignal, Banner>;

export const bannerDictionary = { ...modelDictionary, ...signalDictionary };
