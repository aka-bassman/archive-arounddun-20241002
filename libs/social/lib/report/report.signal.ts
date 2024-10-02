import { Arg, DbSignal, ID, Me, Mutation, Query, Self, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.Report)
export class ReportSignal extends DbSignal(cnst.reportCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  @Mutation.Every(() => cnst.Report)
  async createReport(
    @Arg.Body("data", () => cnst.ReportInput) data: db.ReportInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    // if (await this.Report.exists({ type: data.type, target: data.target, from: data.from }))
    //   throw new Error("Already Reported"); // TODO: 이미 신고한 경우 다른 상태로 넘겨야할듯
    // this.discordService.log(`Report Created`);
    const report = await this.reportService.createReport(data);
    return resolve<cnst.Report>(report);
  }
  @Mutation.Admin(() => cnst.Report)
  async processReport(@Arg.Param("reportId", () => ID) reportId: string, @Me() me: Me) {
    const report = await this.reportService.process(reportId, me.id);
    return resolve<cnst.Report>(report);
  }
  @Mutation.Admin(() => cnst.Report)
  async resolveReport(
    @Arg.Param("reportId", () => ID) reportId: string,
    @Arg.Body("replyContent", () => String) replyContent: string,
    @Me() me: Me
  ) {
    const report = await this.reportService.resolve(reportId, replyContent, me.id);
    return resolve<cnst.Report>(report);
  }
}
