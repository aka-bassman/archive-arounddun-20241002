import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.ImageHosting)
export class ImageHostingSignal extends DbSignal(cnst.imageHostingCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  // * /////////////////////////////////////
  // * Public Slice
  @Query.Public(() => [cnst.ImageHosting])
  async imageHostingListInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.ImageHostingStatus[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.ImageHostingFilter> | null
  ) {
    const imageHostings = await this.imageHostingService.listByStatuses(statuses, { skip, limit, sort });
    return resolve<cnst.ImageHosting[]>(imageHostings);
  }
  @Query.Public(() => cnst.ImageHostingInsight)
  async imageHostingInsightInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.ImageHostingStatus[] | null
  ) {
    const imageHostingInsight = await this.imageHostingService.insightByStatuses(statuses);
    return resolve<cnst.ImageHostingInsight>(imageHostingInsight);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
