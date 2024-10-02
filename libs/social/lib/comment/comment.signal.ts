import { Arg, DbSignal, ID, Int, Mutation, Parent, Query, ResolveField, Self, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.Comment)
export class CommentSignal extends DbSignal(cnst.commentCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Public },
}) {
  @Mutation.Public(() => cnst.Comment)
  async createComment(
    @Arg.Body("data", () => cnst.CommentInput) data: db.CommentInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    if (self?.status === "restricted") throw new Error("User is restricted");
    const isGranted = await this.commentService.checkGranted(data);
    if (!isGranted) throw new Error("Role is not Granted");
    const comment = await this.commentService.createComment(data);
    return resolve<cnst.Comment>(comment);
  }
  @Mutation.Public(() => cnst.Comment)
  async updateComment(
    @Arg.Param("commentId", () => ID) commentId: string,
    @Arg.Body("data", () => cnst.CommentInput) data: db.CommentInput
  ) {
    const targetComment = await this.commentService.getComment(commentId);
    const isGranted = await this.commentService.checkGranted(targetComment);
    if (!isGranted) throw new Error("Role is not Granted");
    const comment = await this.commentService.updateComment(commentId, data);
    return resolve<cnst.Comment>(comment);
  }
  @Mutation.Public(() => cnst.Comment)
  async removeComment(@Arg.Param("commentId", () => ID) commentId: string) {
    const comment = await this.commentService.softRemoveComment(commentId);
    return resolve<cnst.Comment>(comment);
  }
  @Mutation.Admin(() => cnst.Comment)
  async approveComment(@Arg.Param("commentId", () => ID) commentId: string) {
    const comment = await this.commentService.approve(commentId);
    return resolve<cnst.Comment>(comment);
  }
  @Mutation.Admin(() => cnst.Comment)
  async denyComment(@Arg.Param("commentId", () => ID) commentId: string) {
    const comment = await this.commentService.deny(commentId);
    return resolve<cnst.Comment>(comment);
  }
  @Mutation.Public(() => Boolean)
  async likeComment(@Arg.Param("commentId", () => ID) commentId: string, @Self({ nullable: true }) self: Self | null) {
    if (!self) return resolve<boolean>(false);
    const success = await this.commentService.like(commentId, self.id);
    return resolve<boolean>(success);
  }
  @Mutation.Public(() => Boolean)
  async resetLikeComment(
    @Arg.Param("commentId", () => ID) commentId: string,
    @Self({ nullable: true }) self: Self | null
  ) {
    if (!self) return resolve<boolean>(false);
    const success = await this.commentService.resetLike(commentId, self.id);
    return resolve<boolean>(success);
  }
  @Mutation.Public(() => Boolean)
  async unlikeComment(
    @Arg.Param("commentId", () => ID) commentId: string,
    @Self({ nullable: true }) self: Self | null
  ) {
    if (!self) return resolve<boolean>(false);
    const success = await this.commentService.unlike(commentId, self.id);
    return resolve<boolean>(success);
  }
  @ResolveField(() => Int)
  async like(@Parent() comment: db.Comment, @Self({ nullable: true }) self: Self | null) {
    const num = self
      ? (await this.actionLogService.queryLoad({ action: "like", target: comment.id, user: self.id }))?.value ?? 0
      : 0;
    return num;
  }
}
