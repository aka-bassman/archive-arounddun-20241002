import * as db from "../db";
import { DbService, Service, Srv, Websocket } from "@core/server";
import { Revert } from "../dict";
import { cnst } from "../cnst";
import type * as srv from "../srv";
import type { ChatRoomSignal } from "../sig";

@Service("ChatRoomService")
export class ChatRoomService extends DbService(db.chatRoomDb) {
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly fileService: srv.shared.FileService;
  @Websocket() protected readonly websocket: Websocket<ChatRoomSignal>;

  async addChat(root: string, userId: string, data: db.Chat): Promise<db.Chat> {
    const chatRoom = await this.pickByRoot(root, { sort: "latestRoomNum" });
    if (!chatRoom.has(userId)) throw new Revert("chatRoom.notMemberError");

    // TODO: Add Chat처리 추가해야함.
    if (!data.text && !data.emoji && !data.images.length) throw new Revert("chatRoom.noChatDataError");
    const chat = await this.chatRoomModel.addChat(chatRoom, data);
    if (chat.type === "image") {
      const images = await this.fileService.loadFileMany(data.images);
      //! 데이터로드 하는 법 나중에 수정
      this.websocket.chatAdded(root, { ...chat, images: images.length ? (images as unknown as string[]) : [] });
    } else this.websocket.chatAdded(root, chat);

    const targetUsers = chatRoom.users.filter((cur) => cur !== userId);

    const chatRoomInRoot = await this.pickInRoot(root);
    await chatRoomInRoot.addChatInRoot(chat).save();
    targetUsers.map((user) => {
      this.websocket.replyChatRoom(user, chatRoomInRoot);
    });

    return chat;
  }

  async readChat(chatRoomId: string, userId: string) {
    const chatRoom = await this.chatRoomModel.getChatRoom(chatRoomId);
    if (!chatRoom.has(userId)) throw new Revert("chatRoom.notMemberError");
    const readed = await this.chatRoomModel.readChat(chatRoom.initChatRoom, userId);
    return chatRoom;

    // const chatRoomInRoot = await this.pickInRoot(root);
    // await chatRoomInRoot.addChatInRoot(chat).save();
    // TODO: Read처리 추가해야함.
    // return chatRoom.addRead(userId);
  }

  async close(root: string, userId: string) {
    const chatRoom = await this.pickInRoot(root);
    return chatRoom.close(userId).save();
  }

  async leave(root: string, userId: string) {
    const chatRoom = await this.pickInRoot(root);
    return chatRoom.leave(userId).save();
  }

  async open({
    targetId,
    userId,
    root,
    rootType = "chatRoom",
  }: {
    targetId: string;
    userId: string;
    root: string;
    rootType?: string;
  }) {
    const chatRoom = await this.chatRoomModel.createChatRoom({
      rootType: rootType,
      root,
      users: [userId, targetId],
      liveUsers: [userId, targetId],
    });
    await this.chatRoomModel.createNextChatRoom(root);
    return chatRoom;
  }

  async activateChatRoom(root: string, userId: string) {
    const chatRoom = await this.pickByRoot(root, { sort: "latestRoomNum" });
    return await chatRoom.set({ status: "active" }).save();
  }

  async summarize(): Promise<cnst.ChatRoomSummary> {
    return {
      ...(await this.chatRoomModel.getSummary()),
    };
  }
}
