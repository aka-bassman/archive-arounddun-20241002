import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type {
  Notification,
  NotificationFilter,
  NotificationInsight,
  NotificationSummary,
} from "./notification.constant";
import type { NotificationSignal } from "./notification.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Notification", "알림"],
  modelDesc: [
    "Notification is a group of informations that is sent or going to be sent to the user. It is used for the user to be notified of the event, and the events can be accumulated and summarized by groups.",
    "알림은 사용자에게 전송되거나 전송될 정보의 집합입니다. 사용자에게 이벤트를 알리는 데 사용되며, 이벤트는 그룹별로 축적되고 요약될 수 있습니다.",
  ],

  // * ==================== Model ==================== * //
  token: ["Token", "토큰"],
  "desc-token": ["Token of the notification", "알림의 토큰"],

  title: ["Title", "제목"],
  "desc-title": ["Title of the notification", "알림의 제목"],

  content: ["Content", "내용"],
  "desc-content": ["Content of the notification", "알림의 내용"],

  field: ["Field", "필드"],
  "desc-field": ["Field of the notification", "알림의 필드"],

  image: ["Image", "이미지"],
  "desc-image": ["Image of the notification", "알림의 이미지"],

  level: ["Level", "레벨"],
  "desc-level": ["Level of the notification", "알림의 레벨"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Notification count in current query settting", "현재 쿼리 설정에 맞는 알림 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //

  // "enum-notiLevel-actionRequired": ["Action Required", "필요한 조치"],
  // "enumdesc-notiLevel-actionRequired": ["Action required notification", "필요한 조치 알림"],
  // "enum-notiLevel-notice": ["Notice", "공지"],
  // "enumdesc-notiLevel-notice": ["Notice notification", "공지 알림"],
  // "enum-notiLevel-essential": ["Essential", "필수"],
  // "enumdesc-notiLevel-essential": ["Essential notification", "필수 알림"],
  // "enum-notiLevel-suggestion": ["Suggestion", "제안"],
  // "enumdesc-notiLevel-suggestion": ["Suggestion notification", "제안 알림"],
  // "enum-notiLevel-advertise": ["Advertise", "광고"],
  // "enumdesc-notiLevel-advertise": ["Advertise notification", "광고 알림"],

  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],

  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Notification, NotificationInsight, NotificationFilter>;

export const notificationSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalNotification: ["Total Notification", "총 알림 수"],
  "desc-totalNotification": ["Total notification count in the database", "데이터베이스에 저장된 총 알림 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<NotificationSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("notification" as const),
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<NotificationSignal, Notification>;

export const notificationDictionary = { ...modelDictionary, ...signalDictionary };
