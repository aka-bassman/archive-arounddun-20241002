import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";

export const promptStatuses = ["active"] as const;
export type PromptStatus = (typeof promptStatuses)[number];

@Model.Input("PromptInput")
export class PromptInput {
  @Field.Prop(() => String)
  apiKey: string;

  @Field.Prop(() => Boolean, { default: false })
  isDefault: boolean;

  @Field.Prop(() => String)
  assistantName: string;

  @Field.Prop(() => String)
  assistantId: string;
}

@Model.Object("PromptObject")
export class PromptObject extends BaseModel(PromptInput) {
  @Field.Prop(() => String, { enum: promptStatuses, default: "active" })
  status: PromptStatus;
}

@Model.Light("LightPrompt")
export class LightPrompt extends Light(PromptObject, ["apiKey", "isDefault", "status"] as const) {}

@Model.Full("Prompt")
export class Prompt extends Full(PromptObject, LightPrompt) {}

@Model.Insight("PromptInsight")
export class PromptInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("PromptSummary")
export class PromptSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalPrompt: number;
}

@Model.Filter("PromptFilter")
export class PromptFilter extends BaseFilter(Prompt, {}) {}
