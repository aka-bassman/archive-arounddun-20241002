import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.GroupCallInput)
export class GroupCallInput extends Input(cnst.GroupCallInput) {}

@Database.Document(() => cnst.GroupCall)
export class GroupCall extends Document(cnst.GroupCall) {
  addUser(userId: string) {
    this.users = [...this.users, userId];
    return this;
  }
  subUser(userId: string) {
    this.users = this.users.filter((u) => u === userId);
    return this;
  }
}

@Database.Model(() => cnst.GroupCall)
export class GroupCallModel extends Model(GroupCall, cnst.groupCallCnst) {
  async getSummary(): Promise<cnst.GroupCallSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.GroupCall)
export class GroupCallMiddleware extends Middleware(GroupCallModel, GroupCall) {
  onSchema(schema: SchemaOf<GroupCallModel, GroupCall>) {
    // schema.index({ status: 1 })
  }
}
