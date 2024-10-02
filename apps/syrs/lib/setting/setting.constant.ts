import { AddModel, Full, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";
import { cnst as social } from "@social";

@Model.Input("SyrsSettingInput")
export class SyrsSettingInput {}

@Model.Input("SettingInput")
export class SettingInput extends AddModel(shared.SettingInput, social.SettingInput, SyrsSettingInput) {}

@Model.Object("SettingObject")
export class SettingObject extends AddModel(shared.Setting, social.Setting, SettingInput) {}

@Model.Light("LightSetting")
export class LightSetting extends Light(SettingObject, ["status"] as const) {}

@Model.Full("Setting")
export class Setting extends Full(SettingObject, LightSetting, shared.Setting, shared.LightSetting) {}
