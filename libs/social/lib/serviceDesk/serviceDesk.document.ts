import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.ServiceDeskInput)
export class ServiceDeskInput extends Input(cnst.ServiceDeskInput) {}

@Database.Document(() => cnst.ServiceDesk)
export class ServiceDesk extends Document(cnst.ServiceDesk) {}

@Database.Model(() => cnst.ServiceDesk)
export class ServiceDeskModel extends Model(ServiceDesk, cnst.serviceDeskCnst) {
  async getSummary(): Promise<cnst.ServiceDeskSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.ServiceDesk)
export class ServiceDeskMiddleware extends Middleware(ServiceDeskModel, ServiceDesk) {
  onSchema(schema: SchemaOf<ServiceDeskModel, ServiceDesk>) {
    // schema.index({ status: 1 })
  }
}
