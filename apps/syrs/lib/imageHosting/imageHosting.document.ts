import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.ImageHostingInput)
export class ImageHostingInput extends Input(cnst.ImageHostingInput) {}

@Database.Document(() => cnst.ImageHosting)
export class ImageHosting extends Document(cnst.ImageHosting) {}

@Database.Model(() => cnst.ImageHosting)
export class ImageHostingModel extends Model(ImageHosting, cnst.imageHostingCnst) {
  async getSummary(): Promise<cnst.ImageHostingSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.ImageHosting)
export class ImageHostingMiddleware extends Middleware(ImageHostingModel, ImageHosting) {
  onSchema(schema: SchemaOf<ImageHostingModel, ImageHosting>) {
    // schema.index({ status: 1 })
  }
}