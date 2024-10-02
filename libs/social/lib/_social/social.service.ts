import { LogService, Service } from "@core/server";

@Service("SocialService")
export class SocialService extends LogService("SocialService") {
  // @Cron("*/5 * * * *")
  // async checkHoldUsers() {
  //   await this.listingService.expireListingsAll();
  // }
}
