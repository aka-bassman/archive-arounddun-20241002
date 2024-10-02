import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Board)
export class BoardSignal extends DbSignal(cnst.boardCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Admin },
}) {
  // * /////////////////////////////////////
  // * Public Slice

  @Query.Public(() => [cnst.Board])
  async boardListInPublic(
    @Arg.Param("statuses", () => [String], { nullable: true }) statuses: string[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.BoardFilter> | null
  ) {
    const boards = await this.boardService.listByStatuses(statuses, { skip, limit, sort });
    return resolve<cnst.Board[]>(boards);
  }

  @Query.Public(() => cnst.BoardInsight)
  async boardInsightInPublic(@Arg.Param("statuses", () => [String], { nullable: true }) statuses: string[] | null) {
    const boardInsight = await this.boardService.insightByStatuses(statuses);
    return resolve<cnst.BoardInsight>(boardInsight);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
