import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, ID, Int, Light, Model, dayjs } from "@core/base";
import { LightUser } from "../user/user.constant";
import { StoryStat } from "../_social/social.constant";
import { cnst as shared } from "@shared";

export const creatorTypes = ["user", "admin", "anonymous"] as const;
export type CreatorType = (typeof creatorTypes)[number];

export const storyPolicies = ["private", "thumbnailRequired", "noComment", "noSubComment"] as const;
export type StoryPolicy = (typeof storyPolicies)[number];

export const storyStatuses = ["active", "approved", "denied"] as const;
export type StoryStatus = (typeof storyStatuses)[number];

@Model.Input("StoryInput")
export class StoryInput {
  @Field.Prop(() => ID, { refPath: "rootType" })
  root: string;

  @Field.Prop(() => String, { default: "board" })
  rootType: string;

  @Field.Prop(() => ID, { nullable: true, refPath: "parentType", immutable: true })
  parent: null | string;

  @Field.Prop(() => String, { nullable: true, immutable: true })
  parentType: null | string;

  @Field.Prop(() => String, { nullable: true })
  category: null | string;

  @Field.Prop(() => String, { enum: creatorTypes })
  type: CreatorType;

  @Field.Prop(() => LightUser, { nullable: true })
  user: null | LightUser;

  @Field.Prop(() => String)
  title: string;

  @Field.Prop(() => String)
  content: string;

  @Field.Prop(() => [shared.File])
  thumbnails: shared.File[];

  @Field.Prop(() => shared.File, { nullable: true })
  logo: null | shared.File;

  @Field.Prop(() => [String], [{ enum: storyPolicies }])
  policy: StoryPolicy[];

  @Field.Prop(() => [shared.File])
  images: shared.File[];
}
@Model.Object("StoryObject")
export class StoryObject extends BaseModel(StoryInput) {
  @Field.Prop(() => Date, { default: () => dayjs() })
  parentCreatedAt: Dayjs;

  @Field.Prop(() => StoryStat)
  totalStat: StoryStat;

  @Field.Prop(() => String, { enum: storyStatuses, default: "active" })
  status: StoryStatus;
}

@Model.Light("LightStory")
export class LightStory extends Light(StoryObject, [
  "root",
  "rootType",
  "user",
  "thumbnails",
  "logo",
  "images",
  "category",
  "type",
  "title",
  "policy",
  "totalStat",
  "status",
] as const) {
  @Field.Resolve(() => Int)
  view: number;

  @Field.Resolve(() => Int)
  like: number;

  isNew() {
    return this.createdAt.isAfter(dayjs().subtract(1, "day"));
  }
  isViewable(self?: LightUser) {
    return (
      !this.policy.includes("private") ||
      !!self?.roles.includes("admin") ||
      this.user?.id === self?.id ||
      this.user?.roles.includes("admin")
    );
  }
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
  isMe(self?: { id: string } | null) {
    return (this.user && this.user.id === self?.id) ?? false;
  }
}

@Model.Full("Story")
export class Story extends Full(StoryObject, LightStory) {}

@Model.Insight("StoryInsight")
export class StoryInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("StorySummary")
export class StorySummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalStory: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "active" } })
  activeStory: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "approved" } })
  approvedStory: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "denied" } })
  deniedStory: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "hour").toDate() } }),
  })
  haStory: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "day").toDate() } }),
  })
  daStory: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "week").toDate() } }),
  })
  waStory: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "month").toDate() } }),
  })
  maStory: number;
}

@Model.Filter("StoryFilter")
export class StoryFilter extends BaseFilter(Story, {
  mostViews: { view: -1 },
  parentLatest: { parentCreatedAt: -1, createdAt: -1 },
}) {
  @Filter.Mongo()
  inRoot(
    @Filter.Arg("root", () => ID) root: string,
    @Filter.Arg("title", () => String, { nullable: true }) title: string | null,
    @Filter.Arg("statuses", () => [String], { nullable: true }) statuses: StoryStatus[] | null
  ) {
    return {
      root,
      ...(title ? { title: { $regex: title } } : {}),
      status: statuses ? { $in: statuses } : { $nin: ["denied"] },
    };
  }
}
