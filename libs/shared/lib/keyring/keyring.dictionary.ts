import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Keyring, KeyringFilter, KeyringInsight, KeyringSummary } from "./keyring.constant";
import type { KeyringSignal } from "./keyring.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Keyring", "인증정보"],
  modelDesc: [
    "Keyring is a user's authentication information that can access to the service, such as phone, password, sso, or crypto wallet.",
    "인증정보는 휴대폰, 비밀번호, SSO, 암호화 지갑 등 서비스에 접근할 수 있는 유저의 인증정보입니다.",
  ],

  // * ==================== Model ==================== * //
  name: ["Name", "이름"],
  "desc-name": ["Name or the person who owns the keyring", "인증정보를 소유한 사람의 이름"],

  resetEmail: ["Reset Email", "재설정 이메일"],
  "desc-resetEmail": ["Email for reset password", "비밀번호 재설정을 위한 이메일"],

  agreePolicies: ["Agree Policies", "동의정책"],
  "desc-agreePolicies": [
    "Policies that the user who owns the keyring agreed",
    "인증정보를 소유한 유저가 동의한 정책들",
  ],

  user: ["User", "유저"],
  "desc-user": ["ID of the user who owns the keyring", "인증정보를 소유한 유저의 아이디"],

  wallets: ["Wallets", "지갑"],
  "desc-wallets": ["ID of the wallets that the keyring has", "인증정보가 가지고 있는 지갑들의 아이디"],

  chainWallets: ["Chain Wallets", "체인 지갑"],
  "desc-chainWallets": ["ID of the chain wallets that the keyring has", "인증정보가 가지고 있는 체인 지갑들의 아이디"],

  discord: ["Discord", "디스코드"],
  "desc-discord": ["Discord ID of the user who owns the keyring", "인증정보를 소유한 유저의 디스코드 아이디"],

  accountId: ["ID", "아이디"],
  "desc-accountId": ["Account ID or email information for login", "로그인을 위한 아이디 또는 이메일 정보"],

  password: ["Password", "비밀번호"],
  "desc-password": ["Password information for login", "로그인을 위한 비밀번호 정보"],

  phone: ["Phone", "전화번호"],
  "desc-phone": ["Phone number for login with verification code", "인증번호를 통한 로그인을 위한 전화번호"],

  phoneCode: ["Phone Verification Code", "인증번호"],
  "desc-phoneCode": ["Phone verification code for login or signing up", "로그인 또는 회원가입을 위한 휴대폰 인증번호"],

  phoneCodeAts: ["Phone Code Ats", "인증번호 발급시각"],
  "desc-phoneCodeAts": [
    "Times of the phone verification codes issued at, used for limiting the number of requests",
    "인증번호가 발급된 시각, 요청 횟수 제한에 사용됩니다.",
  ],

  leaveInfo: ["Leave Info", "탈퇴 정보"],
  "desc-leaveInfo": ["Leave information of the user who owns the keyring", "인증정보를 소유한 유저의 탈퇴 정보"],

  verifies: ["Verifies", "인증완료내역"],
  "desc-verifies": ["Registered verification informations that the keyring has", "인증정보가 가지고 있는 인증완료내역"],

  isOnline: ["Is Online", "온라인"],
  "desc-isOnline": ["Is the user who owns the keyring online", "인증정보를 소유한 유저가 온라인인지 여부"],

  lastLoginAt: ["LastLoginAt", "마지막로그인일시"],
  "desc-lastLoginAt": ["The last time the keyring was logged in", "인증정보가 마지막으로 로그인된 시각"],

  verifiedAt: ["Verified At", "인증일시"],
  "desc-verifiedAt": ["The last time the keyring was verified", "인증정보가 마지막으로 인증된 시각"],

  notiSetting: ["Notification Setting", "알림 설정"],
  "desc-notiSetting": ["Notification setting of the keyring", "인증정보의 알림 설정"],

  notiPauseUntil: ["Noti Pause Until", "알림 일시정지"],
  "desc-notiPauseUntil": ["The time until the notification is paused", "알림이 일시정지되는 시각"],

  notiDeviceTokens: ["Noti Device Tokens", "알림 디바이스 토큰"],
  "desc-notiDeviceTokens": ["Device tokens for notification", "알림을 위한 디바이스 토큰"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Keyring count in current query settting", "현재 쿼리 설정에 맞는 인증정보 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-verifies-naver": ["Naver connect", "네이버 연동"],
  "enumdesc-verifies-naver": ["SSO verified by Naver", "네이버를 통해 인증된 SSO"],
  "enum-verifies-kakao": ["Kakao connect", "카카오 연동"],
  "enumdesc-verifies-kakao": ["SSO verified by Kakao", "카카오를 통해 인증된 SSO"],
  "enum-verifies-github": ["Github connect", "깃허브 연동"],
  "enumdesc-verifies-github": ["SSO verified by Github", "깃허브를 통해 인증된 SSO"],
  "enum-verifies-google": ["Google connect", "구글 연동"],
  "enumdesc-verifies-google": ["SSO verified by Google", "구글을 통해 인증된 SSO"],
  "enum-verifies-apple": ["Apple connect", "애플 연동"],
  "enumdesc-verifies-apple": ["SSO verified by Apple", "애플을 통해 인증된 SSO"],
  "enum-verifies-facebook": ["Facebook connect", "페이스북 연동"],
  "enumdesc-verifies-facebook": ["SSO verified by Facebook", "페이스북을 통해 인증된 SSO"],
  "enum-verifies-wallet": ["Crypto wallet connect", "암호화폐 지갑 연동"],
  "enumdesc-verifies-wallet": ["Crypto wallet verified by blockchain", "블록체인을 통해 인증된 암호화폐 지갑"],
  "enum-verifies-password": ["Password connect", "비밀번호 연동"],
  "enumdesc-verifies-password": [
    "Password verified by standalone id and keys",
    "독립된 아이디와 키를 통해 인증된 비밀번호",
  ],
  "enum-verifies-phone": ["Phone connect", "휴대폰 연동"],
  "enumdesc-verifies-phone": ["Phone verified by message code", "메시지 코드를 통해 인증된 휴대폰"],
  "enum-verifies-email": ["Email connect", "이메일 연동"],
  "enumdesc-verifies-email": ["Email verified by message code", "메시지 코드를 통해 인증된 이메일"],

  "enum-notiSetting-disagree": ["Disagree", "동의하지 않음"],
  "enumdesc-notiSetting-disagree": ["Disagree to receive notifications", "알림을 받지 않음"],
  "enum-notiSetting-normal": ["Normal", "일반"],
  "enumdesc-notiSetting-normal": ["Receive notifications normally", "일반적으로 알림을 받음"],
  "enum-notiSetting-fewer": ["Fewer", "적게"],
  "enumdesc-notiSetting-fewer": ["Receive fewer notifications", "적게 알림을 받음"],
  "enum-notiSetting-block": ["Block", "차단"],
  "enumdesc-notiSetting-block": ["Block all notifications", "모든 알림을 차단"],

  "enum-status-prepare": ["Prepare", "준비중"],
  "enumdesc-status-prepare": [
    "Prepared status is in signup progress and cannot use the service yet.",
    "준비중 상태는 회원가입 진행중이며 아직 서비스를 이용할 수 없습니다.",
  ],
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": [
    "Active status is successfully signed up and can use the service.",
    "활성 상태는 정상적으로 회원가입이 완료되어 서비스를 이용할 수 있습니다.",
  ],

  prevPassword: ["Password", "기존 비밀번호"],
  newPassword: ["New Password", "새 비밀번호"],
  passwordConfirm: ["Confirm Password", "비밀번호 확인"],
  changePassword: ["Change Password", "비밀번호 변경"],
  forgotPassword: ["Forgot password?", "비밀번호 찾기"],
  addingWallet: ["Adding Wallet...", "지갑 추가중..."],
  creatingWallet: ["Creating Wallet...", "지갑 생성중..."],
  forgotPasswordDesc: [
    "Enter your account ID or E-mail to receive temporal password.",
    "임시비밀번호 발급을 위한 아이디 또는 이메일을 입력하세요.",
  ],
  addedWallet: ["Added Wallet", "지갑 추가 완료"],
  sendResetEmail: ["Send reset e-mail", "재설정 이메일 발송"],
  signup: ["Create new account", "회원가입"],
  signWithGithub: ["Sign in with Github", "Github로 시작하기"],
  signWithGoogle: ["Sign in with Google", "구글로 시작하기"],
  signWithFacebook: ["Sign in with Facebook", "페이스북로 시작하기"],
  signWithTwitter: ["Sign in with Twitter", "트위터로 시작하기"],
  signWithNaver: ["Sign in with Naver", "네이버로 시작하기"],
  signWithKakao: ["Sign in with Kakao", "카카오로 시작하기"],
  signWithApple: ["Sign in with Apple", "Apple로 시작하기"],
  accountIdPlaceholder: ["ID or E-mail", "아이디 (이메일)"],
  passwordPlaceholder: ["Password", "비밀번호"],
  phonePlaceholder: ["Please enter without '-'.", "'-' 없이 입력해주세요."],
  phoneCodePlaceholder: ["Phone Code", "인증번호"],
  accountNotFoundError: ["No account exists.", "존재하지 않는 이메일입니다."],
  noAccountError: ["No account exists. Sign up is needed,", "가입되지 않은 이메일입니다. 회원가입을 먼저 해주세요."],
  wrongPasswordError: ["Wrong password. Please try again.", "비밀번호가 틀렸습니다. 다시 시도해주세요."],
  notSignedWalletError: ["Wallet is not signed.", "지갑이 서명되지 않았습니다."],
  alreadyAddedWalletError: [
    "Already added, please change wallet and retry.",
    "이미 추가된 지갑입니다. 지갑을 변경하고 다시 시도해주세요.",
  ],
  changeAccountIdLoading: ["Changing Account ID...", "아이디 변경중..."],
  changeAccountIdSuccess: ["Account ID changed successfully.", "아이디가 변경되었습니다."],
  changePasswordLoading: ["Changing Password...", "비밀번호 변경중..."],
  changePasswordSuccess: ["Password changed successfully.", "비밀번호가 변경되었습니다."],
  changePhoneLoading: ["Changing Phone Number...", "휴대폰 번호 변경중..."],
  changePhoneSuccess: ["Phone Number changed successfully.", "휴대폰 번호가 변경되었습니다."],
  createUserLoading: ["Creating User...", "유저 생성중..."],
  createUserSuccess: ["User created successfully.", "유저가 생성되었습니다."],
  resignupDaysRemainError: [
    "You cannot re-signup now. Please try again after re-signup days.",
    "재가입 기간이 아닙니다. 재가입 제한기간이 지난 후 다시 시도해주세요.",
  ],
  invalidePhoneOrPhoneCodeError: [
    "Invalid phone or phone code. Please try again.",
    "유효하지 않은 휴대폰 번호 또는 인증번호입니다. 다시 시도해주세요.",
  ],
  expiredPhoneCodeError: ["Expired phone code. Please try again.", "만료된 인증번호입니다. 다시 시도해주세요."],
  emailSentSuccess: ["Email Sent", "이메일이 발송되었습니다."],
  deleteLoading: ["Deleting...", "삭제중..."],
  deleteSuccess: ["Deleted", "삭제되었습니다."],
  leaveSuccess: ["Leaved", "탈퇴되었습니다."],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Keyring, KeyringInsight, KeyringFilter>;

