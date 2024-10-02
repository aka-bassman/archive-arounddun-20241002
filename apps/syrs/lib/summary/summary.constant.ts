import { ImageHostingSummary } from "../imageHosting/imageHosting.constant";
import { PromptSummary } from "../prompt/prompt.constant";
import { ResultSummary } from "../result/result.constant";
import { SyrsUserSummary } from "../user/user.constant";
import { TestSummary } from "../test/test.constant";

import { AddModel, Full, Light, MixModels, Model } from "@core/base";
import { cnst as shared } from "@shared";
import { cnst as social } from "@social";

@Model.Summary("SyrsSummary")
export class SyrsSummary extends MixModels(
  ImageHostingSummary,
  PromptSummary,
  ResultSummary,
  TestSummary,SyrsUserSummary) {}

export class SummaryObject extends AddModel(shared.Summary, social.Summary, SyrsSummary) {}
export class SummaryInput extends shared.SummaryInput {}

@Model.Light("LightSummary")
export class LightSummary extends Light(SummaryObject, ["at"] as const) {}

@Model.Full("Summary")
export class Summary extends Full(SummaryObject, LightSummary, shared.Summary, shared.LightSummary) {}
