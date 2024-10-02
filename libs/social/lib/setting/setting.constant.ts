import { AddModel, Full, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";

@Model.Input("SocialSettingInput")
export class SocialSettingInput {}

@Model.Input("SettingInput")
export class SettingInput extends AddModel(shared.SettingInput, SocialSettingInput) {}

@Model.Object("SettingObject")
export class SettingObject extends AddModel(shared.Setting, SettingInput) {}

@Model.Light("LightSetting")
export class LightSetting extends Light(SettingObject, ["status"] as const) {}

@Model.Full("Setting")
export class Setting extends Full(SettingObject, LightSetting, shared.Setting, shared.LightSetting) {}
