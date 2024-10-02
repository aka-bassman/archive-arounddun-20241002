import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, ID, Int, JSON, Light, Model, dayjs } from "@core/base";
import { ChainWallet, LeaveInfo } from "../_shared/shared.constant";

export const MASTER_PHONES = [
  "000-9999-9999",
  "010-8888-8888",
  "010-4170-7644",
  "010-3919-7644",
  "010-7445-3714",
  "010-2784-9156",
];
export const MASTER_PHONECODE = "888888";

export const ssoTypes = ["naver", "kakao", "github", "google", "apple", "facebook"] as const;
export type SsoType = (typeof ssoTypes)[number];

export const verifies = [...ssoTypes, "wallet", "password", "phone", "email"] as const;
export type Verify = (typeof verifies)[number];

export const notiSettings = ["disagree", "fewer", "normal", "block"] as const;
export type NotiSetting = (typeof notiSettings)[number];

export const keyringStatuses = ["prepare", "active"] as const;
export type KeyringStatus = (typeof keyringStatuses)[number];

@Model.Input("KeyringInput")
export class KeyringInput {
  @Field.Prop(() => String, { nullable: true })
  name: string | null;

  @Field.Prop(() => String, { type: "email", nullable: true })
  resetEmail: string | null;

  @Field.Prop(() => [String])
  agreePolicies: string[];
}

@Model.Object("KeyringObject")
export class KeyringObject extends BaseModel(KeyringInput) {
  @Field.Prop(() => ID, { nullable: true })
  user: string;

  @Field.Prop(() => [ChainWallet])
  chainWallets: ChainWallet[];

  @Field.Prop(() => JSON, { default: {} })
  discord?: { nickname?: string; user?: { username: string } };

  @Field.Prop(() => String, { nullable: true })
  accountId: null | string;

  // Only Backend
  @Field.Secret(() => String, { nullable: true })
  password: string | null;

  @Field.Prop(() => String, { nullable: true })
  phone: string | null;

  // Only Backend
  @Field.Hidden(() => String, { nullable: true })
  phoneCode: string | null;

  @Field.Prop(() => [Date])
  phoneCodeAts: Dayjs[];

  @Field.Prop(() => [String], [{ enum: verifies }])
  verifies: Verify[];

  @Field.Prop(() => Boolean, { default: true })
  isOnline: boolean;

  @Field.Prop(() => Date, { default: () => dayjs() })
  lastLoginAt: Dayjs;

  @Field.Prop(() => Date, { nullable: true, default: () => dayjs().add(30, "minute") })
  verifiedAt: Dayjs | null;

  @Field.Prop(() => String, { enum: notiSettings, default: "normal" })
  notiSetting: NotiSetting;

  @Field.Prop(() => Date, { default: dayjs() })
  notiPauseUntil: Dayjs;

  @Field.Prop(() => [String])
  notiDeviceTokens: string[];

  @Field.Prop(() => LeaveInfo)
  leaveInfo: LeaveInfo;

  @Field.Prop(() => String, { enum: keyringStatuses, default: "prepare" })
  status: KeyringStatus;
}

@Model.Light("LightKeyring")
export class LightKeyring extends Light(KeyringObject, [
  "name",
  "accountId",
  "phone",
  "verifies",
  "isOnline",
  "lastLoginAt",
  "user",
  "status",
] as const) {}

@Model.Full("Keyring")
export class Keyring extends Full(KeyringObject, LightKeyring) {
  isPhoneVerified() {
    return (
      this.verifies.includes("phone") &&
      this.phoneCodeAts.at(-1) &&
      dayjs(this.phoneCodeAts.at(-1)).isAfter(dayjs().subtract(3, "minutes"))
    );
  }
}
@Model.Insight("KeyringInsight")
export class KeyringInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("KeyringSummary")
export class KeyringSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalKeyring: number;
}

@Model.Filter("KeyringFilter")
export class KeyringFilter extends BaseFilter(Keyring, {}) {
  @Filter.Mongo()
  byAccountId(
    @Filter.Arg("accountId", () => String) accountId: string,
    @Filter.Arg("status", () => String, { nullable: true }) status?: KeyringStatus | null
  ) {
    return { accountId, ...(status ? { status } : {}) };
  }
  @Filter.Mongo()
  byPhone(
    @Filter.Arg("phone", () => String) phone: string,
    @Filter.Arg("status", () => String, { nullable: true }) status?: KeyringStatus | null
  ) {
    return { phone, ...(status ? { status } : {}) };
  }
}
