import { DbSignal, Mutation, Query, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
@Signal(() => cnst.Summary)
export class SummarySignal extends DbSignal(cnst.summaryCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.None },
}) {
  @Query.Public(() => cnst.Summary, { cache: 1000 })
  async getActiveSummary() {
    const summary = await this.summaryService.getActiveSummary();
    return resolve<cnst.Summary>(summary);
  }
}
