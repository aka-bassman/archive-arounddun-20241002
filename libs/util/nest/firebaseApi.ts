import { Logger } from "@core/common";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import admin from "firebase-admin";

const testTokens = [
  "dR9sV1JsQ1iFDQu0bmOzSK:APA91bFh_3xJ1cGOBYH7AVTtJXElzgk8Wd_cz7yWWb5uoKt7VE4ACFNiXmeNs0CS9EnJO3feAYLfJ_ccbfF5StsI1ABRZtqm4m141rgL8S_IKH3cjHy0wVudfSIr0xA4RBz9iZ52STaV", //고석현 아이폰 15 프로
  "fxjpXdkqIUsspjzOMgzBAT:APA91bGZrutubyBnnxCSthyhnYbKUD2UPavbu7U1xBkuChcUgpndChZjhPpiMJ8IH4Kk05Co8uAlxZxkC772f90AmEX9wnpOP0hyv3zj60yCZRj_nJ-yoo_bajJLHWsXr0w7HIMDSZ6F", //고석현 갤럭시 a31
];
const baseForm = {
  android: {
    notification: { sound: "default", defaultVibrateTimings: true, defaultSound: true, defaultLightSettings: true },
  },
  apns: { payload: { aps: { sound: "default", badge: 1 } } },
  data: { uriScheme: "luapp://main" },
};
const firebaseTemplate = testTokens.map((token) => ({
  ...baseForm,
  notification: { title: "테스트", body: "123345" },
  token,
}));

interface DataForm {
  title: string;
  body: string;
  token: string;
  imageUrl?: string;
  data?: { [key: string]: string };
}

export interface FirebaseOptions {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export class FirebaseApi {
  readonly #logger = new Logger("FirebaseApi");
  readonly #options: FirebaseOptions;
  constructor(options: FirebaseOptions) {
    this.#options = options;
    if (process.env.NODE_ENV === "test") return;
    admin.initializeApp({
      credential: admin.credential.cert(this.#options as admin.ServiceAccount),
    });
  }
  #generateForm({ title, body, token, data, imageUrl }: DataForm): Message {
    return {
      ...baseForm,
      notification: { title, body, imageUrl },
      android: { ...baseForm.android, notification: { ...baseForm.android.notification, imageUrl } },
      apns: { ...baseForm.apns, payload: { ...baseForm.apns.payload, aps: { mutableContent: true } } },
      fcmOptions: {},
      webpush: { notification: { imageUrl } },
      token,
      data,
    };
  }
  async send(dataForm: DataForm) {
    const message = this.#generateForm(dataForm);
    try {
      return await admin.messaging().send(message);
    } catch (e) {
      //
    }
  }
}
