import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";

@Service("ReportService")
export class ReportService extends DbService(db.reportDb) {
  async process(reportId: string, adminId: string) {
    const report = await this.reportModel.getReport(reportId);
    return await report.process(adminId).save();
  }
  async resolve(reportId: string, replyContent: string, adminId: string) {
    const report = await this.reportModel.getReport(reportId);
    return await report.resolve(adminId, replyContent).save();
  }
  async summarize(): Promise<cnst.ReportSummary> {
    return {
      ...(await this.reportModel.getSummary()),
    };
  }
}
