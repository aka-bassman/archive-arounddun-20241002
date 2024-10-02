import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Comment, CommentFilter, CommentInsight, CommentSummary } from "./comment.constant";
import type { CommentSignal } from "./comment.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Comment", "댓글"],
  modelDesc: ["Comment", "댓글"],

  // * ==================== Model ==================== * //
  rootType: ["RootType", "루트타입"],
  "desc-rootType": ["RootType", "루트타입"],

  root: ["Root", "루트"],
  "desc-root": ["Root", "루트"],

  group: ["Group", "그룹"],
  "desc-group": ["Group", "그룹"],

  parentType: ["ParentType", "Parent타입"],
  "desc-parentType": ["ParentType", "Parent타입"],

  parent: ["Parent", "Parent"],
  "desc-parent": ["Parent", "Parent"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  user: ["User", "유저"],
  "desc-user": ["User", "유저"],

  name: ["Name", "이름"],
  "desc-name": ["Name", "이름"],

  phone: ["Phone", "전화번호"],
  "desc-phone": ["Phone", "전화번호"],

  email: ["Email", "이메일"],
  "desc-email": ["Email", "이메일"],

  content: ["Content", "콘텐츠"],
  "desc-content": ["Content", "콘텐츠"],

  meta: ["Meta", "메타정보"],
  "desc-meta": ["Meta", "메타정보"],

  policy: ["Policy", "정책"],
  "desc-policy": ["Policy", "정책"],

  parentCreatedAt: ["ParentCreatedAt", "Parent생성일"],
  "desc-parentCreatedAt": ["ParentCreatedAt", "Parent생성일"],

  like: ["Like", "좋아요"],
  "desc-like": ["Like", "좋아요"],

  totalStat: ["TotalStat", "전체통계"],
  "desc-totalStat": ["TotalStat", "전체통계"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  parentLatest: ["latest", "댓글순"],
  "desc-parentLatest": ["latest", "댓글순"],
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
  "enum-status-denied": ["Denied", "거절됨"],
  "enumdesc-status-denied": ["Denied status", "거절됨 상태"],
  "enum-status-removed": ["Removed", "삭제됨"],
  "enumdesc-status-removed": ["Removed status", "삭제됨 상태"],

  removedComment: ["Removed Comment", "삭제된 댓글"],
  reportComment: ["Report Comment", "댓글을 신고합니다."],
  reportCommentSuccess: [
    "This comment is reported. You can check the progress on customer center.",
    "신고되었습니다. 고객센터에서 처리내역을 확인해주세요.",
  ],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Comment, CommentInsight, CommentFilter>;

export const commentSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalComment: ["Total Comment", "총 댓글수"],
  "desc-totalComment": ["Total Comment", "총 댓글수"],

  activeComment: ["Active Comment", "미처리 댓글수"],
  "desc-activeComment": ["Active Comment", "미처리 댓글수"],

  approvedComment: ["Approved Comment", "승인 댓글수"],
  "desc-approvedComment": ["Approved Comment", "승인 댓글수"],

  deniedComment: ["Denied Comment", "거절 댓글수"],
  "desc-deniedComment": ["Denied Comment", "거절 댓글수"],

  haComment: ["Hourly Comment", "시간당 댓글수"],
  "desc-haComment": ["Hourly active comment", "시간당 댓글수"],

  daComment: ["Daily Comment", "일간 댓글수"],
  "desc-daComment": ["Daily active comment", "일간 댓글수"],

  waComment: ["WA Comment", "주간 댓글수"],
  "desc-waComment": ["Weekly active comment", "주간 댓글수"],

  maComment: ["MA Comment", "월간 댓글수"],
  "desc-maComment": ["Monthly active comment", "월간 댓글수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<CommentSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("comment" as const),
  // * ==================== Endpoint ==================== * //
  "api-approveComment": ["Approve Comment", "댓글 승인"],
  "apidesc-approveComment": ["Approve a comment", "댓글을 승인합니다."],
  "arg-approveComment-commentId": ["Comment ID", "댓글 ID"],
  "argdesc-approveComment-commentId": ["Comment ID to be approved", "승인할 댓글의 ID"],

  "api-denyComment": ["Deny Comment", "댓글 거절"],
  "apidesc-denyComment": ["Deny a comment", "댓글을 거절합니다."],
  "arg-denyComment-commentId": ["Comment ID", "댓글 ID"],
  "argdesc-denyComment-commentId": ["Comment ID to be denied", "거절할 댓글의 ID"],

  "api-likeComment": ["Like Comment", "댓글 좋아요"],
  "apidesc-likeComment": ["Like a comment", "댓글을 좋아합니다."],
  "arg-likeComment-commentId": ["Comment ID", "댓글 ID"],
  "argdesc-likeComment-commentId": ["Comment ID to be liked", "좋아할 댓글의 ID"],

  "api-resetLikeComment": ["Reset Like Comment", "댓글 좋아요 초기화"],
  "apidesc-resetLikeComment": ["Reset the like on a comment", "댓글의 좋아요를 초기화합니다."],
  "arg-resetLikeComment-commentId": ["Comment ID", "댓글 ID"],
  "argdesc-resetLikeComment-commentId": ["Comment ID to reset the like", "좋아요를 초기화할 댓글의 ID"],

  "api-unlikeComment": ["Unlike Comment", "댓글 좋아요 취소"],
  "apidesc-unlikeComment": ["Unlike a comment", "댓글의 좋아요를 취소합니다."],
  "arg-unlikeComment-commentId": ["Comment ID", "댓글 ID"],
  "argdesc-unlikeComment-commentId": ["Comment ID to be unliked", "좋아요를 취소할 댓글의 ID"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<CommentSignal, Comment>;

export const commentDictionary = { ...modelDictionary, ...signalDictionary };
