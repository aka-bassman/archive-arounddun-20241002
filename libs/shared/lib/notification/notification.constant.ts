import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";
import { File } from "../file/file.constant";

export const notiLevels = ["actionRequired", "notice", "essential", "suggestion", "advertise"] as const;
export type NotiLevel = (typeof notiLevels)[number];

export const notificationStatuses = ["active"] as const;
export type NotificationStatus = (typeof notificationStatuses)[number];

@Model.Input("NotificationInput")
export class NotificationInput {
  @Field.Prop(() => String)
  token: string;

  @Field.Prop(() => String)
  title: string;

  @Field.Prop(() => String)
  content: string;

  @Field.Prop(() => String, { nullable: true })
  field: string | null;

  @Field.Prop(() => File, { nullable: true })
  image: File | null;

  @Field.Prop(() => String, { enum: notiLevels, default: "notice" })
  level: NotiLevel;
}

@Model.Object("NotificationObject")
export class NotificationObject extends BaseModel(NotificationInput) {
  @Field.Prop(() => String, { enum: notificationStatuses, default: "active" })
  status: NotificationStatus;
}
@Model.Light("LightNotification")
export class LightNotification extends Light(NotificationObject, ["status"] as const) {}

@Model.Full("Notification")
export class Notification extends Full(NotificationObject, LightNotification) {}

@Model.Insight("NotificationInsight")
export class NotificationInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("NotificationSummary")
export class NotificationSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalNotification: number;
}

@Model.Filter("NotificationFilter")
export class NotificationFilter extends BaseFilter(Notification, {}) {}
