import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";

export const settingStatuses = ["active"] as const;
export type SettingStatus = (typeof settingStatuses)[number];

@Model.Input("SettingInput")
export class SettingInput {
  @Field.Prop(() => Int, { default: 0 })
  resignupDays: number;
}

@Model.Object("SettingObject")
export class SettingObject extends BaseModel(SettingInput) {
  @Field.Prop(() => String, { enum: settingStatuses, default: "active" })
  status: SettingStatus;
}

@Model.Light("LightSetting")
export class LightSetting extends Light(SettingObject, ["resignupDays", "status"] as const) {}

@Model.Full("Setting")
export class Setting extends Full(SettingObject, LightSetting) {}

@Model.Insight("SettingInsight")
export class SettingInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Filter("SettingFilter")
export class SettingFilter extends BaseFilter(Setting, {}) {}
