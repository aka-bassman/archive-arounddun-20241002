import { BaseFilter, BaseModel, Dayjs, Field, Full, ID, Int, JSON, Light, Model, dayjs } from "@core/base";
import { LightUser } from "../user/user.constant";
import { StoryStat } from "../_social/social.constant";
import { creatorTypes, storyPolicies } from "../story/story.constant";
import type { CreatorType, StoryPolicy } from "../story/story.constant";

export const commentStatuses = ["active", "approved", "denied", "removed"] as const;
export type CommentStatus = (typeof commentStatuses)[number];

@Model.Input("CommentInput")
export class CommentInput {
  @Field.Prop(() => String, { nullable: true, immutable: true })
  rootType: string;

  @Field.Prop(() => ID, { refPath: "rootType", immutable: true })
  root: string;

  @Field.Prop(() => String, { nullable: true, immutable: true })
  group: null | string;

  @Field.Prop(() => String, { nullable: true, immutable: true })
  parentType: null | string;

  @Field.Prop(() => ID, { nullable: true, refPath: "parentType", immutable: true })
  parent: null | string;

  @Field.Prop(() => String, { enum: creatorTypes, immutable: true })
  type: CreatorType;

  @Field.Prop(() => LightUser, { immutable: true })
  user: LightUser;

  @Field.Prop(() => String, { nullable: true })
  name: null | string;

  @Field.Prop(() => String, { nullable: true })
  phone: null | string;

  @Field.Prop(() => String, { nullable: true })
  email: null | string;

  @Field.Prop(() => String)
  content: string;

  @Field.Prop(() => JSON, { nullable: true })
  meta: null | Record<string, any>;

  @Field.Prop(() => [String], [{ enum: storyPolicies }])
  policy: StoryPolicy[];
}
@Model.Object("CommentObject")
export class CommentObject extends BaseModel(CommentInput) {
  @Field.Prop(() => Date, { default: () => dayjs() })
  parentCreatedAt: Dayjs;

  @Field.Prop(() => StoryStat)
  totalStat: StoryStat;

  @Field.Prop(() => String, { enum: commentStatuses, default: "active" })
  status: CommentStatus;
}

@Model.Light("LightComment")
export class LightComment extends Light(CommentObject, [
  "name",
  "user",
  "meta",
  "content",
  "rootType",
  "parent",
  "parentCreatedAt",
  "totalStat",
  "status",
] as const) {
  @Field.Resolve(() => Int)
  like: number;

  setLike() {
    if (this.like > 0) return false;
    this.totalStat.likes += this.like <= 0 ? 1 : 0;
    this.totalStat.unlikes -= this.like < 0 ? 1 : 0;
    this.like = 1;
    return true;
  }
  resetLike() {
    if (this.like === 0) return false;
    if (this.like > 0) this.totalStat.likes -= this.like;
    this.like = 0;
    return true;
  }
  unlike() {
    if (this.like < 0) return false;
    this.totalStat.likes -= this.like;
    this.totalStat.unlikes += this.like >= 0 ? 1 : 0;
    this.like = -1;
    return true;
  }
}

@Model.Full("Comment")
export class Comment extends Full(CommentObject, LightComment) {}

@Model.Insight("CommentInsight")
export class CommentInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("CommentSummary")
export class CommentSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalComment: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "active" } })
  activeComment: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "approved" } })
  approvedComment: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "denied" } })
  deniedComment: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "hour").toDate() } }),
  })
  haComment: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "day").toDate() } }),
  })
  daComment: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "week").toDate() } }),
  })
  waComment: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "month").toDate() } }),
  })
  maComment: number;
}

@Model.Filter("CommentFilter")
export class CommentFilter extends BaseFilter(Comment, {
  parentLatest: { parentCreatedAt: 1, createdAt: 1 },
}) {}
