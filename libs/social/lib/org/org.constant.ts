import { BaseFilter, BaseModel, Field, Filter, Full, ID, Int, Light, Model, Self } from "@core/base";
import { LightUser } from "../user/user.constant";

export const orgStatuses = ["active"] as const;
export type OrgStatus = (typeof orgStatuses)[number];

@Model.Input("OrgInput")
export class OrgInput {
  @Field.Prop(() => String)
  name: string;
}

@Model.Object("OrgObject")
export class OrgObject extends BaseModel(OrgInput) {
  @Field.Prop(() => [LightUser])
  owners: LightUser[];

  @Field.Prop(() => [LightUser])
  ownerInvites: LightUser[];

  @Field.Prop(() => [String])
  ownerInviteEmails: string[];

  @Field.Prop(() => [LightUser])
  operators: LightUser[];

  @Field.Prop(() => [LightUser])
  operatorInvites: LightUser[];

  @Field.Prop(() => [String])
  operatorInviteEmails: string[];

  @Field.Prop(() => [LightUser])
  viewers: LightUser[];

  @Field.Prop(() => [LightUser])
  viewerInvites: LightUser[];

  @Field.Prop(() => [String])
  viewerInviteEmails: string[];

  @Field.Prop(() => [ID])
  prevUsers: string[];

  @Field.Prop(() => String, { enum: orgStatuses, default: "active" })
  status: OrgStatus;
}

@Model.Light("LightOrg")
export class LightOrg extends Light(OrgObject, [
  "name",
  "status",
  // "owners", "operators", "viewers"
] as const) {}

@Model.Full("Org")
export class Org extends Full(OrgObject, LightOrg) {
  getRole(user: LightUser | Self) {
    return this.owners.some((owner) => owner.id === user.id)
      ? "owner"
      : this.operators.some((operator) => operator.id === user.id)
        ? "operator"
        : this.viewers.some((viewer) => viewer.id === user.id)
          ? "viewer"
          : null;
  }
}

@Model.Summary("OrgSummary")
export class OrgSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalOrg: number;
}

@Model.Insight("OrgInsight")
export class OrgInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Filter("OrgFilter")
export class OrgFilter extends BaseFilter(Org, { name: { name: 1 } }) {
  @Filter.Mongo()
  inSelf(
    @Filter.Arg("userId", () => ID, { ref: "user", renderOption: (user: LightUser) => user.nickname }) userId: string
  ) {
    return { $or: [{ owners: userId }, { operators: userId }, { viewers: userId }] };
  }
}
