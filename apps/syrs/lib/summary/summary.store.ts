import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch, summaryGql } from "../fetch";

@Store(() => cnst.Summary)
export class SummaryStore extends stateOf(summaryGql, {
  // state
}) {
  async getActiveSummary() {
    this.set({ summary: (await fetch.getActiveSummary()) as cnst.Summary, summaryLoading: false });
  }
}
