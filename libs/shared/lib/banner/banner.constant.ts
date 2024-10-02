import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, Int, Light, Model, dayjs } from "@core/base";
import { File } from "../file/file.constant";

export const bannerStatuses = ["active", "displaying"] as const;
export type BannerStatus = (typeof bannerStatuses)[number];

export const bannerTargets = ["_blank", "_self"] as const;
export type BannerTarget = (typeof bannerTargets)[number];

@Model.Input("BannerInput")
export class BannerInput {
  @Field.Prop(() => String, { nullable: true })
  category: string | null;

  @Field.Prop(() => String, { nullable: true })
  title: string | null;

  @Field.Prop(() => String, { nullable: true })
  content: string | null;

  @Field.Prop(() => File, { nullable: true })
  image: File | null;

  @Field.Prop(() => String)
  href: string;

  @Field.Prop(() => String, { default: "_self", enum: bannerTargets })
  target: BannerTarget;

  @Field.Prop(() => Date, { default: dayjs() })
  from: Dayjs;

  @Field.Prop(() => Date, { nullable: true })
  to: Dayjs | null;
}

@Model.Object("BannerObject")
export class BannerObject extends BaseModel(BannerInput) {
  @Field.Prop(() => String, { enum: bannerStatuses, default: "active" })
  status: BannerStatus;
}

@Model.Light("LightBanner")
export class LightBanner extends Light(BannerObject, [
  "category",
  "title",
  "content",
  "image",
  "from",
  "to",
  "href",
  "target",
  "status",
] as const) {}

@Model.Full("Banner")
export class Banner extends Full(BannerObject, LightBanner) {}

@Model.Insight("BannerInsight")
export class BannerInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("BannerSummary")
export class BannerSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalBanner: number;
}

@Model.Filter("BannerFilter")
export class BannerFilter extends BaseFilter(Banner, {}) {
  @Filter.Mongo()
  inCategory(@Filter.Arg("category", () => String, { nullable: true }) category?: string | null) {
    return category ? { category } : {};
  }
}
