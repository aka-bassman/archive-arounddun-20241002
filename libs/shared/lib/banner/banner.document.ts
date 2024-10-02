import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.BannerInput)
export class BannerInput extends Input(cnst.BannerInput) {}

@Database.Document(() => cnst.Banner)
export class Banner extends Document(cnst.Banner) {}

@Database.Model(() => cnst.Banner)
export class BannerModel extends Model(Banner, cnst.bannerCnst) {
  async getSummary(): Promise<cnst.BannerSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Banner)
export class BannerMiddleware extends Middleware(BannerModel, Banner) {
  onSchema(schema: SchemaOf<BannerModel, Banner>) {
    // schema.index({ status: 1 })
  }
}
