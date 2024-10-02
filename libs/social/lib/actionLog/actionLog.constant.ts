import { BaseFilter, BaseModel, Field, Full, ID, Int, Light, Model, dayjs } from "@core/base";

export const actionLogStatuses = ["active"] as const;
export type ActionLogStatus = (typeof actionLogStatuses)[number];

@Model.Input("ActionLogInput")
export class ActionLogInput {
  @Field.Prop(() => String) // user, story, comment, etc
  type: string;

  @Field.Prop(() => ID, { refPath: "type" })
  target: string;

  @Field.Prop(() => ID)
  user: string;

  @Field.Prop(() => String)
  action: string; // like, comment, follow, unfollow, block, unblock, report, unreport, etc
}

@Model.Object("ActionLogObject")
export class ActionLogObject extends BaseModel(ActionLogInput) {
  @Field.Prop(() => Int, { default: 0 })
  value: number;

  @Field.Prop(() => String, { enum: actionLogStatuses, default: "active" })
  status: ActionLogStatus;
}

@Model.Light("LightActionLog")
export class LightActionLog extends Light(ActionLogObject, ["status", "target", "type", "user"] as const) {}

// * 최종 생성 모델

@Model.Full("ActionLog")
export class ActionLog extends Full(ActionLogObject, LightActionLog) {}

@Model.Insight("ActionLogInsight")
export class ActionLogInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ActionLogSummary")
export class ActionLogSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalActionLog: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "hour").toDate() } }),
  })
  haActionLog: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "day").toDate() } }),
  })
  daActionLog: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "week").toDate() } }),
  })
  waActionLog: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ createdAt: { $gte: dayjs().subtract(1, "month").toDate() } }),
  })
  maActionLog: number;
}

@Model.Filter("ActionLogFilter")
export class ActionLogFilter extends BaseFilter(ActionLog, {}) {}
