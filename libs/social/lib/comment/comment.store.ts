import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Comment)
export class CommentStore extends stateOf(fetch.commentGql, {
  // state
}) {
  likeComment(id: string) {
    const { commentMap } = this.pick("commentMap");
    const comment = commentMap.get(id);
    if (!comment) return;
    if (comment.setLike()) void fetch.likeComment(comment.id);
    commentMap.set(comment.id, comment);
    this.set({ commentMap: new Map(commentMap) });
  }
  resetLikeComment(id: string) {
    const { commentMap } = this.pick("commentMap");
    const comment = commentMap.get(id);
    if (!comment) return;
    if (comment.resetLike()) void fetch.resetLikeComment(comment.id);
    commentMap.set(comment.id, comment);
    this.set({ commentMap: new Map(commentMap) });
  }
  unlikeComment(id: string) {
    const { commentMap } = this.pick("commentMap");
    const comment = commentMap.get(id);
    if (!comment) return;
    if (comment.unlike()) void fetch.unlikeComment(comment.id);
    commentMap.set(comment.id, comment);
    this.set({ commentMap: new Map(commentMap) });
  }
  async approveComment(id: string) {
    const comment = await fetch.approveComment(id);
    const { commentMap } = this.pick("commentMap");
    commentMap.set(comment.id, comment);
    this.set({ commentMap: new Map(commentMap) });
  }
  async denyComment(id: string) {
    const comment = await fetch.denyComment(id);
    const { commentMap } = this.pick("commentMap");
    commentMap.set(comment.id, comment);
    this.set({ commentMap: new Map(commentMap) });
  }
}
