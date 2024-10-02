import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";

export const emojiStatuses = ["active"] as const;
export type EmojiStatus = (typeof emojiStatuses)[number];

@Model.Input("EmojiInput")
export class EmojiInput {
  @Field.Prop(() => String, { default: "Default Emoji" })
  name: string;

  @Field.Prop(() => shared.File)
  file: shared.File;
}

@Model.Object("EmojiObject")
export class EmojiObject extends BaseModel(EmojiInput) {
  @Field.Prop(() => String, { enum: emojiStatuses, default: "active" })
  status: EmojiStatus;
}

@Model.Light("LightEmoji")
export class LightEmoji extends Light(EmojiObject, ["file", "status"] as const) {}

@Model.Full("Emoji")
export class Emoji extends Full(EmojiObject, LightEmoji) {}

@Model.Insight("EmojiInsight")
export class EmojiInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("EmojiSummary")
export class EmojiSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalEmoji: number;
}

@Model.Filter("EmojiFilter")
export class EmojiFilter extends BaseFilter(Emoji, {}) {}
