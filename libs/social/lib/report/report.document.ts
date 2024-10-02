import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { dayjs } from "@core/base";

@Database.Input(() => cnst.ReportInput)
export class ReportInput extends Input(cnst.ReportInput) {}

@Database.Document(() => cnst.Report)
export class Report extends Document(cnst.Report) {
  process(adminId: string) {
    if (this.status !== "active") throw new Error("Already Processed");
    void (this.constructor as ReportModel["Report"]).moveSummary(this.status, "inProgress");
    this.set({ status: "inProgress", replyFrom: adminId });
    return this;
  }
  resolve(adminId: string, replyContent: string) {
    // if (!["active", "inProgress"].includes(this.status)) throw new Error("Already Resolved");
    void (this.constructor as ReportModel["Report"]).moveSummary(this.status, "resolved");
    this.set({ status: "resolved", replyFrom: adminId, replyContent, replyAt: dayjs() });
    return this;
  }
}

@Database.Model(() => cnst.Report)
export class ReportModel extends Model(Report, cnst.reportCnst) {
  async getSummary(): Promise<cnst.ReportSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Report)
export class ReportMiddleware extends Middleware(ReportModel, Report) {
  onSchema(schema: SchemaOf<ReportModel, Report>) {
    schema.index({ title: "text", content: "text" });
  }
}
