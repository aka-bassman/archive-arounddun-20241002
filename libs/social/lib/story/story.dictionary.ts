import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Story, StoryFilter, StoryInsight, StorySummary } from "./story.constant";
import type { StorySignal } from "./story.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Story", "게시글"],
  modelDesc: ["Story", "게시글"],

  // * ==================== Model ==================== * //
  root: ["Root", "루트"],
  "desc-root": ["Root", "루트"],

  rootType: ["RootType", "게시판 타입"],
  "desc-rootType": ["RootType", "게시판 타입"],

  parent: ["Parent", "부모"],
  "desc-parent": ["Parent", "부모"],

  parentType: ["ParentType", "부모타입"],
  "desc-parentType": ["ParentType", "부모타입"],

  category: ["Category", "카테고리"],
  "desc-category": ["Category", "카테고리"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  user: ["User", "작성자"],
  "desc-user": ["User", "작성자"],

  title: ["Title", "제목"],
  "desc-title": ["Title", "제목"],

  content: ["Content", "콘텐츠"],
  "desc-content": ["Content", "콘텐츠"],

  thumbnails: ["Thumbnails", "썸네일"],
  "desc-thumbnails": ["Thumbnails", "썸네일"],

  logo: ["Logo", "로고"],
  "desc-logo": ["Logo", "로고"],

  policy: ["Policy", "정책"],
  "desc-policy": ["Policy", "정책"],

  images: ["Images", "이미지"],
  "desc-images": ["Images", "이미지"],

  parentCreatedAt: ["ParentCreatedAt", "부모 생성일"],
  "desc-parentCreatedAt": ["ParentCreatedAt", "부모 생성일"],

  totalStat: ["TotalStat", "전체 통계"],
  "desc-totalStat": ["TotalStat", "전체 통계"],

  view: ["View", "조회수"],
  "desc-view": ["View", "조회수"],

  like: ["Like", "추천"],
  "desc-like": ["Like", "추천"],

  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  parentLatest: ["latest", "최신순"],
  "desc-parentLatest": ["latest", "최신순"],

  mostViews: ["mostViews", "조회순"],
  "desc-mostViews": ["mostViews", "조회순"],
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-type-user": ["User", "사용자"],
  "enumdesc-type-user": ["User type", "사용자 유형"],
  "enum-type-admin": ["Admin", "관리자"],
  "enumdesc-type-admin": ["Admin type", "관리자 유형"],
  "enum-type-anonymous": ["Anonymous", "익명"],
  "enumdesc-type-anonymous": ["Anonymous type", "익명 유형"],

  "enum-policy-private": ["Private", "비공개"],
  "enumdesc-policy-private": ["Private policy", "비공개 정책"],
  "enum-policy-thumbnailRequired": ["Thumbnail Required", "썸네일 필수"],
  "enumdesc-policy-thumbnailRequired": ["Thumbnail required policy", "썸네일 필수 정책"],
  "enum-policy-noComment": ["No Comment", "댓글 불가"],
  "enumdesc-policy-noComment": ["No comment policy", "댓글 불가 정책"],
  "enum-policy-noSubComment": ["No Sub Comment", "대댓글 불가"],
  "enumdesc-policy-noSubComment": ["No sub comment policy", "대댓글 불가 정책"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  "enum-status-approved": ["Approved", "승인됨"],
  "enumdesc-status-approved": ["Approved status", "승인됨 상태"],
  "enum-status-denied": ["Denied", "거부됨"],
  "enumdesc-status-denied": ["Denied status", "거부됨 상태"],

  board: ["Board", "게시판"],
  dislike: ["Dislike", "비추"],
  comment: ["Comment", "댓글"],
  write: ["Write", "글쓰기"],
  removeStory: ["Remove Story", "게시글을 삭제합니다."],
  reportStory: ["Report Story", "게시글을 신고합니다."],
  reportStorySuccess: [
    "This story is reported. You can check the progress on customer center.",
    "신고되었습니다. 고객센터에서 처리내역을 확인해주세요.",
  ],
  removeStoryConfirm: ["Are you sure to remove story?", "게시글을 삭제하시겠습니까?"],
  selectType: ["Select User", "작성자 권한"],
  selectUser: ["Select User", "작성자 선택"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Story, StoryInsight, StoryFilter>;

export const storySummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalStory: ["Total Story", "총 게시글수"],
  "desc-totalStory": ["Total Story", "총 게시글수"],

  activeStory: ["Active Story", "미처리 게시글수"],
  "desc-activeStory": ["Active Story", "미처리 게시글수"],

  approvedStory: ["Approved Story", "승인 게시글수"],
  "desc-approvedStory": ["Approved Story", "승인 게시글수"],

  deniedStory: ["Denied Story", "거절 게시글수"],
  "desc-deniedStory": ["Denied Story", "거절 게시글수"],

  haStory: ["Hourly Story", "시간당 게시글수"],
  "desc-haStory": ["Hourly Story", "시간당 게시글수"],

  daStory: ["Daily Story", "일간 게시글수"],
  "desc-daStory": ["Daily Story", "일간 게시글수"],

  waStory: ["Weekly Story", "주간 게시글수"],
  "desc-waStory": ["Weekly Story", "주간 게시글수"],

  maStory: ["Monthly Story", "월간 게시글수"],
  "desc-maStory": ["Monthly Story", "월간 게시글수"],

  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<StorySummary>;

const signalDictionary = {
  ...getBaseSignalTrans("story" as const),
  // * ==================== Endpoint ==================== * //
  "api-storyListInRoot": ["Story List In Public", "공개 게시글 리스트"],
  "apidesc-storyListInRoot": ["Story List In Public", "공개 게시글 리스트"],
  "arg-storyListInRoot-root": ["Root", "루트"],
  "argdesc-storyListInRoot-root": ["Root of the story", "게시글의 루트"],
  "arg-storyListInRoot-title": ["Title", "제목"],
  "argdesc-storyListInRoot-title": ["Title of the story", "게시글의 제목"],
  "arg-storyListInRoot-statuses": ["Statuses", "상태"],
  "argdesc-storyListInRoot-statuses": ["Statuses of the story", "게시글의 상태"],
  "arg-storyListInRoot-skip": ["Skip", "건너뛰기"],
  "argdesc-storyListInRoot-skip": ["Number of stories to skip", "건너뛸 게시글의 수"],
  "arg-storyListInRoot-limit": ["Limit", "제한"],
  "argdesc-storyListInRoot-limit": ["Maximum number of stories to retrieve", "가져올 게시글의 최대 수"],
  "arg-storyListInRoot-sort": ["Sort", "정렬"],
  "argdesc-storyListInRoot-sort": ["Sorting option for the stories", "게시글의 정렬 옵션"],

  "api-storyInsightInRoot": ["Story Insight In Public", "공개 게시글 인사이트"],
  "apidesc-storyInsightInRoot": ["Story Insight In Public", "공개 게시글 인사이트"],
  "arg-storyInsightInRoot-root": ["Root", "루트"],
  "argdesc-storyInsightInRoot-root": ["Root of the story", "게시글의 루트"],
  "arg-storyInsightInRoot-title": ["Title", "제목"],
  "argdesc-storyInsightInRoot-title": ["Title of the story", "게시글의 제목"],
  "arg-storyInsightInRoot-statuses": ["Statuses", "상태"],
  "argdesc-storyInsightInRoot-statuses": ["Statuses of the story", "게시글의 상태"],

  "api-approveStory": ["Approve Story", "게시글 승인"],
  "apidesc-approveStory": ["Approve Story", "게시글 승인"],
  "arg-approveStory-storyId": ["Story ID", "게시글 ID"],
  "argdesc-approveStory-storyId": ["ID of the story to approve", "승인할 게시글의 ID"],

  "api-denyStory": ["Deny Story", "게시글 거절"],
  "apidesc-denyStory": ["Deny Story", "게시글 거절"],
  "arg-denyStory-storyId": ["Story ID", "게시글 ID"],
  "argdesc-denyStory-storyId": ["ID of the story to deny", "거절할 게시글의 ID"],

  "api-likeStory": ["Like Story", "게시글 좋아요"],
  "apidesc-likeStory": ["Like Story", "게시글 좋아요"],
  "arg-likeStory-storyId": ["Story ID", "게시글 ID"],
  "argdesc-likeStory-storyId": ["ID of the story to like", "좋아요를 누를 게시글의 ID"],

  "api-resetLikeStory": ["Reset Like Story", "게시글 좋아요 취소"],
  "apidesc-resetLikeStory": ["Reset Like Story", "게시글 좋아요 취소"],
  "arg-resetLikeStory-storyId": ["Story ID", "게시글 ID"],
  "argdesc-resetLikeStory-storyId": ["ID of the story to reset like", "좋아요를 취소할 게시글의 ID"],

  "api-unlikeStory": ["Unlike Story", "게시글 싫어요"],
  "apidesc-unlikeStory": ["Unlike Story", "게시글 싫어요"],
  "arg-unlikeStory-storyId": ["Story ID", "게시글 ID"],
  "argdesc-unlikeStory-storyId": ["ID of the story to unlike", "싫어요를 누를 게시글의 ID"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<StorySignal, Story>;

export const storyDictionary = { ...modelDictionary, ...signalDictionary };
