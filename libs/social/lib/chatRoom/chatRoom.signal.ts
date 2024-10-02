import {
  Account,
  Arg,
  DbSignal,
  ID,
  Int,
  Message,
  Mutation,
  Pubsub,
  Query,
  Self,
  Signal,
  SortOf,
  Ws,
  resolve,
  subscribe,
} from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.ChatRoom)
export class ChatRoomSignal extends DbSignal(cnst.chatRoomCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Public },
}) {
  @Query.Every(() => cnst.ChatRoom)
  async chatRoom(@Arg.Param("chatRoomId", () => ID) chatRoomId: string, @Account() account: Account) {
    const chatRoom = account.self
      ? await this.chatRoomService.readChat(chatRoomId, account.self.id)
      : await this.chatRoomService.getChatRoom(chatRoomId);
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  // * /////////////////////////////////////
  // * Self Slice
  @Query.User(() => [cnst.ChatRoom])
  async chatRoomListInSelf(
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.ChatRoomFilter> | null,
    @Self() self: Self
  ) {
    const chatRooms = await this.chatRoomService.listInUser(self.id, { skip, limit, sort });
    return resolve<cnst.ChatRoom[]>(chatRooms);
  }
  @Query.User(() => cnst.ChatRoomInsight)
  async chatRoomInsightInSelf(@Self() self: Self) {
    const chatRoomInsight = await this.chatRoomService.insightInUser(self.id);
    return resolve<cnst.ChatRoomInsight>(chatRoomInsight);
  }
  // * Self Slice
  // * /////////////////////////////////////

  // * /////////////////////////////////////
  // * Init Slice
  @Query.User(() => [cnst.ChatRoom])
  async chatRoomListInInit(
    @Arg.Param("initChatRoom", () => ID) initChatRoom: string,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.ChatRoomFilter> | null,
    @Self() self: Self
  ) {
    const chatRooms = await this.chatRoomService.listInInit(initChatRoom, { skip, limit, sort });
    return resolve<cnst.ChatRoom[]>(chatRooms);
  }
  @Query.User(() => cnst.ChatRoomInsight)
  async chatRoomInsightInInit(@Arg.Param("initChatRoom", () => ID) initChatRoom: string, @Self() self: Self) {
    const chatRoomInsight = await this.chatRoomService.insightInInit(initChatRoom);
    return resolve<cnst.ChatRoomInsight>(chatRoomInsight);
  }
  // * Init Slice
  // * /////////////////////////////////////

  // * /////////////////////////////////////
  // * Target Slice
  @Query.User(() => [cnst.ChatRoom])
  async chatRoomListInRoot(
    @Arg.Param("root", () => ID) root: string,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.ChatRoomFilter> | null,
    @Self() self: Self
  ) {
    const chatRooms = await this.chatRoomService.listInRoot(root, { skip, limit, sort });
    return resolve<cnst.ChatRoom[]>(chatRooms);
  }
  @Query.User(() => cnst.ChatRoomInsight)
  async chatRoomInsightInRoot(@Arg.Param("root", () => ID) root: string, @Self() self: Self) {
    const chatRoomInsight = await this.chatRoomService.insightInRoot(root);
    return resolve<cnst.ChatRoomInsight>(chatRoomInsight);
  }
  // * Target Slice
  // * /////////////////////////////////////

  @Query.User(() => cnst.ChatRoom)
  async getChatRoomByRoot(@Arg.Param("root", () => ID) root: string) {
    const chatRoom = await this.chatRoomService.pickInRoot(root);
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  @Mutation.User(() => cnst.Chat)
  async addChat(
    @Arg.Param("root", () => ID) root: string,
    @Arg.Body("data", () => cnst.Chat) data: db.Chat,
    @Self() self: Self
  ) {
    const chat = await this.chatRoomService.addChat(root, self.id, data);
    return resolve<cnst.Chat>(chat);
  }

  @Mutation.User(() => cnst.ChatRoom)
  async closeChatRoom(@Arg.Param("root", () => ID) root: string, @Self() self: Self) {
    const chatRoom = await this.chatRoomService.close(root, self.id);
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  @Mutation.User(() => cnst.ChatRoom)
  async leaveChatRoom(@Arg.Param("root", () => ID) root: string, @Self() self: Self) {
    const chatRoom = await this.chatRoomService.leave(root, self.id);
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  @Mutation.User(() => cnst.ChatRoom)
  async openChatRoom(
    @Arg.Param("root", () => ID) root: string,
    @Arg.Param("targetId", () => ID) targetId: string,
    @Self() self: Self
  ) {
    const chatRoom = await this.chatRoomService.open({
      targetId,
      userId: self.id,
      root,
    });
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  @Mutation.User(() => cnst.ChatRoom)
  async unlockMessage(@Arg.Param("root", () => ID) root: string, @Self() self: Self) {
    const chatRoom = await this.chatRoomService.activateChatRoom(root, self.id);
    return resolve<cnst.ChatRoom>(chatRoom);
  }

  @Message.User(() => Boolean)
  async readChat(@Arg.Msg("root", () => ID) root: string, @Arg.Msg("userId", () => ID) userId: string) {
    const chat = await this.chatRoomService.readChat(root, userId);
    return resolve<boolean>(!!chat);
  }

  @Pubsub.Public(() => cnst.Chat)
  chatAdded(@Arg.Room("root", () => ID) root: string, @Ws() ws: Ws) {
    return subscribe<cnst.Chat>();
  }

  @Pubsub.Public(() => cnst.ChatRoom)
  replyChatRoom(@Arg.Room("userId", () => ID) userId: string, @Ws() ws: Ws) {
    //userId에게 최신 챗이 왔다고 알려야됨.
    return subscribe<cnst.ChatRoom>();
  }
}
