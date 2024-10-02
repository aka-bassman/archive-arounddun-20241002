import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Org, OrgFilter, OrgInsight, OrgSummary } from "./org.constant";
import type { OrgSignal } from "./org.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Org", "조직"],
  modelDesc: ["Org", "조직"],

  // * ==================== Model ==================== * //
  name: ["Name", "이름"],
  "desc-name": ["Name", "이름"],

  owners: ["Owners", "소유자"],
  "desc-owners": ["Owners", "소유자"],

  ownerInvites: ["OwnerInvites", "소유자 초대"],
  "desc-ownerInvites": ["OwnerInvites", "소유자 초대"],

  ownerInviteEmails: ["OwnerInviteEmails", "소유자 이메일 초대"],
  "desc-ownerInviteEmails": ["OwnerInviteEmails", "소유자 이메일 초대"],

  operators: ["Operators", "운영자"],
  "desc-operators": ["Operators", "운영자"],

  operatorInvites: ["OperatorInvites", "운영자 초대"],
  "desc-operatorInvites": ["OperatorInvites", "운영자 초대"],

  operatorInviteEmails: ["OperatorInviteEmails", "운영자 이메일 초대"],
  "desc-operatorInviteEmails": ["OperatorInviteEmails", "운영자 이메일 초대"],

  viewers: ["Viewers", "뷰어"],
  "desc-viewers": ["Viewers", "뷰어"],

  viewerInvites: ["ViewerInvites", "뷰어 초대"],
  "desc-viewerInvites": ["ViewerInvites", "뷰어 초대"],

  viewerInviteEmails: ["ViewerInviteEmails", "뷰어 이메일 초대"],
  "desc-viewerInviteEmails": ["ViewerInviteEmails", "뷰어 이메일 초대"],

  prevUsers: ["PrevUsers", "이전 사용자"],
  "desc-prevUsers": ["PrevUsers", "이전 사용자"],
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

  inviteMemberLoading: ["Member inviting...", "멤버 초대 중"],
  inviteMemberSuccess: ["Member invite success", "멤버 초대가 완료되었습니다."],
  acceptInvite: ["Accept invite", "초대 수락"],
  acceptInviteLoading: ["Invite accepting...", "초대 수락 중"],
  acceptInviteSuccess: ["Invite accept success", "초대 수락 완료"],
  removeSelfError: ["You can't remove yourself", "자기 자신을 삭제할 수 없습니다."],
  removeSuccess: ["Organization removed.", "조직이 삭제되었습니다."],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Org, OrgInsight, OrgFilter>;

export const orgSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalOrg: ["TotalOrg", "총 조직"],
  "desc-totalOrg": ["TotalOrg", "총 조직"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<OrgSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("org" as const),
  // * ==================== Endpoint ==================== * //

  "api-orgListInSelf": ["Org List In Self", "자기 자신의 조직 목록"],
  "apidesc-orgListInSelf": ["Org List In Self", "자기 자신의 조직 목록"],
  "arg-orgListInSelf-skip": ["Skip", "건너뛰기"],
  "argdesc-orgListInSelf-skip": ["Skip", "건너뛰기"],
  "arg-orgListInSelf-limit": ["Limit", "제한"],
  "argdesc-orgListInSelf-limit": ["Limit", "제한"],
  "arg-orgListInSelf-sort": ["Sort", "정렬"],
  "argdesc-orgListInSelf-sort": ["Sort", "정렬"],

  "api-orgInsightInSelf": ["Org Insight In Self", "자기 자신의 조직 통찰력"],
  "apidesc-orgInsightInSelf": ["Org Insight In Self", "자기 자신의 조직 통찰력"],

  "api-getInviteRequest": ["Get Invite Request", "초대 요청 가져오기"],
  "apidesc-getInviteRequest": ["Get Invite Request", "초대 요청 가져오기"],
  "arg-getInviteRequest-inviteSignature": ["Invite Signature", "초대 서명"],
  "argdesc-getInviteRequest-inviteSignature": ["Invite Signature", "초대 서명"],

  "api-inviteOwnerFromOrg": ["Invite Owner From Org", "조직에서 소유자 초대"],
  "apidesc-inviteOwnerFromOrg": ["Invite Owner From Org", "조직에서 소유자 초대"],
  "arg-inviteOwnerFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-inviteOwnerFromOrg-orgId": ["Org ID", "조직 ID"],
  "arg-inviteOwnerFromOrg-email": ["Email", "이메일"],
  "argdesc-inviteOwnerFromOrg-email": ["Email", "이메일"],

  "api-inviteOperatorFromOrg": ["Invite Operator From Org", "조직에서 운영자 초대"],
  "apidesc-inviteOperatorFromOrg": ["Invite Operator From Org", "조직에서 운영자 초대"],
  "arg-inviteOperatorFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-inviteOperatorFromOrg-orgId": ["Org ID", "조직 ID"],
  "arg-inviteOperatorFromOrg-email": ["Email", "이메일"],
  "argdesc-inviteOperatorFromOrg-email": ["Email", "이메일"],

  "api-inviteViewerFromOrg": ["Invite Viewer From Org", "조직에서 뷰어 초대"],
  "apidesc-inviteViewerFromOrg": ["Invite Viewer From Org", "조직에서 뷰어 초대"],
  "arg-inviteViewerFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-inviteViewerFromOrg-orgId": ["Org ID", "조직 ID"],
  "arg-inviteViewerFromOrg-email": ["Email", "이메일"],
  "argdesc-inviteViewerFromOrg-email": ["Email", "이메일"],

  "api-acceptInviteFromOrg": ["Accept Invite From Org", "조직에서 초대 수락"],
  "apidesc-acceptInviteFromOrg": ["Accept Invite From Org", "조직에서 초대 수락"],
  "arg-acceptInviteFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-acceptInviteFromOrg-orgId": ["Org ID", "조직 ID"],

  "api-removeUserFromOrg": ["Remove User From Org", "조직에서 사용자 삭제"],
  "apidesc-removeUserFromOrg": ["Remove User From Org", "조직에서 사용자 삭제"],
  "arg-removeUserFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-removeUserFromOrg-orgId": ["Org ID", "조직 ID"],
  "arg-removeUserFromOrg-userId": ["User ID", "사용자 ID"],
  "argdesc-removeUserFromOrg-userId": ["User ID", "사용자 ID"],

  "api-removeEmailFromOrg": ["Remove Email From Org", "조직에서 이메일 삭제"],
  "apidesc-removeEmailFromOrg": ["Remove Email From Org", "조직에서 이메일 삭제"],
  "arg-removeEmailFromOrg-orgId": ["Org ID", "조직 ID"],
  "argdesc-removeEmailFromOrg-orgId": ["Org ID", "조직 ID"],
  "arg-removeEmailFromOrg-email": ["Email", "이메일"],
  "argdesc-removeEmailFromOrg-email": ["Email", "이메일"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<OrgSignal, Org>;

export const orgDictionary = { ...modelDictionary, ...signalDictionary };
