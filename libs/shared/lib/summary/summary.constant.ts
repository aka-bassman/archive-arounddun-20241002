import { AdminSummary } from "../admin/admin.constant";
import { BannerSummary } from "../banner/banner.constant";
import { FileSummary } from "../file/file.constant";
import { KeyringSummary } from "../keyring/keyring.constant";
import { NotificationSummary } from "../notification/notification.constant";
import { UserSummary } from "../user/user.constant";

import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, Int, Light, MixModels, Model, dayjs } from "@core/base";

export const summaryStatuses = ["active", "archived"] as const;
export type SummaryStatus = (typeof summaryStatuses)[number];

export const periodTypes = ["non-periodic", "active", "hourly", "daily", "weekly", "monthly"] as const;
export type PeriodType = (typeof periodTypes)[number];

@Model.Summary("SharedSummary")
export class SharedSummary extends MixModels(
  BannerSummary,
  AdminSummary,
  FileSummary,
  KeyringSummary,
  UserSummary,
  NotificationSummary
) {}

@Model.Input("SummaryInput")
export class SummaryInput {
  @Field.Prop(() => String, { enum: periodTypes, default: "non-periodic" })
  type: PeriodType;
}

@Model.Object("SummaryObject")
export class SummaryObject extends MixModels(BaseModel(SummaryInput), SharedSummary) {
  @Field.Prop(() => Date, { default: () => dayjs() })
  at: Dayjs;

  @Field.Prop(() => String, { enum: summaryStatuses, default: "archived" })
  status: SummaryStatus;
}

@Model.Light("LightSummary")
export class LightSummary extends Light(SummaryObject, ["at"] as const) {}

@Model.Full("Summary")
export class Summary extends Full(SummaryObject, LightSummary) {}

@Model.Insight("SummaryInsight")
export class SummaryInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Filter("SummaryFilter")
export class SummaryFilter extends BaseFilter(Summary, {
  oldestAt: { at: 1 },
}) {
  @Filter.Mongo()
  toPeriod(
    @Filter.Arg("from", () => Date) from: Date,
    @Filter.Arg("to", () => Date) to: Date,
    @Filter.Arg("periodTypes", () => [String]) periodTypes: PeriodType[]
  ) {
    return {
      at: { $gte: from, $lte: to },
      type: { $in: periodTypes },
    };
  }
}
