import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as chatRoomSpec from "@social/lib/chatRoom/chatRoom.signal.spec";
import * as userSpec from "@social/lib/user/user.signal.spec";
import { cnst } from "../cnst";

describe("ChatRoom Signal", () => {
  describe("ChatRoom Service", () => {
    let adminAgent: userSpec.AdminAgent;
    let userAgent1: userSpec.UserAgent, userAgent2: userSpec.UserAgent;
    let initChatRoom: cnst.ChatRoom, chatRoomListInInit: cnst.LightChatRoom[];
    beforeAll(async () => {
      adminAgent = await adminSpec.getAdminAgentWithInitialize();
      userAgent1 = await userSpec.getUserAgentWithPhone(0);
      userAgent2 = await userSpec.getUserAgentWithPhone(1);
    });
    it("can create chatRoom", async () => {
      initChatRoom = await chatRoomSpec.createChatRoom(userAgent1, userAgent2);
      expect(initChatRoom.users[0].id).toBe(userAgent1.user.id);
      expect(initChatRoom.users[1].id).toBe(userAgent2.user.id);
      expect(initChatRoom.initChatRoom).toBe(initChatRoom.id);
      expect(initChatRoom.roomNum).toBe(0);
      expect(initChatRoom.status).toBe("active");
    });
    it("can list chatroom in self", async () => {
      const chatRoomListInSelf = await userAgent1.fetch.chatRoomListInSelf();
      expect(chatRoomListInSelf.length).toBe(1);
      expect(chatRoomListInSelf[0].id).toBe(initChatRoom.id);
    });
    it("no chatRoom in root with no chats", async () => {
      chatRoomListInInit = await userAgent1.fetch.chatRoomListInInit(initChatRoom.initChatRoom);
      expect(chatRoomListInInit.length).toBe(0);
    });
    it("can add chat", async () => {
      const chat = await chatRoomSpec.addTextChat(userAgent1, initChatRoom);
      chatRoomListInInit = await userAgent1.fetch.chatRoomListInInit(initChatRoom.initChatRoom);
      expect(chatRoomListInInit.length).toBe(1);
      expect(chatRoomListInInit[0].roomNum).toBe(1);
      expect(chatRoomListInInit[0].chats.length).toBe(1);
      expect(chatRoomListInInit[0].chats[0].user).toBe(chat.user);
      expect(chatRoomListInInit[0].chats[0].text).toBe(chat.text);
    });

    it("creates next chatRoom when exceeds max chatcount", async () => {
      const chatRoom = chatRoomListInInit[0];
      const chatCount = cnst.MAX_CHAT_NUM_PER_CHATROOM - chatRoom.chats.length;

      // 1. not exceed when max chat count
      for (let i = 0; i < chatCount; i++) await chatRoomSpec.addTextChat(userAgent1, chatRoom);
      chatRoomListInInit = await userAgent1.fetch.chatRoomListInInit(initChatRoom.initChatRoom);
      expect(chatRoomListInInit.length).toBe(1);

      // 2. exceeds when max chat count
      await chatRoomSpec.addTextChat(userAgent1, chatRoom);
      chatRoomListInInit = await userAgent1.fetch.chatRoomListInInit(initChatRoom.initChatRoom);
      expect(chatRoomListInInit.length).toBe(2);
    });
  });
});
