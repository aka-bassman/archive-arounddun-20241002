import { AccessLog, AccessStat, AccessToken, Coordinate } from "./util.constant";
import { ModelDictionary, scalarDictionaryOf } from "@core/base";

const dictionary = {
  info: ["Info", "정보"],
  noData: ["Empty", "비어있음"],
  unauthorized: ["Unauthorized", "권한 없음"],
  ok: ["OK", "확인"],
  cancel: ["Cancel", "취소"],
  processing: ["Processing...", "처리중..."],
  processed: ["Processed", "처리 완료"],
  invalidValueError: ["Value is not valid", "유효하지 않은 값입니다."],
  emailInvalidError: ["Email is not valid", "유효하지 않은 이메일입니다."],
  phoneInvalidError: ["Phone is not valid", "유효하지 않은 전화번호입니다."],
  confirmClose: ["Are you sure you want to close the modal?", "모달을 닫으시겠습니까?"],
  selectDateError: ["Please select a date.", "날짜를 선택해주세요."],
  longitude: ["Longitude", "경도"],
  latitude: ["Latitude", "위도"],
  linkCopied: ["Link copied. Share it wherever you want!", "링크 복사 완료! 원하는 곳에 공유해보세요!"],
} as const;

const modelDictionary = {
  accessToken: scalarDictionaryOf(AccessToken, {
    modelName: ["Access Token", "액세스 토큰"],
    modelDesc: ["Access Token", "액세스 토큰"],
    // * ==================== Model ==================== * //
    jwt: ["JWT", "JWT"],
    "desc-jwt": ["JWT", "JWT"],
    // * ==================== Model ==================== * //
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<AccessToken>),
  accessStat: scalarDictionaryOf(AccessStat, {
    modelName: ["Access Statistics", "액세스 통계"],
    modelDesc: ["Access Statistics", "액세스 통계"],
    // * ==================== Model ==================== * //
    request: ["Request", "요청"],
    "desc-request": ["Request", "요청"],

    device: ["Device", "디바이스"],
    "desc-device": ["Device", "디바이스"],

    ip: ["IP", "아이피"],
    "desc-ip": ["IP", "아이피"],

    country: ["Country", "국가"],
    "desc-country": ["Country", "국가"],
    // * ==================== Model ==================== * //
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<AccessStat>),
  coordinate: scalarDictionaryOf(Coordinate, {
    modelName: ["Coordinate", "좌표"],
    modelDesc: ["Coordinate", "좌표"],
    // * ==================== Model ==================== * //
    type: ["Type", "타입"],
    "desc-type": ["Type", "타입"],

    coordinates: ["Coordinates", "좌표"],
    "desc-coordinates": ["Coordinates", "좌표"],

    altitude: ["Altitude", "고도"],
    "desc-altitude": ["Altitude", "고도"],
    // * ==================== Model ==================== * //

    // * ==================== Etc ==================== * //
    "enum-type-Point": ["Point", "포인트"],
    "enumdesc-type-Point": ["Point", "포인트"],
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<Coordinate>),
  accessLog: scalarDictionaryOf(AccessLog, {
    modelName: ["Access Log", "액세스 로그"],
    modelDesc: ["Access Log", "액세스 로그"],
    // * ==================== Model ==================== * //
    period: ["Period", "기간"],
    "desc-period": ["Period", "기간"],

    countryCode: ["Country Code", "국가 코드"],
    "desc-countryCode": ["Country Code", "국가 코드"],

    countryName: ["Country Name", "국가 이름"],
    "desc-countryName": ["Country Name", "국가 이름"],

    city: ["City", "도시"],
    "desc-city": ["City", "도시"],

    postal: ["Postal", "우편번호"],
    "desc-postal": ["Postal", "우편번호"],

    location: ["Location", "위치"],
    "desc-location": ["Location", "위치"],

    ipv4: ["IPv4", "아이피"],
    "desc-ipv4": ["IPv4", "아이피"],

    state: ["State", "주"],
    "desc-state": ["State", "주"],

    osName: ["OS Name", "OS 이름"],
    "desc-osName": ["OS Name", "OS 이름"],

    osVersion: ["OS Version", "OS 버전"],
    "desc-osVersion": ["OS Version", "OS 버전"],

    browserName: ["Browser Name", "브라우저 이름"],
    "desc-browserName": ["Browser Name", "브라우저 이름"],

    browserVersion: ["Browser Version", "브라우저 버전"],
    "desc-browserVersion": ["Browser Version", "브라우저 버전"],

    mobileModel: ["Mobile Model", "모바일 모델"],
    "desc-mobileModel": ["Mobile Model", "모바일 모델"],

    mobileVendor: ["Mobile Vendor", "모바일 벤더"],
    "desc-mobileVendor": ["Mobile Vendor", "모바일 벤더"],

    deviceType: ["Device Type", "디바이스 타입"],
    "desc-deviceType": ["Device Type", "디바이스 타입"],

    at: ["At", "시간"],
    "desc-at": ["At", "시간"],
    // * ==================== Model ==================== * //
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<AccessLog>),
} as const;

const signalDictionary = {} as const;

export const utilDictionary = { util: dictionary, ...modelDictionary, ...signalDictionary } as const;
