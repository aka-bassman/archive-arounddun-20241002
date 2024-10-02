import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";

@Service("BannerService")
export class BannerService extends DbService(db.bannerDb) {
  async summarize(): Promise<cnst.BannerSummary> {
    return {
      ...(await this.bannerModel.getSummary()),
    };
  }
}
