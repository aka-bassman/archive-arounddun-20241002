import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";

export const imageHostingStatuses = ["active"] as const;
export type ImageHostingStatus = (typeof imageHostingStatuses)[number];

@Model.Input("ImageHostingInput")
export class ImageHostingInput {
  @Field.Prop(() => String)
  name: string;

  @Field.Prop(() => shared.File)
  image: shared.File;
}

@Model.Object("ImageHostingObject")
export class ImageHostingObject extends BaseModel(ImageHostingInput) {
  @Field.Prop(() => String, { enum: imageHostingStatuses, default: "active" })
  status: ImageHostingStatus;
}

@Model.Light("LightImageHosting")
export class LightImageHosting extends Light(ImageHostingObject, ["status"] as const) {}

@Model.Full("ImageHosting")
export class ImageHosting extends Full(ImageHostingObject, LightImageHosting) {}

@Model.Insight("ImageHostingInsight")
export class ImageHostingInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ImageHostingSummary")
export class ImageHostingSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalImageHosting: number;
}

@Model.Filter("ImageHostingFilter")
export class ImageHostingFilter extends BaseFilter(ImageHosting, {}) {}
