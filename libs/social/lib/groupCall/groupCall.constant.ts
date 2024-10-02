import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, Int, Light, Model, dayjs } from "@core/base";
import { CallContribution } from "../_social/social.constant";
import { User } from "../user/user.constant";
import { cnst as shared } from "@shared";

export const groupCallStatuses = ["active", "closed"] as const;
export type GroupCallStatus = (typeof groupCallStatuses)[number];

export const groupCallTypes = ["call", "video"] as const;
export type GroupCallType = (typeof groupCallTypes)[number];

@Model.Input("GroupCallInput")
export class GroupCallInput {
  @Field.Prop(() => String, { enum: groupCallTypes })
  type: GroupCallType;

  @Field.Prop(() => String, { default: (doc: GroupCall | null) => doc?.id })
  roomId: string;
}

@Model.Object("GroupCallObject")
export class GroupCallObject extends BaseModel(GroupCallInput) {
  @Field.Prop(() => Date, { default: () => dayjs() })
  startAt: Dayjs;

  @Field.Prop(() => Date, { nullable: true })
  endAt: null | Dayjs;

  @Field.Prop(() => [User])
  users: User[];

  // @Field.Prop(() => JSON, { nullable: true, type: Map, of: CallContributionSchema })
  // contribution: null | Map<string, CallContribution>;

  @Field.Prop(() => CallContribution, { nullable: true })
  totalContribution: null | CallContribution;

  // @Field(() => shared.JSON, { nullable: true, type: Map, of: shared.ServiceReviewSchema })
  // review: null | Map<string, shared.ServiceReview>;

  @Field.Prop(() => shared.ServiceReview, { nullable: true })
  totalReview: null | shared.ServiceReview;

  @Field.Prop(() => String, { nullable: true, enum: groupCallStatuses, default: "active" })
  status: GroupCallStatus;
}
@Model.Light("LightGroupCall")
export class LightGroupCall extends Light(GroupCallObject, ["roomId", "status"] as const) {}

@Model.Full("GroupCall")
export class GroupCall extends Full(GroupCallObject, LightGroupCall) {}

@Model.Insight("GroupCallInsight")
export class GroupCallInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("GroupCallSummary")
export class GroupCallSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalGroupCall: number;
}

@Model.Filter("GroupCallFilter")
export class GroupCallFilter extends BaseFilter(GroupCall, {}) {
  @Filter.Mongo()
  byRoom(@Filter.Arg("roomId", () => String) roomId: string) {
    return { roomId };
  }
}
