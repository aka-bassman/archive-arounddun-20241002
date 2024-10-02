import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { User, UserFilter, UserInsight, UserSummary } from "./user.constant";
import type { UserSignal } from "./user.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["User", "유저"],
  modelDesc: [
    "User is an public information of the user who uses the service. It can be displayed to other users.",
    "유저는 서비스를 이용하는 사용자의 공개 정보입니다. 다른 사용자에게 표시될 수 있습니다.",
  ],

  // * ==================== Model ==================== * //
  nickname: ["Nickname", "닉네임"],
  "desc-nickname": ["Nickname of the user that is displayed to other users", "다른 사용자에게 표시되는 유저의 닉네임"],

  image: ["Image", "이미지"],
  "desc-image": ["Profile image of the user", "유저의 프로필 이미지"],

  images: ["Images", "이미지들"],
  "desc-images": ["Profile images of the user", "유저의 프로필 이미지들"],

  appliedImages: ["Applied Images", "신청된 이미지들"],
  "desc-appliedImages": ["Applied images of the user", "유저의 신청된 이미지들"],

  requestRoles: ["Request Roles", "권한 요청"],
  "desc-requestRoles": ["Requested roles of the user", "유저의 권한 요청"],

  imageNum: ["Image Number", "이미지 수"],
  "desc-imageNum": ["Number of images of the user", "유저의 이미지 수"],

  keyring: ["Keyring", "Keyring"],
  "desc-keyring": ["Keyring ID of the user", "유저의 인증정보 아이디"],

  roles: ["Roles", "권한"],
  "desc-roles": ["Authorized roles of the user", "유저의 권한"],

  playing: ["Playing", "플레이 중"],
  "desc-playing": ["Services that the user is playing", "유저가 플레이 중인 서비스"],

  lastLoginAt: ["Last Login At", "최근 로그인"],
  "desc-lastLoginAt": ["Latest login time of the user", "유저의 최근 로그인 시간"],

  profileStatus: ["Profile Status", "프로필 상태"],
  "desc-profileStatus": ["Profile approval status of the user", "유저의 프로필 승인 상태"],

  restrictUntil: ["Restrict Until", "제한 기간"],
  "desc-restrictUntil": ["Due date of the user's restriction", "유저의 제한 기간"],

  restrictReason: ["Restrict Reason", "제한 사유"],
  "desc-restrictReason": ["Restrict reason of the user", "유저의 제한 사유"],

  journeyStatus: ["Journey Status", "여정 상태"],
  "desc-journeyStatus": ["Journey status of the user", "유저의 여정 상태"],

  journeyStatusAt: ["Journey Status At", "여정 상태 시간"],
  "desc-journeyStatusAt": ["Journey status time of the user", "유저의 여정 상태 시간"],

  inquiryStatus: ["Inquiry Status", "획득 상태"],
  "desc-inquiryStatus": ["Inquiry status of the user", "유저의 획득 상태"],

  inquiryStatusAt: ["Inquiry Status At", "획득 상태 시간"],
  "desc-inquiryStatusAt": ["Inquiry status time of the user", "유저의 획득 상태 시간"],

  leaveInfo: ["Leave Info", "탈퇴 정보"],
  "desc-leaveInfo": ["Leave information of the user", "유저의 탈퇴 정보"],

  joinAt: ["Join At", "가입일"],
  "desc-joinAt": ["Join date of the user", "유저의 가입일"],

  leftAt: ["Left At", "탈퇴일"],
  "desc-leftAt": ["Leave date of the user", "유저의 탈퇴일"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["User count in current query settting", "현재 쿼리 설정에 맞는 사용자 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-requestRoles-root": ["Root", "루트"],
  "enumdesc-requestRoles-root": ["Root role", "루트 권한"],
  "enum-requestRoles-admin": ["Admin", "관리자"],
  "enumdesc-requestRoles-admin": ["Admin role", "관리자 권한"],
  "enum-requestRoles-user": ["User", "사용자"],
  "enumdesc-requestRoles-user": ["User role", "사용자 권한"],
  "enum-requestRoles-business": ["Business", "비지니스"],
  "enumdesc-requestRoles-business": ["Business role", "비지니스 권한"],
  "enum-requestRoles-guest": ["Guest", "게스트"],
  "enumdesc-requestRoles-guest": ["Guest role", "게스트 권한"],

  "enum-roles-root": ["Root", "루트"],
  "enumdesc-roles-root": ["Root role", "루트 권한"],
  "enum-roles-admin": ["Admin", "관리자"],
  "enumdesc-roles-admin": ["Admin role", "관리자 권한"],
  "enum-roles-user": ["User", "사용자"],
  "enumdesc-roles-user": ["User role", "사용자 권한"],
  "enum-roles-business": ["Business", "비지니스"],
  "enumdesc-roles-business": ["Business role", "비지니스 권한"],
  "enum-roles-guest": ["Guest", "게스트"],
  "enumdesc-roles-guest": ["Guest role", "게스트 권한"],

  "enum-profileStatus-active": ["Active", "활성"],
  "enumdesc-profileStatus-active": ["Active profile status", "활성 프로필 상태"],
  "enum-profileStatus-prepare": ["Prepare", "준비"],
  "enumdesc-profileStatus-prepare": ["Prepare profile status", "준비 프로필 상태"],
  "enum-profileStatus-applied": ["Applied", "신청됨"],
  "enumdesc-profileStatus-applied": ["Applied profile status", "신청됨 프로필 상태"],
  "enum-profileStatus-reapplied": ["Reapplied", "재신청됨"],
  "enumdesc-profileStatus-reapplied": ["Reapplied profile status", "재신청됨 프로필 상태"],
  "enum-profileStatus-approved": ["Approved", "승인됨"],
  "enumdesc-profileStatus-approved": ["Approved profile status", "승인됨 프로필 상태"],
  "enum-profileStatus-featured": ["Featured", "주목받는"],
  "enumdesc-profileStatus-featured": ["Featured profile status", "주목받는 프로필 상태"],
  "enum-profileStatus-reserved": ["Reserved", "예약됨"],
  "enumdesc-profileStatus-reserved": ["Reserved profile status", "예약됨 프로필 상태"],
  "enum-profileStatus-rejected": ["Rejected", "거부됨"],
  "enumdesc-profileStatus-rejected": ["Rejected profile status", "거부됨 프로필 상태"],

  "enum-journeyStatus-welcome": ["Welcome", "환영"],
  "enumdesc-journeyStatus-welcome": ["Welcome journey status", "환영 여정 상태"],
  "enum-journeyStatus-waiting": ["Waiting", "대기"],
  "enumdesc-journeyStatus-waiting": ["Waiting journey status", "대기 여정 상태"],
  "enum-journeyStatus-firstJoin": ["First Join", "첫 가입"],
  "enumdesc-journeyStatus-firstJoin": ["First Join journey status", "첫 가입 여정 상태"],
  "enum-journeyStatus-joined": ["Joined", "가입됨"],
  "enumdesc-journeyStatus-joined": ["Joined journey status", "가입됨 여정 상태"],
  "enum-journeyStatus-leaving": ["Leaving", "떠나는 중"],
  "enumdesc-journeyStatus-leaving": ["Leaving journey status", "떠나는 중 여정 상태"],
  "enum-journeyStatus-leaved": ["Leaved", "떠남"],
  "enumdesc-journeyStatus-leaved": ["Leaved journey status", "떠남 여정 상태"],
  "enum-journeyStatus-returning": ["Returning", "돌아오는중"],
  "enumdesc-journeyStatus-returning": ["Returning journey status", "돌아오는중 여정 상태"],
  "enum-journeyStatus-returned": ["Returned", "돌아옴"],
  "enumdesc-journeyStatus-returned": ["Returned journey status", "돌아옴 여정 상태"],

  "enum-inquiryStatus-welcome": ["Welcome", "환영"],
  "enumdesc-inquiryStatus-welcome": ["Welcome inquiry status", "환영 획득 상태"],
  "enum-inquiryStatus-concerned": ["Concerned", "걱정 상태"],
  "enumdesc-inquiryStatus-concerned": ["Concerned inquiry status", "걱정 획득 상태"],
  "enum-inquiryStatus-concernedPayable": ["Concerned Payable", "걱정 지불 가능"],
  "enumdesc-inquiryStatus-concernedPayable": ["Concerned Payable inquiry status", "걱정 지불 가능 획득 상태"],
  "enum-inquiryStatus-concernedWaitPay": ["Concerned Wait Pay", "걱정 지불 대기"],
  "enumdesc-inquiryStatus-concernedWaitPay": ["Concerned Wait Pay inquiry status", "걱정 지불 대기 획득 상태"],
  "enum-inquiryStatus-payable": ["Payable", "지불 가능"],
  "enumdesc-inquiryStatus-payable": ["Payable inquiry status", "지불 가능 획득 상태"],
  "enum-inquiryStatus-waitPay": ["Wait Pay", "지불 대기"],
  "enumdesc-inquiryStatus-waitPay": ["Wait Pay inquiry status", "지불 대기 획득 상태"],
  "enum-inquiryStatus-paid": ["Paid", "지불됨"],
  "enumdesc-inquiryStatus-paid": ["Paid inquiry status", "지불됨 획득 상태"],
  "enum-inquiryStatus-ashed": ["Ashed", "종료됨"],
  "enumdesc-inquiryStatus-ashed": ["Ashed inquiry status", "종료됨 획득 상태"],
  "enum-inquiryStatus-morePayable": ["More Payable", "더 지불 가능"],
  "enumdesc-inquiryStatus-morePayable": ["More Payable inquiry status", "더 지불 가능 획득 상태"],
  "enum-inquiryStatus-waitMorePay": ["Wait More Pay", "더 지불 대기"],
  "enumdesc-inquiryStatus-waitMorePay": ["Wait More Pay inquiry status", "더 지불 대기 획득 상태"],
  "enum-inquiryStatus-inquired": ["Inquired", "완전획득됨"],
  "enumdesc-inquiryStatus-inquired": ["Inquired inquiry status", "완전획득됨 획득 상태"],
  "enum-inquiryStatus-vip": ["VIP", "VIP"],
  "enumdesc-inquiryStatus-vip": ["VIP inquiry status", "VIP 획득 상태"],
  "enum-inquiryStatus-kicked": ["Kicked", "킥됨"],
  "enumdesc-inquiryStatus-kicked": ["Kicked inquiry status", "킥됨 획득 상태"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  "enum-status-dormant": ["Dormant", "휴면"],
  "enumdesc-status-dormant": ["Dormant status", "휴면 상태"],
  "enum-status-restricted": ["Restricted", "제한됨"],
  "enumdesc-status-restricted": ["Restricted status", "제한됨 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<User, UserInsight, UserFilter>;

export const userSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalUser: ["Total User", "총 사용자 수"],
  "desc-totalUser": ["Total user count in the database", "데이터베이스에 저장된 총 사용자 수"],

  restrictedUser: ["Restricted User", "제한된 사용자"],
  "desc-restrictedUser": ["Number of users with restrictions", "제한이 있는 사용자 수"],

  businessUser: ["Business User", "비지니스 사용자"],
  "desc-businessUser": ["Number of business users", "비지니스 사용자 수"],

  hau: ["HAU", "HAU"],
  "desc-hau": ["Hourly Active User", "시간별 활성 사용자"],

  dau: ["DAU", "DAU"],
  "desc-dau": ["Daily Active User", "일별 활성 사용자"],

  wau: ["WAU", "WAU"],
  "desc-wau": ["Weekly Active User", "주별 활성 사용자"],

  mau: ["MAU", "MAU"],
  "desc-mau": ["Monthly Active User", "월별 활성 사용자"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<UserSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("user" as const),
  // * ==================== Endpoint ==================== * //
  "api-addUserRole": ["Add User Role", "유저 역할 추가"],
  "apidesc-addUserRole": ["API to add a role to a user", "유저에게 역할을 추가하는 API"],
  "arg-addUserRole-userId": ["User ID", "유저 ID"],
  "argdesc-addUserRole-userId": ["User ID", "유저 ID"],
  "arg-addUserRole-role": ["Role", "역할"],
  "argdesc-addUserRole-role": ["Role", "역할"],

  "api-subUserRole": ["Subtract User Role", "유저 역할 제거"],
  "apidesc-subUserRole": ["API to subtract a role from a user", "유저로부터 역할을 제거하는 API"],
  "arg-subUserRole-userId": ["User ID", "유저 ID"],
  "argdesc-subUserRole-userId": ["User ID", "유저 ID"],
  "arg-subUserRole-role": ["Role", "역할"],
  "argdesc-subUserRole-role": ["Role", "역할"],

  "api-getUserIdHasNickname": ["Get User ID with Nickname", "닉네임을 가진 유저 ID 조회"],
  "apidesc-getUserIdHasNickname": [
    "API to get the user ID with a given nickname",
    "주어진 닉네임을 가진 유저 ID를 조회하는 API",
  ],
  "arg-getUserIdHasNickname-nickname": ["Nickname", "닉네임"],
  "argdesc-getUserIdHasNickname-nickname": ["Nickname", "닉네임"],

  "api-restrictUser": ["Restrict User", "유저 제한"],
  "apidesc-restrictUser": ["API to restrict a user", "유저를 제한하는 API"],
  "arg-restrictUser-userId": ["User ID", "유저 ID"],
  "argdesc-restrictUser-userId": ["User ID", "유저 ID"],
  "arg-restrictUser-restrictReason": ["Restriction Reason", "제한 사유"],
  "argdesc-restrictUser-restrictReason": ["Restriction Reason", "제한 사유"],
  "arg-restrictUser-restrictUntil": ["Restriction Until", "제한 기간"],
  "argdesc-restrictUser-restrictUntil": ["Restriction Until", "제한 기간"],

  "api-releaseUser": ["Release User", "유저 해제"],
  "apidesc-releaseUser": ["API to release a user from restriction", "유저의 제한을 해제하는 API"],
  "arg-releaseUser-userId": ["User ID", "유저 ID"],
  "argdesc-releaseUser-userId": ["User ID", "유저 ID"],

  "api-removeUser": ["Remove User", "유저 삭제"],
  "apidesc-removeUser": ["API to remove a user", "유저를 삭제하는 API"],
  "arg-removeUser-userId": ["User ID", "유저 ID"],
  "argdesc-removeUser-userId": ["User ID", "유저 ID"],

  "api-updateUserForPrepare": ["Update User for Prepare", "준비를 위한 유저 업데이트"],
  "apidesc-updateUserForPrepare": ["API to update a user for preparation", "준비를 위해 유저를 업데이트하는 API"],
  "arg-updateUserForPrepare-keyringId": ["Keyring ID", "키링 ID"],
  "argdesc-updateUserForPrepare-keyringId": ["Keyring ID", "키링 ID"],
  "arg-updateUserForPrepare-data": ["Data", "데이터"],
  "argdesc-updateUserForPrepare-data": ["Data", "데이터"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<UserSignal, User>;

export const userDictionary = { ...modelDictionary, ...signalDictionary };
