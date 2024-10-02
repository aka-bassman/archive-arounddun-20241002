import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";
import { Chat } from "../_social/chat.constant";
import { LightEmoji } from "../emoji/emoji.constant";
import { LightUser } from "../user/user.constant";
import { cnst as shared } from "@shared";

export const serviceDeskStatuses = ["active", "resolved"] as const;
export type ServiceDeskStatus = (typeof serviceDeskStatuses)[number];

@Model.Input("ServiceDeskInput")
export class ServiceDeskInput {
  @Field.Prop(() => LightUser)
  user: LightUser;
}
@Model.Object("ServiceDeskObject")
export class ServiceDeskObject extends BaseModel(ServiceDeskInput) {
  @Field.Prop(() => [Chat])
  chats: Chat[];

  @Field.Prop(() => shared.LightAdmin)
  admin: null | shared.LightAdmin;

  @Field.Prop(() => [shared.File])
  files: shared.File[];

  @Field.Prop(() => [LightEmoji])
  emojis: LightEmoji[];

  // @Field.Prop(() => JSON, { type: Map, of: Date, default: {} })
  // read: Map<string, Date>;

  @Field.Prop(() => shared.ServiceReview, { nullable: true })
  review: null | shared.ServiceReview;

  @Field.Prop(() => String, { enum: serviceDeskStatuses, default: "active" })
  status: ServiceDeskStatus;
}

@Model.Light("LightServiceDesk")
export class LightServiceDesk extends Light(ServiceDeskObject, ["status"] as const) {}

@Model.Full("ServiceDesk")
export class ServiceDesk extends Full(ServiceDeskObject, LightServiceDesk) {}

@Model.Insight("ServiceDeskInsight")
export class ServiceDeskInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ServiceDeskSummary")
export class ServiceDeskSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalServiceDesk: number;
}

@Model.Filter("ServiceDeskFilter")
export class ServiceDeskFilter extends BaseFilter(ServiceDesk, {}) {}
