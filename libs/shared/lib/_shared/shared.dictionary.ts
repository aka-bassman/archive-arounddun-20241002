import { ChainWallet, ExternalLink, FileMeta, LeaveInfo, ServiceReview } from "./shared.constant";
import { ModelDictionary, scalarDictionaryOf } from "@core/base";

const dictionary = {
  logout: ["Logout", "로그아웃"],
  newest: ["Newest", "최신순"],
  oldest: ["Oldest", "오래된순"],
  actions: ["Actions", "작업"],
  profile: ["Profile", "프로필"],
  signIn: ["Sign In", "로그인"],
  signUp: ["Sign Up", "회원가입"],
  submit: ["Submit", "제출"],
  createModel: ["Create {model}", "{model} 생성하기"],
  createSuccess: ["{model} create success", "{model} 생성 완료"],
  updateModel: ["Update {model}", "{model} 수정하기"],
  removeModel: ["Remove {model}", "{model} 삭제하기"],
  updateSuccess: ["{model} update success", "{model}  수정 완료"],
  signUpFailed: ["Sign Up Failed", "회원가입 실패"],
  removeMsg: ["Are you sure to remove?", "정말로 삭제하시겠습니까?"],
  confirmMsg: ["Are you sure to {actionType}", "진행하시겠습니까? ({actionType})"],
  textTooShortError: ["More than {minlength} characters needed.", "{minlength}자 이상 필요합니다."],
  textTooLongError: ["Less than {maxlength} characters needed.", "{maxlength}자 이하로 필요합니다."],
  selectTooShortError: ["Select at least {minlength} item(s)", "{minlength}개 이상 선택해야합니다."],
  selectTooLongError: ["Select at most {maxlength} item(s)", "{maxlength}개 이하로 선택해야합니다."],
  numberTooSmallError: ["Value must be greater than {min}", "{min}보다 커야합니다."],
  numberTooBigError: ["Value must be less than {max}", "{max}보다 작아야합니다."],
  passwordNotMatchError: ["Password does not match", "비밀번호가 일치하지 않습니다."],
  new: ["New", "신규"],
  edit: ["Edit", "수정"],
  remove: ["Remove", "삭제"],
  selectNetwork: ["Select Network", "네트워크 선택"],
  like: ["Like", "추천"],
  perPage: ["/page", "/페이지"],
  "editor-insert": ["Insert", "추가"],
  "editor-ternInto": ["Tern Into", "변환"],
  "editor-bold": ["Bold (⌘+B)", "굵게 (⌘+B)"],
  "editor-italic": ["Italic (⌘+I)", "기울임 (⌘+I)"],
  "editor-underline": ["Underline (⌘+U)", "밑줄 (⌘+U)"],
  "editor-strike": ["Strikethrough (⌘+⇧+M)", "취소선 (⌘+⇧+M)"],
  "editor-code": ["Code", "코드"],
  "editor-codeBlock": ["Code Block", "코드 블록"],
  "editor-textColor": ["Text Color", "글자색"],
  "editor-bgColor": ["Background Color", "배경색"],
  "editor-align": ["Align", "정렬"],
  "editor-indent": ["Indent", "들여쓰기"],
  "editor-outdent": ["Outdent", "내어쓰기"],
  "editor-link": ["Link", "링크"],
  "editor-bulletedList": ["Bulleted List", "점 목록"],
  "editor-numberedList": ["Numbered List", "번호 목록"],
  "editor-image": ["Image", "이미지"],
  "editor-embed": ["Embed", "임베드"],
  "editor-paragraph": ["Paragraph", "문단"],
  "editor-heading1": ["Heading 1", "제목 1"],
  "editor-heading2": ["Heading 2", "제목 2"],
  "editor-heading3": ["Heading 3", "제목 3"],
  "editor-quote": ["Quote", "인용"],
  "editor-uploadImage": ["Upload Image", "이미지 업로드"],
  "editor-addImage": ["Add Image", "이미지 추가"],
  "editor-lineHeight": ["Line Height", "줄간격"],
  "editor-table": ["Table", "표"],
  "editor-column": ["Column", "열"],
  "editor-row": ["Row", "행"],
  "editor-insertTable": ["Insert Table", "표 삽입"],
  "editor-deleteTable": ["Delete Table", "표 삭제"],
  "editor-columnAfter": ["Insert column After", "열 뒤에 추가"],
  "editor-deleteColumn": ["Delete column", "열 삭제"],
  "editor-rowAfter": ["Insert row After", "행 뒤에 추가"],
  "editor-deleteRow": ["Delete row", "행 삭제"],
  "editor-excalidraw": ["Excalidraw", "엑스칼리드로우"],
} as const;

