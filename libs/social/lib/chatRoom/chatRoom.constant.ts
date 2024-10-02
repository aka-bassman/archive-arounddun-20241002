import { BaseFilter, BaseModel, type Dayjs, Field, Filter, Full, ID, Int, Light, Model, dayjs } from "@core/base";
import { Chat } from "../_social/chat.constant";
import { ChatContribution } from "../_social/social.constant";
import { LightUser } from "../user/user.constant";

// export const MAX_CHAT_NUM_PER_CHATROOM = 200;
export const MAX_CHAT_NUM_PER_CHATROOM = 20;

export const chatRoomStatuses = ["active", "closed"] as const;
export type ChatRoomStatus = (typeof chatRoomStatuses)[number];

@Model.Input("ChatRoomInput")
export class ChatRoomInput {
  @Field.Prop(() => String, { default: "chatRoom" })
  rootType: string;

  @Field.Prop(() => ID)
  root: string;

  @Field.Prop(() => [LightUser])
  users: LightUser[];
}
@Model.Object("ChatRoomObject")
export class ChatRoomObject extends BaseModel(ChatRoomInput) {
  @Field.Prop(() => ID, { default: (doc: ChatRoom | null) => doc?.id })
  initChatRoom: string;

  @Field.Prop(() => [Chat])
  chats: Chat[];

  @Field.Prop(() => ChatContribution)
  contribution: ChatContribution;

  @Field.Prop(() => Int, { default: 0, min: 0 })
  roomNum: number;

  @Field.Prop(() => Map, { of: Date })
  reads: Map<string, Dayjs>;

  @Field.Prop(() => String, { enum: chatRoomStatuses, default: "active" })
  status: ChatRoomStatus;

  @Field.Prop(() => [ID])
  liveUsers: string[];
}
@Model.Light("LightChatRoom")
export class LightChatRoom extends Light(ChatRoomObject, [
  "root",
  "reads",
  "status",
  "users",
  "chats",
  "roomNum",
  "contribution",
  "liveUsers",
] as const) {
  getOpponentUser(userId: string) {
    return this.users.find((user) => user.id !== userId);
  }

  getDateFormat() {
    // updatedAt이 오늘이면 HH:mm 올해면 MM-DD 작년이면 YYYY.MM.DD
    const today = dayjs();
    return this.updatedAt.isSame(today, "day")
      ? this.updatedAt.format("HH:mm")
      : this.updatedAt.isSame(today, "year")
        ? this.updatedAt.format("MM-DD")
        : this.updatedAt.format("YYYY.MM.DD");
  }

  isFirstChat() {
    return this.roomNum === 1 && !this.chats.length;
  }

  isReaded(userId: string) {
    const read = this.reads.get(userId);
    if (!read) return false;
    const lastChat = this.chats.at(-1);
    if (!lastChat) return true;
    return read.isSame(lastChat.at, "second") || read.isAfter(lastChat.at);
  }
}

@Model.Full("ChatRoom")
export class ChatRoom extends Full(ChatRoomObject, LightChatRoom) {}

@Model.Insight("ChatRoomInsight")
export class ChatRoomInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ChatRoomSummary")
export class ChatRoomSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalChatRoom: number;
}

@Model.Filter("ChatRoomFilter")
export class ChatRoomFilter extends BaseFilter(ChatRoom, {
  recent: { updatedAt: -1 },
  latestRoomNum: { roomNum: -1 },
}) {
  @Filter.Mongo()
  inUser(
    @Filter.Arg("userId", () => ID, { ref: "user", renderOption: (user: LightUser) => user.nickname })
    userId: string
  ) {
    return { users: userId, roomNum: 0, liveUsers: userId };
  }
  @Filter.Mongo()
  inRoot(@Filter.Arg("root", () => ID) root: string) {
    return { root, roomNum: 0 };
  }
  @Filter.Mongo()
  inInit(
    @Filter.Arg("initChatRoom", () => ID, { ref: "chatRoom", renderOption: (chatRoom: LightChatRoom) => chatRoom.id })
    initChatRoom: string
  ) {
    return { initChatRoom, roomNum: { $ne: 0 } };
  }
  @Filter.Mongo()
  ByRoot(@Filter.Arg("root", () => ID) root: string) {
    return { root };
  }
}
