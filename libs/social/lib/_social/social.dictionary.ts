import { CallContribution, ChatContribution, InviteRequest, StoryStat } from "./social.constant";
import { ModelDictionary, scalarDictionaryOf } from "@core/base";

const dictionary = {
  title: ["Title", "제목"],
  author: ["Author", "작성자"],
  privateErr: ["This story is private.", "이 스토리는 비공개입니다."],
  edit: ["Edit", "수정"],
  remove: ["Remove", "삭제"],
  removeMsg: ["Are you sure to remove?", "삭제하시겠습니까?"],
  report: ["Report", "신고"],
  removeComment: ["Remove Comment", "댓글 삭제"],
  placeHolderComment: ["Add a comment...", "댓글을 입력해주세요..."],
  close: ["Close", "닫기"],
  comment: ["Comment", "등록"],
  save: ["Save", "저장"],
  reply: ["Reply", "대댓글"],
  board: ["Board", "게시판"],
  new: ["New", "신규"],
  submit: ["Submit", "제출"],
  placeHolderSearch: ["Input search text", "검색어를 입력해주세요"],
} as const;

const modelDictionary = {
  storyStat: scalarDictionaryOf(StoryStat, {
    modelName: ["Statistic of Story", "스토리 통계"],
    modelDesc: ["Statistic of Story", "스토리 통계"],

    // * ==================== Model ==================== * //
    views: ["Views", "조회수"],
    "desc-views": ["Views", "조회수"],

    likes: ["Likes", "추천수"],
    "desc-likes": ["Likes", "추천수"],

    unlikes: ["Unlikes", "비추천수"],
    "desc-unlikes": ["Unlikes", "비추천수"],

    comments: ["Comments", "댓글수"],
    "desc-comments": ["Comments", "댓글수"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<StoryStat>),
  chatContribution: scalarDictionaryOf(ChatContribution, {
    modelName: ["Chat Contribution", "채팅 기여"],
    modelDesc: ["Chat Contribution", "채팅 기여"],

    // * ==================== Model ==================== * //
    count: ["Count", "개수"],
    "desc-count": ["Count", "개수"],

    size: ["Size", "크기"],
    "desc-size": ["Size", "크기"],

    totalCount: ["Total Count", "총 개수"],
    "desc-totalCount": ["Total Count", "총 개수"],

    totalSize: ["Total Size", "총 크기"],
    "desc-totalSize": ["Total Size", "총 크기"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<ChatContribution>),
  callContribution: scalarDictionaryOf(CallContribution, {
    modelName: ["Call Contribution", "통화 기여"],
    modelDesc: ["Call Contribution", "통화 기여"],

    // * ==================== Model ==================== * //
    speakTime: ["Speak Time", "통화 시간"],
    "desc-speakTime": ["Speak Time", "통화 시간"],

    callTime: ["Call Time", "통화 시간"],
    "desc-callTime": ["Call Time", "통화 시간"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<CallContribution>),
  inviteRequest: scalarDictionaryOf(InviteRequest, {
    modelName: ["Invite Request", "초대 요청"],
    modelDesc: ["Invite Request", "초대 요청"],
    // * ==================== Model ==================== * //
    orgId: ["Organization ID", "조직 ID"],
    "desc-orgId": ["Organization ID", "조직 ID"],

    as: ["As", "역할"],
    "desc-as": ["As", "역할"],

    inviterId: ["Inviter ID", "초대자 ID"],
    "desc-inviterId": ["Inviter ID", "초대자 ID"],

    inviterNickname: ["Inviter Nickname", "초대자 닉네임"],
    "desc-inviterNickname": ["Inviter Nickname", "초대자 닉네임"],

    inviterKeyringId: ["Inviter Keyring ID", "초대자 키링 ID"],
    "desc-inviterKeyringId": ["Inviter Keyring ID", "초대자 키링 ID"],

    inviteeId: ["Invitee ID", "초대받은자 ID"],
    "desc-inviteeId": ["Invitee ID", "초대받은자 ID"],

    inviteeEmail: ["Invitee Email", "초대받은자 이메일"],
    "desc-inviteeEmail": ["Invitee Email", "초대받은자 이메일"],

    inviteeKeyringId: ["Invitee Keyring ID", "초대받은자 키링 ID"],
    "desc-inviteeKeyringId": ["Invitee Keyring ID", "초대받은자 키링 ID"],

    until: ["Until", "종료일"],
    "desc-until": ["Until", "종료일"],
    // * ==================== Model ==================== * //
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<InviteRequest>),
} as const;

const signalDictionary = {} as const;

export const socialDictionary = { social: dictionary, ...modelDictionary, ...signalDictionary } as const;
