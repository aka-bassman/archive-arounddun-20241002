import { AddModel, BaseFilter, ExtendModel, Full, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";
import { cnst as social } from "@social";

@Model.Input("SyrsUserInput")
export class SyrsUserInput {}

@Model.Object("SyrsUser")
export class SyrsUser extends ExtendModel(SyrsUserInput) {}

@Model.Insight("SyrsUserInsight")
export class SyrsUserInsight {}

@Model.Summary("SyrsUserSummary")
export class SyrsUserSummary {}

export class UserInput extends AddModel(shared.UserInput, social.UserInput, SyrsUserInput) {}
export class UserObject extends AddModel(shared.User, social.User, SyrsUser) {}

@Model.Light("LightUser")
export class LightUser extends Light(UserObject, ["nickname", "image", "roles", "status"] as const) {}

@Model.Full("User")
export class User extends Full(UserObject, LightUser, shared.User, shared.LightUser) {}

export class UserSummary extends AddModel(shared.UserSummary, social.UserSummary, SyrsUserSummary) {}
export class UserInsight extends AddModel(shared.UserInsight, social.UserInsight, SyrsUserInsight) {}
@Model.Filter("UserFilter")
export class UserFilter extends BaseFilter(User, {}) {}
