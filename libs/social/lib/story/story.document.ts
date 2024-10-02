import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.StoryInput)
export class StoryInput extends Input(cnst.StoryInput) {}

@Database.Document(() => cnst.Story)
export class Story extends Document(cnst.Story) {
  approve() {
    this.status = "approved";
    void (this.constructor as StoryModel["Story"]).moveSummary(this.status, "approved");
    return this;
  }
  deny() {
    this.status = "denied";
    void (this.constructor as StoryModel["Story"]).moveSummary(this.status, "denied");
    return this;
  }
}

@Database.Model(() => cnst.Story)
export class StoryModel extends Model(Story, cnst.storyCnst) {
  async view(storyId: string) {
    const { modifiedCount } = await this.Story.updateOne({ _id: storyId }, { $inc: { "totalStat.views": 1 } });
    return !!modifiedCount;
  }
  async comment(storyId: string, value = 1) {
    const { modifiedCount } = await this.Story.updateOne({ _id: storyId }, { $inc: { "totalStat.comments": value } });
    return !!modifiedCount;
  }
  async like(storyId: string, prev = 0) {
    const { modifiedCount } = await this.Story.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev <= 0 ? 1 : 0, "totalStat.unlikes": prev < 0 ? -1 : 0 } }
    );
    return !!modifiedCount;
  }
  async resetLike(storyId: string, prev: number) {
    const { modifiedCount } = await this.Story.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev > 0 ? -1 : 0, "totalStat.unlikes": prev < 0 ? -1 : 0 } }
    );
    return !!modifiedCount;
  }
  async unlike(storyId: string, prev = 0) {
    const { modifiedCount } = await this.Story.updateOne(
      { _id: storyId },
      { $inc: { "totalStat.likes": prev > 0 ? -1 : 0, "totalStat.unlikes": prev >= 0 ? 1 : 0 } }
    );
    return !!modifiedCount;
  }
  async getSummary(): Promise<cnst.StorySummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Story)
export class StoryMiddleware extends Middleware(StoryModel, Story) {
  onSchema(schema: SchemaOf<StoryModel, Story>) {
    schema.pre<Story>("save", function (next) {
      const model = this.constructor as StoryModel["Story"];
      if (this.isNew) void model.addSummary(["ha", "da", "wa", "ma"]);
      next();
    });
    schema.index({ title: "text", content: "text" });
  }
}
