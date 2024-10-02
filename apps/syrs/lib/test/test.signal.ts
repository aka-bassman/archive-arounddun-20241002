import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Test)
export class TestSignal extends DbSignal(cnst.testCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  // * /////////////////////////////////////
  // * Public Slice
  @Query.Public(() => [cnst.Test])
  async testListInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.TestStatus[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.TestFilter> | null
  ) {
    const tests = await this.testService.listByStatuses(statuses, { skip, limit, sort });
    return resolve<cnst.Test[]>(tests);
  }
  @Query.Public(() => cnst.TestInsight)
  async testInsightInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.TestStatus[] | null
  ) {
    const testInsight = await this.testService.insightByStatuses(statuses);
    return resolve<cnst.TestInsight>(testInsight);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
