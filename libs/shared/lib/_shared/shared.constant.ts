import { Dayjs, Field, Int, Model } from "@core/base";
import { cnst as util } from "@util";

export const branches = ["debug", "develop", "main"] as const;
export type Branch = (typeof branches)[number];

export const linkTypes = [
  "website",
  "twitter",
  "discord",
  "telegram",
  "instagram",
  "facebook",
  "youtube",
  "github",
  "medium",
  "linkedin",
  "reddit",
  "twitch",
  "vimeo",
  "weibo",
  "wikipedia",
  "app",
  "email",
  "other",
] as const;
export type LinkType = (typeof linkTypes)[number];

@Model.Scalar("FileMeta")
export class FileMeta {
  @Field.Prop(() => Date)
  lastModifiedAt: Dayjs;

  @Field.Prop(() => Int)
  size: number;
}

@Model.Scalar("ExternalLink")
export class ExternalLink {
  @Field.Prop(() => String, { enum: linkTypes })
  type: LinkType;

  @Field.Prop(() => String)
  url: string;
}

@Model.Scalar("ServiceReview")
export class ServiceReview {
  @Field.Prop(() => Int, { min: 0, default: 0 })
  score: number;

  @Field.Prop(() => String, { nullable: true })
  comment: null | string;
}

export const leaveTypes = ["comeback", "unsatisfied", "other"] as const;
export type LeaveType = (typeof leaveTypes)[number];

@Model.Scalar("LeaveInfo")
export class LeaveInfo {
  @Field.Prop(() => String, { enum: leaveTypes, default: "other" })
  type: LeaveType;

  @Field.Prop(() => String, { nullable: true, default: "" })
  reason: string;

  @Field.Prop(() => Int, { min: 1, max: 5, default: 3 })
  satisfaction: number;

  @Field.Prop(() => String, { nullable: true, default: "" })
  voc: string;
}

@Model.Scalar("ChainWallet")
export class ChainWallet {
  @Field.Prop(() => String, { enum: util.chainNetworks })
  network: util.ChainNetwork;

  @Field.Prop(() => String)
  address: string;

  getShortenedAddress() {
    return this.address.slice(0, 6) + "..." + this.address.slice(-4);
  }
}
