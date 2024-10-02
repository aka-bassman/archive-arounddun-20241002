import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { msg } from "../dict";

@Store(() => cnst.ChatRoom)
export class ChatRoomStore extends stateOf(fetch.chatRoomGql, {
  liveChatListMap: new Map() as Map<string, cnst.Chat[]>,
}) {
  async addTextChat(root: string, text: string) {
    const { self } = this.get() as unknown as { self: cnst.User };
    if (!self.id) return;
    const liveChat = fetch.crystalizeChat({ ...fetch.defaultChat, user: self.id, type: "text", text });
    const chatInput = fetch.purifyChat(liveChat);
    if (!chatInput) {
      msg.error("chatRoom.invalidChatInputError");
      return;
    }

    // 1. Add chat to live chat list
    this.addLiveChat(root, liveChat);

    // 2. Add chat to db
    const chat = (await fetch.addChat(root, chatInput)) as unknown as cnst.Chat;
    this.updateLiveChatSent(root, chat);
  }
  async addImageChat(root: string, images: cnst.shared.File[]) {
    const { self } = this.get() as unknown as { self: cnst.User };
    if (!self.id) return;
    const liveChat = fetch.crystalizeChat({ ...fetch.defaultChat, user: self.id, type: "image", images });
    const chatInput = fetch.purifyChat(liveChat);
    if (!chatInput) {
      msg.error("chatRoom.invalidChatInputError");
      return;
    }
    // 1. Add chat to live chat list

    // 2. Add chat to db
    const chat = (await fetch.addChat(root, chatInput)) as unknown as cnst.Chat;
    this.addLiveChat(root, chat);
    this.updateLiveChatSent(root, chat);
  }
  async addExitChat(root: string) {
    const liveChat = fetch.crystalizeChat({ ...fetch.defaultChat, type: "exit" });
    const chatInput = fetch.purifyChat(liveChat);
    if (!chatInput) {
      msg.error("chatRoom.invalidChatInputError");
      return;
    }

    // 1. Add chat to live chat list
    this.addLiveChat(root, liveChat);

    // 2. Add chat to db
    const chat = (await fetch.addChat(root, chatInput)) as unknown as cnst.Chat;
    this.updateLiveChatSent(root, chat);
  }

  readChat(root: string) {
    const { self } = this.get() as unknown as { self: cnst.User };
    const rst = fetch.readChat(root, self.id);
  }

  async addEnterChat(root: string) {
    const liveChat = fetch.crystalizeChat({ ...fetch.defaultChat, type: "enter" });
    const chatInput = fetch.purifyChat(liveChat);
    if (!chatInput) {
      msg.error("chatRoom.invalidChatInputError");
      return;
    }

    // 1. Add chat to live chat list
    this.addLiveChat(root, liveChat);

    // 2. Add chat to db
    const chat = (await fetch.addChat(root, chatInput)) as unknown as cnst.Chat;
    this.updateLiveChatSent(root, chat);
  }
  addLiveChat(root: string, chat: cnst.Chat) {
    const { liveChatListMap } = this.get();
    liveChatListMap.set(root, [...(liveChatListMap.get(root) ?? []), chat]);
    this.set({ liveChatListMap: new Map(liveChatListMap) });
  }
  updateLiveChatSent(root: string, chat: cnst.Chat) {
    const { liveChatListMap } = this.get();
    const chatList = liveChatListMap.get(root) ?? [];
    const newLiveChatMap = new Map<string, cnst.Chat[]>();
    newLiveChatMap.set(
      root,
      chatList.map((liveChat) => (liveChat.isSame(chat) ? chat : liveChat))
    );
    this.set({ liveChatListMap: newLiveChatMap });
  }
  chatAdded(root: string, chat: cnst.Chat) {
    const { chatRoomMapInInit, liveChatListMap } = this.get();
    const chatList = liveChatListMap.get(root) ?? [];
    liveChatListMap.set(
      root,
      chatList.filter((liveChat) => !liveChat.isSame(chat))
    );
    const chatRoom = [...chatRoomMapInInit.values()].at(-1);
    if (!chatRoom || chatRoom.root !== root) return;

    chatRoom.chats = [...chatRoom.chats, chat];
    this.set({ chatRoomMapInInit: new Map(chatRoomMapInInit), liveChatListMap: new Map(liveChatListMap) });
  }

  async closeChatRoom(root: string) {
    const { chatRoomMapInSelf } = this.get();
    const chatRoom = await fetch.closeChatRoom(root);
    const newChatRoomMap = new Map();
    [...chatRoomMapInSelf.values()]
      .filter((cur) => cur.id !== chatRoom.id)
      .forEach((cur) => newChatRoomMap.set(cur.id, cur));
    this.set({
      chatRoomMapInSelf: newChatRoomMap,
    });
    void this.addExitChat(root);
  }
  async leaveChatRoom(root: string) {
    const { chatRoomMapInSelf } = this.get();
    const chatRoom = await fetch.leaveChatRoom(root);
    const newChatRoomMap = new Map();
    [...chatRoomMapInSelf.values()]
      .filter((cur) => cur.id !== chatRoom.id)
      .forEach((cur) => newChatRoomMap.set(cur.id, cur));
    this.set({
      chatRoomMapInSelf: newChatRoomMap,
    });
  }

  async reportChatRoom(root: string, targetUserId: string, content: string) {
    const { self } = this.get() as unknown as { self: cnst.User };
    await fetch.createReport({
      type: "chatRoom",
      from: self.id,
      root: root,
      title: "채팅 신고",
      content,
      target: root,
      targetUser: targetUserId,
      files: [],
    });
    void this.closeChatRoom(root);
  }
}
