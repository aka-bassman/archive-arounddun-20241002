import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Banner)
export class BannerSignal extends DbSignal(cnst.bannerCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Admin },
}) {
  // * /////////////////////////////////////
  // * Public Slice
  @Query.Public(() => [cnst.Banner])
  async bannerListInPublic(
    @Arg.Query("category", () => String, { nullable: true }) category: string | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.BannerFilter> | null
  ) {
    const banners = await this.bannerService.listInCategory(category, { skip, limit, sort });
    return resolve<cnst.Banner[]>(banners);
  }
  @Query.Public(() => cnst.BannerInsight)
  async bannerInsightInPublic(@Arg.Query("category", () => String, { nullable: true }) category: string | null) {
    const bannerInsight = await this.bannerService.insightInCategory(category);
    return resolve<cnst.BannerInsight>(bannerInsight);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
