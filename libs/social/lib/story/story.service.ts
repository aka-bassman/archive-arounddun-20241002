import * as db from "../db";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("StoryService")
export class StoryService extends DbService(db.storyDb) {
  @Srv() protected readonly boardService: srv.BoardService;
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly actionLogService: srv.ActionLogService;

  async checkGranted(storyIdOrInput: string | db.StoryInput) {
    const story = typeof storyIdOrInput === "string" ? await this.getStory(storyIdOrInput) : storyIdOrInput;
    if (story.rootType !== "board") return true;
    const board = await this.boardService.getBoard(story.root);
    if (!story.user) throw new Error("story.user is required");
    const user = await this.userService.getUser(story.user);
    if (!board.isGranted(user)) return false;
    return true;
  }
  async approve(storyId: string) {
    const story = await this.storyModel.getStory(storyId);
    return await story.approve().save();
  }
  async deny(storyId: string) {
    const story = await this.storyModel.getStory(storyId);
    return await story.deny().save();
  }
  async view(target: string, user?: string) {
    await this.storyModel.view(target);
    if (user) await this.actionLogService.add({ type: "story", target, user, action: "view" });
  }
  async comment(target: string, user?: string) {
    await this.storyModel.comment(target);
    if (user) await this.actionLogService.add({ type: "story", target, user, action: "comment" });
  }
  async like(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "story", target, user, action: "like" }, 1);
    return await this.storyModel.like(target, prev);
  }
  async resetLike(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "story", target, user, action: "like" }, 0);
    return await this.storyModel.resetLike(target, prev);
  }
  async unlike(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "story", target, user, action: "like" }, -1);
    return await this.storyModel.unlike(target, prev);
  }
  async summarize(): Promise<cnst.StorySummary> {
    return {
      ...(await this.storyModel.getSummary()),
    };
  }
}
