import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, Int, Light, Model, dayjs } from "@core/base";
import { validate } from "@core/common";

export const adminRoles = ["manager", "admin", "superAdmin"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const adminStatuses = ["active"] as const;
export type AdminStatus = (typeof adminStatuses)[number];

export const TEST_ENUM = new Set(["a", "b", "c"] as const);
type ValueOf<T> = T extends Set<infer E> ? E : never;
export type TEST_ENUM = ValueOf<typeof TEST_ENUM>;

export const TestType = new Set(["a", "b", "c"] as const);
export type TestType = (typeof TestType extends Set<infer E> ? E : never);



@Model.Input("AdminInput")
export class AdminInput {
  @Field.Prop(() => String, { validate: validate.email, type: "email", example: "hello@naver.com", text: "search" })
  accountId: string;

  @Field.Secret(() => String, { nullable: true, type: "password", example: "qwer1234" })
  password: string | null;
}

@Model.Object("AdminObject")
export class AdminObject extends BaseModel(AdminInput) {
  @Field.Prop(() => [String], [{ enum: adminRoles, example: ["admin", "superAdmin"] }])
  roles: AdminRole[];

  @Field.Prop(() => Date, { default: () => dayjs(), example: dayjs() })
  lastLoginAt: Dayjs;

  @Field.Prop(() => String, { enum: adminStatuses, default: "active" })
  status: AdminStatus;
}
@Model.Light("LightAdmin")
export class LightAdmin extends Light(AdminObject, ["accountId", "roles", "status"] as const) {
  hasAccess(role: AdminRole) {
    if (role === "superAdmin") return this.roles.includes("superAdmin");
    if (role === "admin") return this.roles.includes("superAdmin") || this.roles.includes("admin");
    else return false;
  }
}
@Model.Full("Admin")
export class Admin extends Full(AdminObject, LightAdmin) {}

@Model.Insight("AdminInsight")
export class AdminInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("AdminSummary")
export class AdminSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalAdmin: number;
}

@Model.Filter("AdminFilter")
export class AdminFilter extends BaseFilter(Admin, {}) {
  @Filter.Mongo()
  byAccountId(@Filter.Arg("accountId", () => String) accountId: string) {
    return { accountId };
  }
}
