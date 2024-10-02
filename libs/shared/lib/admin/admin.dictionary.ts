import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Admin, AdminFilter, AdminInsight, AdminSummary } from "./admin.constant";
import type { AdminSignal } from "./admin.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Admin", "관리자"],
  modelDesc: [
    "Admin is a person who manages the system, that has a data managent and system monitoring authority.",
    "관리자는 시스템을 관리하는 사람으로, 데이터 관리 및 시스템 모니터링 권한을 가지고 있습니다.",
  ],

  // * ==================== Model ==================== * //
  accountId: ["ID", "아이디"],
  "desc-accountId": ["E-mail or account ID, used for signing", "이메일 또는 아이디, 로그인에 사용됩니다."],

  password: ["Password", "패스워드"],
  "desc-password": ["Password, more than or equal 8 characters", "비밀번호 (8자 이상)"],

  roles: ["Roles", "역할"],
  "desc-roles": ["Autorized Roles (e.g. admin, superAdmin)", "부여된 권한 리스트 (admin, superAdmin 등)"],

  lastLoginAt: ["Last Login", "마지막 로그인"],
  "desc-lastLoginAt": ["Last system login time", "마지막 로그인 시각"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Admin count in current query settting", "현재 쿼리 설정에 맞는 관리자 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-roles-manager": ["Manager", "매니저"],
  "enumdesc-roles-manager": [
    "Manager has an authority to manage the system, but cannot add or remove otehr admin or managers",
    "관리자는 시스템을 관리할 수 있는 권한을 가지고 있지만, 다른 관리자나 매니저를 추가하거나 삭제할 수 없습니다.",
  ],
  "enum-roles-admin": ["Admin", "관리자"],
  "enumdesc-roles-admin": [
    "Admin has an authority to manage the system, and can add or remove other admin or managers except superAdmin",
    "관리자는 시스템을 관리할 수 있는 권한을 가지고 있으며, 최고 관리자를 제외한 다른 관리자나 매니저를 추가하거나 삭제할 수 있습니다.",
  ],
  "enum-roles-superAdmin": ["Super Admin", "최고 관리자"],
  "enumdesc-roles-superAdmin": [
    "Super Admin has an authority to manage the system, and can add or remove other admin or managers",
    "최고 관리자는 시스템을 관리할 수 있는 권한을 가지고 있으며, 다른 관리자나 매니저를 추가하거나 삭제할 수 있습니다.",
  ],

  "enum-status-active": ["Active", "활동중"],
  "enumdesc-status-active": [
    "Active status of admin can normally use the system",
    "활동중인 관리자는 시스템을 정상적으로 사용할 수 있습니다.",
  ],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Admin, AdminInsight, AdminFilter>;

export const adminSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalAdmin: ["Total Admin", "총 관리자 수"],
  "desc-totalAdmin": ["Total admin count in the database", "데이터베이스에 저장된 총 관리자 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<AdminSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("admin" as const),

  // * ==================== Endpoint ==================== * //
  // * Query.isAdminSystemInitialized * //
  "api-isAdminSystemInitialized": ["Is Admin System Initialized", "관리자 시스템 초기화 여부"],
  "apidesc-isAdminSystemInitialized": [
    "Check if the admin system is initialized",
    "관리자 시스템이 초기화되었는지 확인합니다.",
  ],

  // * Mutation.createAdminWithInitialize * //
  "api-createAdminWithInitialize": ["Create Admin With Initialize", "초기 관리자 생성"],
  "apidesc-createAdminWithInitialize": [
    "Create admin with initialize, only available when the admin system is not initialized",
    "관리자 시스템이 초기화되지 않은 경우에만 초기 관리자를 생성할 수 있습니다.",
  ],
  "arg-createAdminWithInitialize-data": ["Admin Data", "관리자 정보"],
  "argdesc-createAdminWithInitialize-data": ["Admin data to create", "생성할 관리자 정보"],

  // * Query.me * //
  "api-me": ["Get Admin", "관리자 정보 조회"],
  "apidesc-me": [
    "Get Admin information with JWT Auth Token, Bearer token authorization header is required",
    "JWT 관리자 토큰을 이용하여 관리자 정보를 조회합니다. Bearer token authorization header가 필요합니다.",
  ],

  // * Mutation.signinAdmin * //
  "api-signinAdmin": ["Sign in admin credential", "관리자 로그인"],
  "apidesc-signinAdmin": [
    "Sign in admin credential with accountId and password",
    "아이디와 패스워드를 이용하여 관리자 로그인을 시도합니다.",
  ],
  "arg-signinAdmin-accountId": ["Account ID", "아이디"],
  "argdesc-signinAdmin-accountId": [
    "E-mail or account ID, used for signing",
    "이메일 또는 아이디, 로그인에 사용됩니다.",
  ],
  "arg-signinAdmin-password": ["Password", "패스워드"],
  "argdesc-signinAdmin-password": ["Password, more than or equal 8 characters", "비밀번호 (8자 이상)"],

  // * Mutation.signoutAdmin * //
  "api-signoutAdmin": ["Sign out admin credential", "관리자 로그아웃"],
  "apidesc-signoutAdmin": [
    "Sign out admin credential and delete JWT Auth Token of admin(me)",
    "관리자 로그아웃 및 JWT 관리자토큰(me)값을 삭제합니다",
  ],

  // * Mutation.addAdminRole * //
  "api-addAdminRole": ["Add admin role", "관리자 권한 추가"],
  "apidesc-addAdminRole": [
    "Add role authentication of admin, such as admin, superAdmin",
    "admin, superAdmin과 같은 관리자 권한을 추가합니다.",
  ],
  "arg-addAdminRole-adminId": ["Admin ID", "관리자 아이디"],
  "argdesc-addAdminRole-adminId": ["Admin ID to add role", "관리자 권한을 추가할 관리자 아이디"],
  "arg-addAdminRole-role": ["Role", "권한"],
  "argdesc-addAdminRole-role": ["Role to add", "추가할 권한"],

  // * Mutation.subAdminRole * //
  "api-subAdminRole": ["Subtract admin role", "관리자 권한 제거"],
  "apidesc-subAdminRole": [
    "Subtract role authentication of admin, such as admin, superAdmin",
    "admin, superAdmin과 같은 관리자 권한을 제거합니다.",
  ],
  "arg-subAdminRole-adminId": ["Admin ID", "관리자 아이디"],
  "argdesc-subAdminRole-adminId": ["Admin ID to subtract role", "관리자 권한을 제거할 관리자 아이디"],
  "arg-subAdminRole-role": ["Role", "권한"],
  "argdesc-subAdminRole-role": ["Role to subtract", "제거할 권한"],

  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<AdminSignal, Admin>;

export const adminDictionary = { ...modelDictionary, ...signalDictionary };
