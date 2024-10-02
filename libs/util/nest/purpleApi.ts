import { Logger } from "@core/common";
import { SolapiMessageService } from "solapi";
import { dayjs } from "@core/base";

export interface PurpleOptions {
  phone: string;
  apiKey: string;
  apiSecret: string;
}

export class PurpleApi {
  readonly #logger = new Logger("PurpleApi");
  readonly #options: PurpleOptions;
  readonly #message: SolapiMessageService;
  constructor(options: PurpleOptions) {
    this.#options = options;
    this.#message = new SolapiMessageService(options.apiKey, options.apiSecret);
  }
  async send(to: string, text: string, at = new Date()) {
    const res = await this.#message.sendOneFuture(
      { from: this.#options.phone, to: to.replace(/-/g, ""), text },
      dayjs(at).format("YYYY-MM-DD HH:mm:ss")
    );
    return true;
  }
  async sendPhoneCode(to: string, phoneCode: string, hash: string) {
    return await this.send(to, `[휴대폰 인증]: 인증번호 ${phoneCode} 를 입력하세요.\n${hash}`);
  }
}
