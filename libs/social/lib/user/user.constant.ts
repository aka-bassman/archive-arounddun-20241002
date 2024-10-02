import { AddModel, BaseFilter, ExtendModel, Full, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";

@Model.Input("SocialUserInput")
export class SocialUserInput {}

@Model.Object("SocialUser")
export class SocialUser extends ExtendModel(SocialUserInput) {}

@Model.Insight("SocialUserInsight")
export class SocialUserInsight {}

@Model.Summary("SocialUserSummary")
export class SocialUserSummary {}

export class UserInput extends AddModel(shared.UserInput, SocialUserInput) {}
export class UserObject extends AddModel(shared.User, SocialUser) {}

@Model.Light("LightUser")
export class LightUser extends Light(UserObject, ["nickname", "image", "roles", "lastLoginAt", "status"] as const) {}

@Model.Full("User")
export class User extends Full(UserObject, LightUser, shared.User, shared.LightUser) {}

export class UserSummary extends AddModel(shared.UserSummary, SocialUserSummary) {}
export class UserInsight extends AddModel(shared.UserInsight, SocialUserInsight) {}

@Model.Filter("UserFilter")
export class UserFilter extends BaseFilter(User, {}) {}
