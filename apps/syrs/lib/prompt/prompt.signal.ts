import { Arg, DbSignal, Int, Mutation, Query, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Prompt)
export class PromptSignal extends DbSignal(cnst.promptCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  // * /////////////////////////////////////
  // * Public Slice
  @Query.Public(() => [cnst.Prompt])
  async promptListInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.PromptStatus[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.PromptFilter> | null
  ) {
    const prompts = await this.promptService.listByStatuses(statuses, { skip, limit, sort });
    return resolve<cnst.Prompt[]>(prompts);
  }
  @Query.Public(() => cnst.PromptInsight)
  async promptInsightInPublic(
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.PromptStatus[] | null
  ) {
    const promptInsight = await this.promptService.insightByStatuses(statuses);
    return resolve<cnst.PromptInsight>(promptInsight);
  }

  @Query.Public(() => cnst.Prompt)
  async setPromptDefault() {
    const prompt = await this.promptService.getDefaultPrompt();
    return resolve<cnst.Prompt>(prompt);
  }
  // * Public Slice
  // * /////////////////////////////////////
}
