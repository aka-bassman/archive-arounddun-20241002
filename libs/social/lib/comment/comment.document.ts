import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.CommentInput)
export class CommentInput extends Input(cnst.CommentInput) {}

@Database.Document(() => cnst.Comment)
export class Comment extends Document(cnst.Comment) {
  approve() {
    this.status = "approved";
    void (this.constructor as CommentModel["Comment"]).moveSummary(this.status, "approved");
    return this;
  }
  deny() {
    this.status = "denied";
    void (this.constructor as CommentModel["Comment"]).moveSummary(this.status, "denied");
    return this;
  }
  softRemove() {
    this.status = "removed";
    void (this.constructor as CommentModel["Comment"]).moveSummary(this.status, "removed");
    return this;
  }
}

@Database.Model(() => cnst.Comment)
export class CommentModel extends Model(Comment, cnst.commentCnst) {
  async like(storyId: string, prev = 0) {
    const { modifiedCount } = await this.Comment.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev <= 0 ? 1 : 0, "totalStat.unlikes": prev < 0 ? -1 : 0 } }
    );
    return !!modifiedCount;
  }
  async resetLike(storyId: string, prev: number) {
    const { modifiedCount } = await this.Comment.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev > 0 ? -1 : 0, "totalStat.unlikes": prev < 0 ? -1 : 0 } }
    );
    return !!modifiedCount;
  }
  async unlike(storyId: string, prev = 0) {
    const { modifiedCount } = await this.Comment.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev > 0 ? -1 : 0, "totalStat.unlikes": prev >= 0 ? 1 : 0 } }
    );
    return !!modifiedCount;
  }
  async getSummary(): Promise<cnst.CommentSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Comment)
export class CommentMiddleware extends Middleware(CommentModel, Comment) {
  onSchema(schema: SchemaOf<CommentModel, Comment>) {
    schema.pre<Comment>("save", function (next) {
      const model = this.constructor as unknown as CommentModel["Comment"];
      if (this.isNew) void model.addSummary(["ha", "da", "wa", "ma"]);
      next();
    });
    schema.index({ name: "text", phone: "text", email: "text", content: "text" });
  }
}
