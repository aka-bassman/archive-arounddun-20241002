import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { Loader } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.ActionLogInput)
export class ActionLogInput extends Input(cnst.ActionLogInput) {}

@Database.Document(() => cnst.ActionLog)
export class ActionLog extends Document(cnst.ActionLog) {
  async addValue(value = 1) {
    const prev = this.value;
    this.value += value;
    await this.save();
    return prev;
  }
  async subValue(value = 1) {
    const prev = this.value;
    this.value -= value;
    await this.save();
    return prev;
  }
  async setValue(value: number) {
    const prev = this.value;
    await this.set({ value }).save();
    return prev;
  }
}

@Database.Model(() => cnst.ActionLog)
export class ActionLogModel extends Model(ActionLog, cnst.actionLogCnst) {
  @Loader.ByQuery(["action", "user", "target"]) actionLogQueryLoader: Loader<
    { action: string; user: string; target: string },
    ActionLog
  >;

  async browse(data: ActionLogInput) {
    return (
      (await this.ActionLog.findOne({ target: data.target, user: data.user, action: data.action })) ??
      new this.ActionLog(data)
    );
  }
  async getSummary(): Promise<cnst.ActionLogSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.ActionLog)
export class ActionLogMiddleware extends Middleware(ActionLogModel, ActionLog) {
  onSchema(schema: SchemaOf<ActionLogModel, ActionLog>) {
    schema.pre<ActionLog>("save", function (next) {
      const model = this.constructor as ActionLogModel["ActionLog"];
      if (this.isNew) void model.addSummary(["ha", "da", "wa", "ma"]);
      next();
    });
    schema.index({ target: 1, user: 1, action: 1 }, { unique: true });
  }
}
