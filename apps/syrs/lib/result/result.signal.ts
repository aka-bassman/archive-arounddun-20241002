import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Result)
export class ResultSignal extends DbSignal(cnst.resultCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  // * /////////////////////////////////////
  // * Public Slice
  @Query.Public(() => [cnst.Result])
  async resultListInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.ResultStatus[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.ResultFilter> | null
  ) {
    const results = await this.resultService.listByStatuses(statuses, { skip, limit, sort });
    return resolve<cnst.Result[]>(results);
  }
  @Query.Public(() => cnst.ResultInsight)
  async resultInsightInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.ResultStatus[] | null
  ) {
    const resultInsight = await this.resultService.insightByStatuses(statuses);
    return resolve<cnst.ResultInsight>(resultInsight);
  }

  @Query.User(() => cnst.Result, { timeout: 0 })
  async calculateResult(
    @Arg.Param("testId", () => String) testId: string,
    @Arg.Param("userId", () => String) userId: string
  ) {
    const result = await this.resultService.calculateResult(testId, userId);
    return resolve<cnst.Result>(result);
  }

  @Query.User(() => cnst.Result, { timeout: 0 })
  async calculateImprvement(
    @Arg.Param("resultId", () => String) resultId: string,
    @Arg.Param("imageUrl", () => String) imageUrl: string
  ) {
    const result = await this.resultService.calculateImprvement(resultId, imageUrl);
    return resolve<cnst.Result>(result);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
