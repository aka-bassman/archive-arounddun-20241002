import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.NotificationInput)
export class NotificationInput extends Input(cnst.NotificationInput) {}

@Database.Document(() => cnst.Notification)
export class Notification extends Document(cnst.Notification) {}

@Database.Model(() => cnst.Notification)
export class NotificationModel extends Model(Notification, cnst.notificationCnst) {
  async getSummary(): Promise<cnst.NotificationSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Notification)
export class NotificationMiddleware extends Middleware(NotificationModel, Notification) {
  onSchema(schema: SchemaOf<NotificationModel, Notification>) {
    // schema.index({ status: 1 })
  }
}