export const keyringSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalKeyring: ["Total Keyring", "총 인증정보 수"],
  "desc-totalKeyring": ["Total keyring count in the database", "데이터베이스에 저장된 총 인증정보 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<KeyringSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("keyring" as const),
  // * ==================== Endpoint ==================== * //
  "api-myKeyring": ["My keyring information", "내 인증정보"],
  "apidesc-myKeyring": [
    "Get my keyring with authorization bearer JWT token header",
    "Authorization bearer 헤더에 담긴 JWT 토큰으로 내 인증정보를 가져옵니다.",
  ],

  "api-whoAmI": ["My user information", "내 사용자 정보"],
  "apidesc-whoAmI": [
    "Get my user data with authorization bearer JWT token header",
    "Authorization bearer 헤더에 담긴 JWT 토큰으로 내 유저 데이터를 가져옵니다.",
  ],

  "api-refreshJwt": ["Refresh JWT", "JWT 갱신"],
  "apidesc-refreshJwt": [
    "Refresh JWT token before my JWT token expires",
    "내 JWT 토큰이 만료되기 전에 JWT 토큰을 갱신합니다.",
  ],

  "api-signinWithVerification": ["Sign in With Verification", "인증번호로 로그인"],
  "apidesc-signinWithVerification": [
    "Sign in with verification and get JWT token within expiration time after verification issued",
    "인증이 발급된 이후 인증 만료시간 내에 로그인하여 JWT토큰을 발급받ㅇ습니다..",
  ],
  "arg-signinWithVerification-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-signinWithVerification-keyringId": [
    "Keyring ID of the user who owns the keyring",
    "인증정보를 소유한 유저의 아이디",
  ],

  "api-signoutUser": ["Sign out User", "로그아웃"],
  "apidesc-signoutUser": [
    "Locally remove JWT token and request expiration of the token to the server",
    "JWT 토큰을 로컬에서 제거하고 서버에 토큰 만료를 요청합니다.",
  ],

  "api-addNotiDeviceTokenOfMyKeyring": ["Add Noti Device Token Of My Keyring", "내 인증정보에 알림 디바이스 토큰 추가"],
  "apidesc-addNotiDeviceTokenOfMyKeyring": [
    "Add Noti Device Token Of My Keyring to receive notifications",
    "알림을 받기 위해 내 인증정보에 알림 디바이스 토큰을 추가합니다.",
  ],
  "arg-addNotiDeviceTokenOfMyKeyring-notiDeviceToken": ["Noti Device Token", "알림 디바이스 토큰"],
  "argdesc-addNotiDeviceTokenOfMyKeyring-notiDeviceToken": [
    "Device token for notification",
    "알림을 위한 디바이스 토큰",
  ],

  "api-subNotiDeviceTokenOfMyKeyring": [
    "Sub Noti Device Token Of MyKeyring",
    "내 인증정보에서 알림 디바이스 토큰 제거",
  ],
  "apidesc-subNotiDeviceTokenOfMyKeyring": [
    "Sub Noti Device Token Of My Keyring to stop receiving notifications",
    "알림을 받지 않기 위해 내 인증정보에서 알림 디바이스 토큰을 제거합니다.",
  ],
  "arg-subNotiDeviceTokenOfMyKeyring-notiDeviceToken": ["Noti Device Token", "알림 디바이스 토큰"],
  "argdesc-subNotiDeviceTokenOfMyKeyring-notiDeviceToken": [
    "Device token for notification",
    "알림을 위한 디바이스 토큰",
  ],

  "api-getKeyringIdHasChainWallet": ["Get KeyringId Has Wallet", "지갑이 있는 인증정보 가져오기"],
  "apidesc-getKeyringIdHasChainWallet": [
    "Find keyring ID that has the wallet for checking duplication of account or preventing migration of wallet",
    "계정 중복 확인 또는 지갑 마이그레이션을 방지하기 위해 지갑이 있는 인증정보의 keyring ID를 찾습니다.",
  ],

  "api-signupChainWallet": ["Sign up Wallet", "지갑으로 회원가입"],
  "apidesc-signupChainWallet": ["Signup Wallet", "지갑으로 회원가입합니다."],
  "arg-signupChainWallet-keyringId": ["Existing preparing keyring's ID", "기존 준비중인 인증정보의 아이디"],
  "argdesc-signupChainWallet-keyringId": [
    "ID of the preparing keyring that is already created during signup",
    "가입 중에 기존 생성된 준비중 인증정보의 아이디",
  ],

  "api-signinChainWallet": ["Sign in Wallet", "지갑으로 로그인"],
  "apidesc-signinChainWallet": ["Signin Wallet", "지갑으로 로그인합니다."],

  "api-signaddChainWallet": ["Sign add Wallet", "내 인증정보에 지갑 추가"],
  "apidesc-signaddChainWallet": ["Signadd Wallet", "내 인증정보에 지갑을 추가합니다."],

  "api-signsubChainWallet": ["Sign sub Wallet", "내 인증정보에서 지갑 제거"],
  "apidesc-signsubChainWallet": ["Signsub Wallet", "내 인증정보에서 지갑을 제거합니다."],
  "arg-signsubChainWallet-network": ["Network", "네트워크"],
  "argdesc-signsubChainWallet-network": ["Network for remove", "제거할 지갑의 네트워크"],
  "arg-signsubChainWallet-address": ["Address", "주소"],
  "argdesc-signsubChainWallet-address": ["Address for remove", "제거할 지갑의 주소"],

  "api-getKeyringIdHasAccountId": ["Get KeyringId Has AccountId", "아이디가 있는 인증정보 가져오기"],
  "apidesc-getKeyringIdHasAccountId": ["Get KeyringId Has AccountId", "아이디가 있는 인증정보를 가져옵니다."],
  "arg-getKeyringIdHasAccountId-accountId": ["Account ID", "아이디"],
  "argdesc-getKeyringIdHasAccountId-accountId": ["Account ID for check duplication", "중복 확인할 아이디"],

  "api-updatePrepareKeyring": ["Update Prepare Keyring", "인증정보 수정 준비"],
  "apidesc-updatePrepareKeyring": ["Update Prepare Keyring", "인증정보 수정을 위한 준비를 합니다."],
  "arg-updatePrepareKeyring-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-updatePrepareKeyring-keyringId": ["ID of the keyring to be updated", "업데이트할 인증정보의 아이디"],
  "arg-updatePrepareKeyring-data": ["Data", "데이터"],
  "argdesc-updatePrepareKeyring-data": ["Updated data for the keyring", "인증정보의 업데이트된 데이터"],

  "api-signupPassword": ["Sign up Password", "비밀번호로 회원가입"],
  "apidesc-signupPassword": [
    "Signup with account ID and password information",
    "아이디와 비밀번호 정보로 회원가입합니다.",
  ],
  "arg-signupPassword-accountId": ["Account ID", "회원가입 아이디"],
  "argdesc-signupPassword-accountId": ["Account ID for signup", "회원가입을 위한 아이디"],
  "arg-signupPassword-password": ["Password", "비밀번호"],
  "argdesc-signupPassword-password": ["Password for signup", "회원가입을 위한 비밀번호"],
  "arg-signupPassword-token": ["Cloudflare Turnstile", "Cloudflare Turnstile 토큰"],
  "argdesc-signupPassword-token": [
    "Token from Cloudflare Turnstile to prevent bots and spams",
    "봇과 스팸을 방지하기 위한 Cloudflare Turnstile에서 발급받은 토큰",
  ],
  "arg-signupPassword-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-signupPassword-keyringId": ["ID of the keyring for signup", "회원가입을 위한 인증정보의 아이디"],

  "api-signinPassword": ["Sign in Password", "비밀번호로 로그인"],
  "apidesc-signinPassword": ["Sign in Password", "비밀번호로 로그인합니다."],
  "arg-signinPassword-accountId": ["Account ID", "로그인 아이디"],
  "argdesc-signinPassword-accountId": ["Account ID for signin", "로그인을 위한 아이디"],
  "arg-signinPassword-password": ["Password", "비밀번호"],
  "argdesc-signinPassword-password": ["Password for signin", "로그인을 위한 비밀번호"],
  "arg-signinPassword-token": ["Cloudflare Turnstile", "Cloudflare Turnstile 토큰"],
  "argdesc-signinPassword-token": [
    "Token from Cloudflare Turnstile to prevent bots and spams",
    "봇과 스팸을 방지하기 위한 Cloudflare Turnstile에서 발급받은 토큰",
  ],

  "api-signaddPassword": ["Signadd Password", "내 인증정보에 비밀번호 추가"],
  "apidesc-signaddPassword": ["Signadd Password", "내 인증정보에 비밀번호를 추가합니다."],
  "arg-signaddPassword-accountId": ["Account ID", "회원가입 아이디"],
  "argdesc-signaddPassword-accountId": ["Account ID for adding password", "비밀번호 추가를 위한 회원가입 아이디"],
  "arg-signaddPassword-password": ["Password", "비밀번호"],
  "argdesc-signaddPassword-password": ["Password for adding", "추가할 비밀번호"],
  "arg-signaddPassword-token": ["Cloudflare Turnstile", "Cloudflare Turnstile 토큰"],
  "argdesc-signaddPassword-token": [
    "Token from Cloudflare Turnstile to prevent bots and spams",
    "봇과 스팸을 방지하기 위한 Cloudflare Turnstile에서 발급받은 토큰",
  ],

  "api-changePassword": ["Change Password", "비밀번호 변경"],
  "apidesc-changePassword": ["Change Password", "비밀번호를 변경합니다."],
  "arg-changePassword-password": ["Password", "비밀번호"],
  "argdesc-changePassword-password": ["New password", "새로운 비밀번호"],
  "arg-changePassword-prevPassword": ["Previous Password", "이전 비밀번호"],
  "argdesc-changePassword-prevPassword": ["Previous password for verification", "인증을 위한 이전 비밀번호"],
  "arg-changePassword-token": ["Cloudflare Turnstile", "Cloudflare Turnstile 토큰"],
  "argdesc-changePassword-token": [
    "Token from Cloudflare Turnstile to prevent bots and spams",
    "봇과 스팸을 방지하기 위한 Cloudflare Turnstile에서 발급받은 토큰",
  ],

  "api-changePasswordWithPhone": ["Change Password With Phone", "휴대폰 번호로 비밀번호 변경"],
  "apidesc-changePasswordWithPhone": ["Change Password With Phone", "휴대폰 번호로 비밀번호를 변경합니다."],
  "arg-changePasswordWithPhone-password": ["Password", "비밀번호"],
  "argdesc-changePasswordWithPhone-password": ["New password", "새로운 비밀번호"],
  "arg-changePasswordWithPhone-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-changePasswordWithPhone-phone": ["Phone number for verification", "인증을 위한 휴대폰 번호"],
  "arg-changePasswordWithPhone-phoneCode": ["Phone Code", "휴대폰 인증번호"],
  "argdesc-changePasswordWithPhone-phoneCode": ["Verification code sent to the phone", "휴대폰으로 전송된 인증번호"],

  "api-resetPassword": ["Reset Password", "비밀번호 재설정"],
  "apidesc-resetPassword": ["Reset Password", "비밀번호를 재설정합니다."],
  "arg-resetPassword-accountId": ["Account ID", "아이디"],
  "argdesc-resetPassword-accountId": ["Account ID for password reset", "비밀번호 재설정을 위한 아이디"],
  "api-removeMyAccount": ["Remove My Account", "내 계정 삭제"],
  "apidesc-removeMyAccount": ["Remove My Account", "내 계정을 삭제합니다."],

  "api-getKeyringIdHasPhone": ["Get KeyringId Has Phone", "휴대폰 번호가 있는 인증정보 가져오기"],
  "apidesc-getKeyringIdHasPhone": ["Get KeyringId Has Phone", "휴대폰 번호가 있는 인증정보를 가져옵니다."],
  "arg-getKeyringIdHasPhone-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-getKeyringIdHasPhone-phone": ["Phone number for check duplication", "중복 확인할 휴대폰 번호"],

  "api-addPhoneInPrepareKeyring": ["Add Phone In Prepare Keyring", "인증정보 수정중 휴대폰 번호 추가"],
  "apidesc-addPhoneInPrepareKeyring": ["Add Phone In Prepare Keyring", "인증정보 수정중 휴대폰 번호를 추가합니다."],
  "arg-addPhoneInPrepareKeyring-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-addPhoneInPrepareKeyring-phone": ["Phone number to be added", "추가할 휴대폰 번호"],
  "arg-addPhoneInPrepareKeyring-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-addPhoneInPrepareKeyring-keyringId": ["ID of the keyring for modification", "수정할 인증정보의 아이디"],

  "api-addPhoneInActiveKeyring": ["Add Phone In Active Keyring", "인증정보 휴대폰 번호 추가"],
  "apidesc-addPhoneInActiveKeyring": ["Add Phone In Active Keyring", "인증정보에 휴대폰 번호를 추가합니다."],
  "arg-addPhoneInActiveKeyring-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-addPhoneInActiveKeyring-phone": ["Phone number to be added", "추가할 휴대폰 번호"],

  "api-requestPhoneCode": ["Request Phone Code", "휴대폰 인증번호 요청"],
  "apidesc-requestPhoneCode": ["Request Phone Code", "휴대폰 인증번호를 요청합니다."],
  "arg-requestPhoneCode-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-requestPhoneCode-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-requestPhoneCode-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-requestPhoneCode-phone": ["Phone number for verification", "인증을 위한 휴대폰 번호"],
  "arg-requestPhoneCode-hash": ["Hash", "해시"],
  "argdesc-requestPhoneCode-hash": ["Hash value", "해시 값"],

  "api-verifyPhoneCode": ["Verify Phone Code", "휴대폰 인증번호 확인"],
  "apidesc-verifyPhoneCode": ["Verify Phone Code", "휴대폰 인증번호를 확인합니다."],
  "arg-verifyPhoneCode-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-verifyPhoneCode-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-verifyPhoneCode-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-verifyPhoneCode-phone": ["Phone number for verification", "인증을 위한 휴대폰 번호"],
  "arg-verifyPhoneCode-phoneCode": ["Phone Code", "휴대폰 인증번호"],
  "argdesc-verifyPhoneCode-phoneCode": ["Verification code sent to the phone", "휴대폰으로 전송된 인증번호"],

  "api-signupPhone": ["Signup Phone", "휴대폰 번호로 회원가입"],
  "apidesc-signupPhone": ["Signup Phone", "휴대폰 번호로 회원가입합니다."],
  "arg-signupPhone-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-signupPhone-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-signupPhone-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-signupPhone-phone": ["Phone number for signup", "회원가입을 위한 휴대폰 번호"],
  "arg-signupPhone-phoneCode": ["Phone Code", "휴대폰 인증번호"],
  "argdesc-signupPhone-phoneCode": ["Verification code sent to the phone", "휴대폰으로 전송된 인증번호"],
  "arg-signupPhone-data": ["Data", "데이터"],
  "argdesc-signupPhone-data": ["Additional data", "추가 데이터"],

  "api-signinPhone": ["Signin Phone", "휴대폰 번호로 로그인"],
  "apidesc-signinPhone": ["Signin Phone", "휴대폰 번호로 로그인합니다."],
  "arg-signinPhone-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-signinPhone-keyringId": ["Keyring ID", "인증정보 아이디"],
  "arg-signinPhone-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-signinPhone-phone": ["Phone number for verification", "인증을 위한 휴대폰 번호"],
  "arg-signinPhone-phoneCode": ["Phone Code", "휴대폰 인증번호"],
  "argdesc-signinPhone-phoneCode": ["Verification code sent to the phone", "휴대폰으로 전송된 인증번호"],

  "api-signaddPhone": ["Signadd Phone", "내 인증정보에 휴대폰 번호 추가"],
  "apidesc-signaddPhone": ["Signadd Phone", "내 인증정보에 휴대폰 번호를 추가합니다."],
  "arg-signaddPhone-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-signaddPhone-phone": ["Phone number to be added", "추가할 휴대폰 번호"],
  "arg-signaddPhone-phoneCode": ["Phone Code", "휴대폰 인증번호"],
  "argdesc-signaddPhone-phoneCode": ["Verification code sent to the phone", "휴대폰으로 전송된 인증번호"],

  "api-activateUser": ["Activate User", "유저 활성화"],
  "apidesc-activateUser": ["Activate User", "유저를 활성화합니다."],
  "arg-activateUser-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-activateUser-keyringId": ["ID of the keyring", "인증정보의 아이디"],

  "api-changeAccountIdByAdmin": ["Change AccountId By Admin", "관리자가 아이디 변경"],
  "apidesc-changeAccountIdByAdmin": ["Change AccountId By Admin", "관리자가 아이디를 변경합니다."],
  "arg-changeAccountIdByAdmin-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-changeAccountIdByAdmin-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-changeAccountIdByAdmin-accountId": ["Account ID", "아이디"],
  "argdesc-changeAccountIdByAdmin-accountId": ["New account ID", "새로운 아이디"],

  "api-changePasswordByAdmin": ["Change Password By Admin", "관리자가 비밀번호 변경"],
  "apidesc-changePasswordByAdmin": ["Change Password By Admin", "관리자가 비밀번호를 변경합니다."],
  "arg-changePasswordByAdmin-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-changePasswordByAdmin-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-changePasswordByAdmin-password": ["Password", "비밀번호"],
  "argdesc-changePasswordByAdmin-password": ["New password", "새로운 비밀번호"],

  "api-changePhoneByAdmin": ["Change Phone By Admin", "관리자가 휴대폰 번호 변경"],
  "apidesc-changePhoneByAdmin": ["Change Phone By Admin", "관리자가 휴대폰 번호를 변경합니다."],
  "arg-changePhoneByAdmin-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-changePhoneByAdmin-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-changePhoneByAdmin-phone": ["Phone Number", "휴대폰 번호"],
  "argdesc-changePhoneByAdmin-phone": ["New phone number", "새로운 휴대폰 번호"],

  "api-createUserForKeyringByAdmin": ["Create User For Keyring By Admin", "관리자가 인증정보에 유저 생성"],
  "apidesc-createUserForKeyringByAdmin": ["Create User For Keyring By Admin", "관리자가 인증정보에 유저를 생성합니다."],
  "arg-createUserForKeyringByAdmin-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-createUserForKeyringByAdmin-keyringId": ["ID of the keyring", "인증정보의 아이디"],
  "arg-createUserForKeyringByAdmin-data": ["Data", "데이터"],
  "argdesc-createUserForKeyringByAdmin-data": ["Additional data", "추가 데이터"],

  "api-getAccessTokenByAdmin": ["Get Access Token By Admin", "관리자가 액세스 토큰 가져오기"],
  "apidesc-getAccessTokenByAdmin": ["Get Access Token By Admin", "관리자가 액세스 토큰을 가져옵니다."],
  "arg-getAccessTokenByAdmin-keyringId": ["Keyring ID", "인증정보 아이디"],
  "argdesc-getAccessTokenByAdmin-keyringId": ["ID of the keyring", "인증정보의 아이디"],

  "api-github": ["Github", "깃허브"],
  "apidesc-github": ["Github", "깃허브"],

  "api-githubCallback": ["Github Callback", "깃허브 콜백"],
  "apidesc-githubCallback": ["Github Callback", "깃허브 콜백"],

  "api-google": ["Google", "구글"],
  "apidesc-google": ["Google", "구글"],

  "api-googleCallback": ["Google Callback", "구글 콜백"],
  "apidesc-googleCallback": ["Google Callback", "구글 콜백"],

  "api-facebook": ["Facebook", "페이스북"],
  "apidesc-facebook": ["Facebook", "페이스북"],

  "api-facebookCallback": ["Facebook Callback", "페이스북 콜백"],
  "apidesc-facebookCallback": ["Facebook Callback", "페이스북 콜백"],

  "api-apple": ["Apple", "애플"],
  "apidesc-apple": ["Apple", "애플"],

  "api-appleCallback": ["Apple Callback", "애플 콜백"],
  "apidesc-appleCallback": ["Apple Callback", "애플 콜백"],
  "arg-appleCallback-payload": ["Payload", "페이로드"],
  "argdesc-appleCallback-payload": ["Payload from Apple", "애플로부터 받은 페이로드"],

  "api-kakao": ["Kakao", "카카오"],
  "apidesc-kakao": ["Kakao", "카카오"],

  "api-kakaoCallback": ["Kakao Callback", "카카오 콜백"],
  "apidesc-kakaoCallback": ["Kakao Callback", "카카오 콜백"],

  "api-naver": ["Naver", "네이버"],
  "apidesc-naver": ["Naver", "네이버"],

  "api-naverCallback": ["Naver Callback", "네이버 콜백"],
  "apidesc-naverCallback": ["Naver Callback", "네이버 콜백"],

  "api-addNotiDeviceTokensOfMyKeyring": [
    "Add Noti Device Tokens Of My Keyring",
    "내 인증정보에 알림 디바이스 토큰 추가",
  ],
  "apidesc-addNotiDeviceTokensOfMyKeyring": [
    "Add Noti Device Tokens Of My Keyring",
    "내 인증정보에 알림 디바이스 토큰을 추가합니다.",
  ],

  "api-subNotiDeviceTokensOfMyKeyring": [
    "Sub Noti Device Tokens Of My Keyring",
    "내 인증정보에서 알림 디바이스 토큰 제거",
  ],
  "apidesc-subNotiDeviceTokensOfMyKeyring": [
    "Sub Noti Device Tokens Of My Keyring",
    "내 인증정보에서 알림 디바이스 토큰을 제거합니다.",
  ],

  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<KeyringSignal, Keyring>;

export const keyringDictionary = { ...modelDictionary, ...signalDictionary };
