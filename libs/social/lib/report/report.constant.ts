import { BaseFilter, BaseModel, Dayjs, Field, Full, ID, Int, Light, Model, dayjs } from "@core/base";
import { LightUser } from "../user/user.constant";
import { cnst as shared } from "@shared";

export const reportStatuses = ["active", "inProgress", "resolved"] as const;
export type ReportStatus = (typeof reportStatuses)[number];

@Model.Input("ReportInput")
export class ReportInput {
  @Field.Prop(() => ID, { nullable: true })
  root: null | string;

  @Field.Prop(() => String)
  type: string;

  @Field.Prop(() => ID, { nullable: true, refPath: "type" })
  target: null | string;

  @Field.Prop(() => LightUser)
  targetUser: LightUser;

  @Field.Prop(() => LightUser)
  from: LightUser;

  @Field.Prop(() => String, { maxlength: 200 })
  title: string;

  @Field.Prop(() => String, { maxlength: 10000 })
  content: string;

  @Field.Prop(() => [shared.File])
  files: shared.File[];
}
@Model.Object("ReportObject")
export class ReportObject extends BaseModel(ReportInput) {
  @Field.Prop(() => shared.LightAdmin, { nullable: true })
  replyFrom: null | shared.LightAdmin;

  @Field.Prop(() => String, { nullable: true, maxlength: 10000 })
  replyContent: null | string;

  @Field.Prop(() => Date, { default: () => dayjs() })
  replyAt: Dayjs;

  @Field.Prop(() => String, { enum: reportStatuses, default: "active" })
  status: ReportStatus;
}

@Model.Light("LightReport")
export class LightReport extends Light(ReportObject, [
  "type",
  "targetUser",
  "from",
  "replyFrom",
  "target",
  "title",
  "status",
  "content",
] as const) {
  isMe(self?: { id: string } | null) {
    return this.from.id === self?.id;
  }
}

@Model.Full("Report")
export class Report extends Full(ReportObject, LightReport) {}

@Model.Insight("ReportInsight")
export class ReportInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ReportSummary")
export class ReportSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalReport: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "active" } })
  activeReport: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "inProgress" } })
  inProgressReport: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "resolved" } })
  resolvedReport: number;
}

@Model.Filter("ReportFilter")
export class ReportFilter extends BaseFilter(Report, {}) {}
