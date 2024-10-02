import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Report)
export class ReportStore extends stateOf(fetch.reportGql, {
  // state
}) {
  async processReport(id: string) {
    this.setReport(await fetch.processReport(id));
  }
  async resolveReport(id: string) {
    const { reportForm } = this.get();
    this.setReport(await fetch.resolveReport(id, reportForm.replyContent ?? ""));
  }
}
