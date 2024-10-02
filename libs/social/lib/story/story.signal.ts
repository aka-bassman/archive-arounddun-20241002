import {
  Account,
  Arg,
  DbSignal,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Self,
  Signal,
  SortOf,
  resolve,
} from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";
@Signal(() => cnst.Story)
export class StorySignal extends DbSignal(cnst.storyCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Public },
}) {
  @Query.Public(() => cnst.Story)
  async story(@Arg.Param("storyId", () => ID) storyId: string, @Account() account: Account) {
    if (account.self) void this.storyService.view(storyId, account.self.id);
    const story = await this.storyService.getStory(storyId);
    return resolve<cnst.Story>(story);
  }
  @Mutation.Public(() => cnst.Story)
  async createStory(
    @Arg.Body("data", () => cnst.StoryInput) data: db.StoryInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    if (self?.status === "restricted") throw new Error("Restricted User");
    if (!(await this.storyService.checkGranted(data))) throw new Error("Not Granted");
    const story = await this.storyService.createStory(data);
    return resolve<cnst.Story>(story);
  }
  @Mutation.Public(() => cnst.Story)
  async updateStory(
    @Arg.Param("storyId", () => ID) storyId: string,
    @Arg.Body("data", () => cnst.StoryInput) data: db.StoryInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    if (!(await this.storyService.checkGranted(storyId))) throw new Error("Not Granted");
    const story = await this.storyService.updateStory(storyId, data);
    return resolve<cnst.Story>(story);
  }

  // * /////////////////////////////////////
  // * Root Slice
  @Query.Public(() => [cnst.Story])
  async storyListInRoot(
    @Arg.Query("root", () => String) root: string,
    @Arg.Query("title", () => String, { nullable: true }) title: string | null,
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.StoryStatus[] | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.StoryFilter> | null
  ) {
    const stories = await this.storyService.listInRoot(root, title, statuses, { skip, limit, sort });
    return resolve<cnst.Story[]>(stories);
  }
  @Query.Public(() => cnst.StoryInsight)
  async storyInsightInRoot(
    @Arg.Query("root", () => String) root: string,
    @Arg.Query("title", () => String, { nullable: true }) title: string | null,
    @Arg.Query("statuses", () => [String], { nullable: true }) statuses: cnst.StoryStatus[] | null
  ) {
    const storyInsight = await this.storyService.insightInRoot(root, title, statuses);
    return resolve<cnst.StoryInsight>(storyInsight);
  }
  // * Root Slice
  // * /////////////////////////////////////
  @Mutation.Admin(() => cnst.Story)
  async approveStory(@Arg.Param("storyId", () => ID) storyId: string) {
    const story = await this.storyService.approve(storyId);
    return resolve<cnst.Story>(story);
  }
  @Mutation.Admin(() => cnst.Story)
  async denyStory(@Arg.Param("storyId", () => ID) storyId: string) {
    const story = await this.storyService.deny(storyId);
    return resolve<cnst.Story>(story);
  }
  @Mutation.Public(() => Boolean)
  async likeStory(@Arg.Param("storyId", () => ID) storyId: string, @Self({ nullable: true }) self: Self | null) {
    if (!self) return resolve<boolean>(false);
    return await this.storyService.like(storyId, self.id);
  }
  @Mutation.Public(() => Boolean)
  async resetLikeStory(@Arg.Param("storyId", () => ID) storyId: string, @Self({ nullable: true }) self: Self | null) {
    if (!self) return resolve<boolean>(false);
    return await this.storyService.resetLike(storyId, self.id);
  }
  @Mutation.Public(() => Boolean)
  async unlikeStory(@Arg.Param("storyId", () => ID) storyId: string, @Self({ nullable: true }) self: Self | null) {
    if (!self) return resolve<boolean>(false);
    return await this.storyService.unlike(storyId, self.id);
  }
  @ResolveField(() => Int)
  async view(@Parent() story: db.Story, @Self({ nullable: true }) self: Self | null) {
    return self
      ? ((await this.actionLogService.queryLoad({ action: "view", target: story.id, user: self.id }))?.value ?? 0)
      : 0;
  }
  @ResolveField(() => Int)
  async like(@Parent() story: db.Story, @Self({ nullable: true }) self: Self | null) {
    return self
      ? ((await this.actionLogService.queryLoad({ action: "like", target: story.id, user: self.id }))?.value ?? 0)
      : 0;
  }
}