const modelDictionary = {
  fileMeta: scalarDictionaryOf(FileMeta, {
    modelName: ["File Meta", "파일 메타"],
    modelDesc: ["File Meta", "파일 메타"],

    // * ==================== Model ==================== * //
    lastModifiedAt: ["Last Modified At", "수정일"],
    "desc-lastModifiedAt": ["Last Modified At", "수정일"],

    size: ["Size", "크기"],
    "desc-size": ["Size", "크기"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<FileMeta>),
  externalLink: scalarDictionaryOf(ExternalLink, {
    modelName: ["External Link", "외부 링크"],
    modelDesc: ["External Link", "외부 링크"],

    // * ==================== Model ==================== * //
    type: ["Type", "타입"],
    "desc-type": ["Type", "타입"],

    url: ["URL", "URL"],
    "desc-url": ["URL", "URL"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    "enum-type-website": ["Website", "웹사이트"],
    "enumdesc-type-website": ["Website", "웹사이트"],
    "enum-type-twitter": ["Twitter", "트위터"],
    "enumdesc-type-twitter": ["Twitter", "트위터"],
    "enum-type-discord": ["Discord", "디스코드"],
    "enumdesc-type-discord": ["Discord", "디스코드"],
    "enum-type-telegram": ["Telegram", "텔레그램"],
    "enumdesc-type-telegram": ["Telegram", "텔레그램"],
    "enum-type-instagram": ["Instagram", "인스타그램"],
    "enumdesc-type-instagram": ["Instagram", "인스타그램"],
    "enum-type-facebook": ["Facebook", "페이스북"],
    "enumdesc-type-facebook": ["Facebook", "페이스북"],
    "enum-type-youtube": ["YouTube", "유튜브"],
    "enumdesc-type-youtube": ["YouTube", "유튜브"],
    "enum-type-github": ["GitHub", "깃허브"],
    "enumdesc-type-github": ["GitHub", "깃허브"],
    "enum-type-medium": ["Medium", "미디엄"],
    "enumdesc-type-medium": ["Medium", "미디엄"],
    "enum-type-linkedin": ["LinkedIn", "링크드인"],
    "enumdesc-type-linkedin": ["LinkedIn", "링크드인"],
    "enum-type-reddit": ["Reddit", "레딧"],
    "enumdesc-type-reddit": ["Reddit", "레딧"],
    "enum-type-twitch": ["Twitch", "트위치"],
    "enumdesc-type-twitch": ["Twitch", "트위치"],
    "enum-type-vimeo": ["Vimeo", "비메오"],
    "enumdesc-type-vimeo": ["Vimeo", "비메오"],
    "enum-type-weibo": ["Weibo", "웨이보"],
    "enumdesc-type-weibo": ["Weibo", "웨이보"],
    "enum-type-wikipedia": ["Wikipedia", "위키백과"],
    "enumdesc-type-wikipedia": ["Wikipedia", "위키백과"],
    "enum-type-app": ["App", "앱"],
    "enumdesc-type-app": ["App", "앱"],
    "enum-type-email": ["Email", "이메일"],
    "enumdesc-type-email": ["Email", "이메일"],
    "enum-type-other": ["Other", "기타"],
    "enumdesc-type-other": ["Other", "기타"],
    "enum-branch-debug": ["Debug", "디버그"],
    "enumdesc-branch-debug": ["Debug branch", "디버그 브랜치"],
    "enum-branch-develop": ["Develop", "개발"],
    "enumdesc-branch-develop": ["Develop branch", "개발 브랜치"],
    "enum-branch-main": ["Main", "메인"],
    "enumdesc-branch-main": ["Main branch", "메인 브랜치"],
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<ExternalLink>),
  serviceReview: scalarDictionaryOf(ServiceReview, {
    modelName: ["Service Review", "서비스 리뷰"],
    modelDesc: ["Service Review", "서비스 리뷰"],

    // * ==================== Model ==================== * //
    score: ["Score", "점수"],
    "desc-score": ["Score", "점수"],

    comment: ["Comment", "코멘트"],
    "desc-comment": ["Comment", "코멘트"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<ServiceReview>),
  leaveInfo: scalarDictionaryOf(LeaveInfo, {
    modelName: ["Leave Info", "탈퇴 정보"],
    modelDesc: ["Leave Info", "탈퇴 정보"],

    // * ==================== Model ==================== * //
    type: ["Type", "타입"],
    "desc-type": ["Type", "타입"],

    reason: ["Reason", "사유"],
    "desc-reason": ["Reason", "사유"],

    satisfaction: ["Satisfaction", "만족도"],
    "desc-satisfaction": ["Satisfaction", "만족도"],

    voc: ["VOC", "VOC"],
    "desc-voc": ["VOC", "VOC"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    "enum-type-comeback": ["Comeback", "복귀"],
    "enumdesc-type-comeback": ["Comeback", "복귀"],
    "enum-type-unsatisfied": ["Unsatisfied", "불만족"],
    "enumdesc-type-unsatisfied": ["Unsatisfied", "불만족"],
    "enum-type-other": ["Other", "기타"],
    "enumdesc-type-other": ["Other", "기타"],
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<LeaveInfo>),
  chainWallet: scalarDictionaryOf(ChainWallet, {
    modelName: ["Chain Wallet", "체인 지갑"],
    modelDesc: ["Chain Wallet", "체인 지갑"],

    // * ==================== Model ==================== * //
    network: ["Network", "네트워크"],
    "desc-network": ["Network", "네트워크"],

    address: ["Address", "주소"],
    "desc-address": ["Address", "주소"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    "enum-network-ethereum-mainnet": ["Ethereum Mainnet", "이더리움 메인넷"],
    "enumdesc-network-ethereum-mainnet": ["Ethereum Mainnet", "이더리움 메인넷"],
    "enum-network-ethereum-sepolia": ["Ethereum Sepolia", "이더리움 세폴리아"],
    "enumdesc-network-ethereum-sepolia": ["Ethereum Sepolia", "이더리움 세폴리아"],
    "enum-network-klaytn-cypress": ["Klaytn Cypress", "클레이튼 사이프러스"],
    "enumdesc-network-klaytn-cypress": ["Klaytn Cypress", "클레이튼 사이프러스"],
    "enum-network-klaytn-baobab": ["Klaytn Baobab", "클레이튼 바오밥"],
    "enumdesc-network-klaytn-baobab": ["Klaytn Baobab", "클레이튼 바오밥"],
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<ChainWallet>),
} as const;

const signalDictionary = {} as const;

export const sharedDictionary = { shared: dictionary, ...modelDictionary, ...signalDictionary } as const;
