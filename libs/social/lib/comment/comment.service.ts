import * as db from "../db";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("CommentService")
export class CommentService extends DbService(db.commentDb) {
  @Srv() protected readonly storyService: srv.StoryService;
  @Srv() protected readonly boardService: srv.BoardService;
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly actionLogService: srv.ActionLogService;

  async softRemoveComment(commentId: string) {
    const comment = await this.commentModel.getComment(commentId);
    return await comment.softRemove().save();
  }
  async checkGranted(comment: db.Comment | db.CommentInput) {
    if (comment.rootType !== "story") return true;
    const story = await this.storyService.getStory(comment.root);
    if (story.rootType !== "board") return true;
    const board = await this.boardService.getBoard(story.root);
    const user = await this.userService.getUser(comment.user);
    return board.isGranted(user);
  }
  async approve(commentId: string) {
    const comment = await this.commentModel.getComment(commentId);
    return await comment.approve().save();
  }
  async deny(commentId: string) {
    const comment = await this.commentModel.getComment(commentId);
    return await comment.deny().save();
  }
  async like(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "comment", target, user, action: "like" }, 1);
    return await this.commentModel.like(target, prev);
  }
  async resetLike(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "comment", target, user, action: "like" }, 0);
    return await this.commentModel.resetLike(target, prev);
  }
  async unlike(target: string, user: string) {
    const prev = await this.actionLogService.set({ type: "comment", target, user, action: "like" }, -1);
    return await this.commentModel.unlike(target, prev);
  }
  async summarize(): Promise<cnst.CommentSummary> {
    return {
      ...(await this.commentModel.getSummary()),
    };
  }
}
