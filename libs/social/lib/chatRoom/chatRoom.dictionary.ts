import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { ChatRoom, ChatRoomFilter, ChatRoomInsight, ChatRoomSummary } from "./chatRoom.constant";
import type { ChatRoomSignal } from "./chatRoom.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["ChatRoom", "채팅방"],
  modelDesc: ["ChatRoom", "채팅방"],

  // * ==================== Model ==================== * //
  rootType: ["Root Type", "루트 타입"],
  "desc-rootType": ["Root Type", "루트 타입"],

  root: ["Root", "루트"],
  "desc-root": ["Root", "루트"],

  initChatRoom: ["Init ChatRoom", "초기 채팅방"],
  "desc-initChatRoom": ["Init ChatRoom", "초기 채팅방"],

  users: ["Users", "사용자"],
  "desc-users": ["Users", "사용자"],

  chats: ["Chats", "채팅"],
  "desc-chats": ["Chats", "채팅"],

  contribution: ["Contribution", "기여"],
  "desc-contribution": ["Contribution", "기여"],

  roomNum: ["Room Number", "방번호"],
  "desc-roomNum": ["Room Number", "방번호"],

  reads: ["Reads", "읽음"],
  "desc-reads": ["Reads", "읽음"],

  liveUsers: ["Live Users", "실시간 사용자"],
  "desc-liveUsers": ["Live Users", "실시간 사용자"],

  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  latestRoomNum: ["Latest Room Number", "최신 방번호"],
  "desc-latestRoomNum": ["Latest Room Number", "최신 방번호"],

  recent: ["Recent", "최근"],
  "desc-recent": ["Recent chatRoom", "최근 채팅방"],
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  "enum-status-tailed": ["Tailed", "연결"],
  "enumdesc-status-tailed": ["Tailed status", "연결 상태"],
  "enum-status-closed": ["Closed", "닫힘"],
  "enumdesc-status-closed": ["Closed status", "닫힌 상태"],

  notMemberError: ["You are not a member of this chat room", "이 채팅방의 멤버가 아닙니다"],
  noChatDataError: ["No chat data", "채팅 데이터가 없습니다"],
  invalidChatInputError: ["Invalid chat input", "유효하지 않은 채팅 입력"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<ChatRoom, ChatRoomInsight, ChatRoomFilter>;

export const chatRoomSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalChatRoom: ["Total ChatRoom", "총 채팅방수"],
  "desc-totalChatRoom": ["Total number of chat rooms", "총 채팅방의 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ChatRoomSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("chatRoom" as const),
  // * ==================== Endpoint ==================== * //
  "api-chatRoomListInSelf": ["List in Self", "자신의 채팅방 리스트"],
  "apidesc-chatRoomListInSelf": ["ChatRoom list in myself", "자신의 채팅방 리스트"],
  "arg-chatRoomListInSelf-skip": ["Skip", "건너뛰기"],
  "argdesc-chatRoomListInSelf-skip": ["Skip", "건너뛰기"],
  "arg-chatRoomListInSelf-limit": ["Limit", "제한"],
  "argdesc-chatRoomListInSelf-limit": ["Limit", "제한"],
  "arg-chatRoomListInSelf-sort": ["Sort", "정렬"],
  "argdesc-chatRoomListInSelf-sort": ["Sort", "정렬"],

  "api-chatRoomInsightInSelf": ["Insight in Self", "자신의 채팅방 인사이트"],
  "apidesc-chatRoomInsightInSelf": ["ChatRoom insight in myself", "자신의 채팅방 인사이트"],

  "api-chatRoomListInRoot": ["List in Root", "루트의 채팅방 리스트"],
  "apidesc-chatRoomListInRoot": ["ChatRoom list in root", "루트의 채팅방 리스트"],
  "arg-chatRoomListInRoot-root": ["Root", "루트"],
  "argdesc-chatRoomListInRoot-root": ["Root", "루트"],
  "arg-chatRoomListInRoot-skip": ["Skip", "건너뛰기"],
  "argdesc-chatRoomListInRoot-skip": ["Skip", "건너뛰기"],
  "arg-chatRoomListInRoot-limit": ["Limit", "제한"],
  "argdesc-chatRoomListInRoot-limit": ["Limit", "제한"],
  "arg-chatRoomListInRoot-sort": ["Sort", "정렬"],
  "argdesc-chatRoomListInRoot-sort": ["Sort", "정렬"],

  "api-chatRoomInsightInRoot": ["Insight in Root", "루트의 채팅방 인사이트"],
  "apidesc-chatRoomInsightInRoot": ["ChatRoom insight in root", "루트의 채팅방 인사이트"],
  "arg-chatRoomInsightInRoot-root": ["Root", "루트"],
  "argdesc-chatRoomInsightInRoot-root": ["Root", "루트"],

  "api-chatRoomListInInit": ["List in Root", "루트의 채팅방 리스트"],
  "apidesc-chatRoomListInInit": ["ChatRoom list in root", "루트의 채팅방 리스트"],
  "arg-chatRoomListInInit-initChatRoom": ["Init ChatRoom", "초기 채팅방"],
  "argdesc-chatRoomListInInit-initChatRoom": ["Init ChatRoom", "초기 채팅방"],
  "arg-chatRoomListInInit-skip": ["Skip", "건너뛰기"],
  "argdesc-chatRoomListInInit-skip": ["Skip", "건너뛰기"],
  "arg-chatRoomListInInit-limit": ["Limit", "제한"],
  "argdesc-chatRoomListInInit-limit": ["Limit", "제한"],
  "arg-chatRoomListInInit-sort": ["Sort", "정렬"],
  "argdesc-chatRoomListInInit-sort": ["Sort", "정렬"],

  "api-chatRoomInsightInInit": ["Insight in Root", "루트의 채팅방 인사이트"],
  "apidesc-chatRoomInsightInInit": ["ChatRoom insight in root", "루트의 채팅방 인사이트"],
  "arg-chatRoomInsightInInit-initChatRoom": ["Init ChatRoom", "초기 채팅방"],
  "argdesc-chatRoomInsightInInit-initChatRoom": ["Init ChatRoom", "초기 채팅방"],

  "api-addChat": ["Add Chat", "채팅 추가"],
  "apidesc-addChat": ["Add Chat", "채팅 추가"],
  "arg-addChat-root": ["Root", "루트"],
  "argdesc-addChat-root": ["Root", "루트"],
  "arg-addChat-data": ["Chat", "채팅"],
  "argdesc-addChat-data": ["Chat", "채팅"],

  "api-readChat": ["Read Chat", "채팅 읽음"],
  "apidesc-readChat": ["Read Chat", "채팅 읽음"],
  "arg-readChat-root": ["Root", "루트"],
  "argdesc-readChat-root": ["Root", "루트"],

  "api-chatAdded": ["Chat Added", "채팅 추가됨"],
  "apidesc-chatAdded": ["Chat Added", "채팅 추가됨"],
  "arg-chatAdded-root": ["Root", "루트"],
  "argdesc-chatAdded-root": ["Root", "루트"],
  "arg-chatAdded-chat": ["Chat", "채팅"],
  "argdesc-chatAdded-chat": ["Chat", "채팅"],

  "api-closeChatRoom": ["Close ChatRoom", "채팅방 닫기"],
  "apidesc-closeChatRoom": ["Close ChatRoom", "채팅방 닫기"],

  "api-openChatRoom": ["Open ChatRoom", "채팅방 열기"],
  "apidesc-openChatRoom": ["Open ChatRoom", "채팅방 열기"],

  "api-unlockMessage": ["Unlock Message", "메시지 잠금 해제"],
  "apidesc-unlockMessage": ["Unlock Message", "메시지 잠금 해제"],

  "api-getChatRoomByRoot": ["Get ChatRoom By Root", "루트로 채팅방 가져오기"],
  "apidesc-getChatRoomByRoot": ["Get ChatRoom By Root", "루트로 채팅방 가져오기"],

  "api-leaveChatRoom": ["Leave ChatRoom", "채팅방 나가기"],
  "apidesc-leaveChatRoom": ["Leave ChatRoom", "채팅방 나가기"],

  "api-replyChatRoom": ["Reply ChatRoom", "채팅방 답장"],
  "apidesc-replyChatRoom": ["Reply ChatRoom", "채팅방 답장"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ChatRoomSignal, ChatRoom>;

export const chatRoomDictionary = { ...modelDictionary, ...signalDictionary };
