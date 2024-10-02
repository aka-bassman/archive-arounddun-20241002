import { Database, Document, Id, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { GetPlainObject, dayjs } from "@core/base";
import { cnst } from "../cnst";
import { pluralize } from "@core/common";
import type * as db from "../db";

@Database.Input(() => cnst.ChatRoomInput)
export class ChatRoomInput extends Input(cnst.ChatRoomInput) {}

@Database.Document(() => cnst.ChatRoom)
export class ChatRoom extends Document(cnst.ChatRoom) {
  has(userId: string) {
    return this.users.includes(userId);
  }
  addRead(userId: string) {
    // this.read.set(String(userId), new Date());
    return this;
  }
  addReads(userIds: string[]) {
    userIds.map((userId: string) => this.addRead(userId));
    return this;
  }
  close(userId: string) {
    this.status = "closed";
    this.liveUsers = this.liveUsers.filter((cur) => cur !== userId);
    return this;
  }
  leave(userId: string) {
    this.removedAt = dayjs();
    this.liveUsers = this.liveUsers.filter((cur) => cur !== userId);
    return this;
  }
  addChatInRoot(chat: db.Chat) {
    this.chats = [chat];
    return this;
  }
}

@Database.Model(() => cnst.ChatRoom)
export class ChatRoomModel extends Model(ChatRoom, cnst.chatRoomCnst) {
  async createNextChatRoom(root: string) {
    const chatRoom = await this.pickByRoot(root, { sort: "latestRoomNum" });
    return this.createChatRoom({
      initChatRoom: chatRoom.roomNum === 0 ? chatRoom.id : chatRoom.initChatRoom,
      roomNum: chatRoom.roomNum + 1,
      rootType: chatRoom.rootType,
      root: chatRoom.root,
      users: chatRoom.users,
      status: "active",
    });
  }
  async addChat(chatRoom: db.ChatRoom, data: db.Chat) {
    const chat = { ...data, at: dayjs() };
    const needNextRoom = chatRoom.roomNum === 0 || chatRoom.chats.length >= cnst.MAX_CHAT_NUM_PER_CHATROOM;
    const { upsertedId } = await this.ChatRoom.updateOne(
      { initChatRoom: chatRoom.initChatRoom, roomNum: needNextRoom ? chatRoom.roomNum + 1 : chatRoom.roomNum },
      {
        $push: { chats: chat },
        $inc: {
          "contribution.count": 1,
          "contribution.size": chat.text?.length ?? 0,
          "contribution.totalCount": 1,
          "contribution.totalSize": chat.text?.length ?? 0,
        },
        $set: { [`reads.${chat.user}`]: chat.at },
        $setOnInsert: {
          initChatRoom: chatRoom.initChatRoom,
          roomNum: chatRoom.roomNum + 1,
          root: chatRoom.root,
          users: chatRoom.users,
          status: "active",
        } satisfies GetPlainObject<db.ChatRoom, "id">,
      },
      { upsert: true }
    );
    void this.readChat(chatRoom.initChatRoom, chat.user);
    void this.updateRootChatAt(chatRoom);
    return chat;
  }
  async updateRootChatAt(chatRoom: db.ChatRoom) {
    //0번째 챗룸이면 root를 바로 업데이트 아니면 initChatRoom을 찾아서 업데이트
    const rootChatRoom = chatRoom.roomNum === 0 ? chatRoom : await this.ChatRoom.pickById(chatRoom.initChatRoom);
    const { modifiedCount } = await this.ChatRoom.db
      .collection(pluralize(rootChatRoom.rootType.toLowerCase()))
      .updateOne({ _id: new Id(rootChatRoom.root) }, { $set: { lastChatAt: new Date() } });
    return !!modifiedCount;
  }
  async readChat(initChatRoom: string, userId: string) {
    const { modifiedCount } = await this.ChatRoom.updateMany(
      { initChatRoom },
      { $set: { [`reads.${userId}`]: new Date() } }
    );
    return !!modifiedCount;
  }
  exitUser(root: string, userId: string) {
    return "wip";
  }
  enterUser(root: string, userId: string) {
    return "wip";
  }
  async getSummary(): Promise<cnst.ChatRoomSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.ChatRoom)
export class ChatRoomMiddleware extends Middleware(ChatRoomModel, ChatRoom) {
  onSchema(schema: SchemaOf<ChatRoomModel, ChatRoom>) {
    // schema.index({ status: 1 })
  }
}
