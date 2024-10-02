import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, ID, Int, Light, Model, dayjs } from "@core/base";
import { File } from "../file/file.constant";
import { LeaveInfo } from "../_shared/shared.constant";
import type { LightKeyring } from "../keyring/keyring.constant";

export const userRoles = ["root", "admin", "user", "business", "guest"] as const;
export type UserRole = (typeof userRoles)[number];

// export const UserRole = new Set(["a", "b", "c"] as const);
// export type UserRole = (typeof UserRole extends Set<infer E> ? E : never);

export const profileStatuses = [
  "active",
  "prepare",
  "applied",
  "approved",
  "reapplied",
  "featured",
  "reserved",
  "rejected",
] as const;
export type ProfileStatus = (typeof profileStatuses)[number];

export const journeyStatuses = [
  "welcome",
  "waiting",
  "firstJoin",
  "joined",
  "leaving",
  "leaved",
  "returning",
  "returned",
] as const;
export type JourneyStatus = (typeof journeyStatuses)[number];

export const inquiryStatuses = [
  "welcome",
  "payable",
  "waitPay",
  "paid",
  "morePayable",
  "waitMorePay",
  "inquired",
  "concerned",
  "concernedPayable",
  "concernedWaitPay",
  "ashed",
  "vip",
  "kicked",
];
export type InquiryStatus = (typeof inquiryStatuses)[number];

export const userStatuses = ["active", "dormant", "restricted"] as const;
export type UserStatus = (typeof userStatuses)[number];

@Model.Input("UserInput")
export class UserInput {
  @Field.Prop(() => String, { nullable: true, default: "" })
  nickname: string;

  @Field.Prop(() => File, { nullable: true })
  image: File | null;

  @Field.Prop(() => [File])
  images: File[];

  @Field.Prop(() => [File])
  appliedImages: File[];

  @Field.Prop(() => [String], [{ enum: userRoles }])
  requestRoles: UserRole[];
}

@Model.Object("UserObject")
export class UserObject extends BaseModel(UserInput) {
  @Field.Prop(() => Int, { default: 0 })
  imageNum: number;

  @Field.Prop(() => ID)
  keyring: string;

  @Field.Prop(() => [String], [{ enum: userRoles, default: "user" }])
  roles: UserRole[];

  @Field.Prop(() => [String])
  playing: string[];

  @Field.Prop(() => Date, { default: () => dayjs() })
  lastLoginAt: Dayjs;

  @Field.Prop(() => String, { enum: profileStatuses, default: "prepare" })
  profileStatus: ProfileStatus;

  @Field.Prop(() => Date, { nullable: true })
  restrictUntil: Dayjs | null;

  @Field.Prop(() => String, { nullable: true })
  restrictReason: string | null;

  @Field.Prop(() => String, { enum: journeyStatuses, default: "welcome" })
  journeyStatus: JourneyStatus;

  @Field.Prop(() => Date, { default: () => dayjs() })
  journeyStatusAt: Dayjs;

  @Field.Prop(() => String, { enum: inquiryStatuses, default: "welcome" })
  inquiryStatus: InquiryStatus;

  @Field.Prop(() => Date, { default: () => dayjs() })
  inquiryStatusAt: Dayjs;

  @Field.Prop(() => LeaveInfo, { nullable: true })
  leaveInfo: LeaveInfo | null;

  @Field.Prop(() => Date, { nullable: true })
  joinAt: Dayjs | null;

  @Field.Prop(() => Date, { nullable: true })
  leftAt: Dayjs | null;

  @Field.Prop(() => String, { enum: userStatuses, default: "active" })
  status: UserStatus;
}

@Model.Light("LightUser")
export class LightUser extends Light(UserObject, [
  "image",
  "nickname",
  "playing",
  "profileStatus",
  "lastLoginAt",
] as const) {}

@Model.Full("User")
export class User extends Full(UserObject, LightUser) {}

@Model.Insight("UserInsight")
export class UserInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("UserSummary")
export class UserSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: { nickname: { $ne: "" } } })
  totalUser: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { status: "restricted" } })
  restrictedUser: number;

  @Field.Prop(() => Int, { min: 0, default: 0, query: { roles: "business" } })
  businessUser: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ lastLoginAt: { $gte: dayjs().subtract(1, "hour").toDate() } }),
  })
  hau: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ lastLoginAt: { $gte: dayjs().subtract(1, "day").toDate() } }),
  })
  dau: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ lastLoginAt: { $gte: dayjs().subtract(1, "week").toDate() } }),
  })
  wau: number;

  @Field.Prop(() => Int, {
    min: 0,
    default: 0,
    query: () => ({ lastLoginAt: { $gte: dayjs().subtract(1, "month").toDate() } }),
  })
  mau: number;
}

@Model.Filter("UserFilter")
export class UserFilter extends BaseFilter(User, {}) {
  @Filter.Mongo()
  byKeyring(
    @Filter.Arg("keyringId", () => ID, {
      ref: "keyring",
      renderOption: (keyring: LightKeyring) => keyring.name ?? "unknown",
    })
    keyringId: string
  ) {
    return { keyring: keyringId };
  }
  @Filter.Mongo()
  byNickname(
    @Filter.Arg("nickname", () => String) nickname: string,
    @Filter.Arg("status", () => String, { nullable: true }) status: UserStatus | null
  ) {
    return { nickname, ...(status ? { status } : {}) };
  }
}
