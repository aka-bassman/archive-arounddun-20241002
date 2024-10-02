import { Dayjs, Field, ID, Int, Model } from "@core/base";

export interface CallConnection {
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  mic: number;
  cam: boolean;
}

@Model.Scalar("StoryStat")
export class StoryStat {
  @Field.Prop(() => Int, { default: 0, min: 0 })
  views: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  likes: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  unlikes: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  comments: number;
}

@Model.Scalar("ChatContribution")
export class ChatContribution {
  @Field.Prop(() => Int, { default: 0, min: 0 })
  count: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  size: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  totalCount: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  totalSize: number;
}

@Model.Scalar("ChatRead")
export class ChatRead {
  @Field.Prop(() => ID)
  user: string;

  @Field.Prop(() => Date)
  at: Dayjs;
}

@Model.Scalar("CallContribution")
export class CallContribution {
  @Field.Prop(() => Int, { default: 0, min: 0 })
  speakTime: number;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  callTime: number;
}

@Model.Scalar("InviteRequest")
export class InviteRequest {
  @Field.Prop(() => ID)
  orgId: string;

  @Field.Prop(() => String)
  as: "owner" | "operator" | "viewer";

  @Field.Prop(() => ID)
  inviterId: string;

  @Field.Prop(() => String)
  inviterNickname: string;

  @Field.Prop(() => ID)
  inviterKeyringId: string;

  @Field.Prop(() => ID, { nullable: true })
  inviteeId: string | null;

  @Field.Prop(() => String)
  inviteeEmail: string;

  @Field.Prop(() => ID, { nullable: true })
  inviteeKeyringId: string | null;

  @Field.Prop(() => Date, { nullable: true })
  until: Dayjs | null;
}
