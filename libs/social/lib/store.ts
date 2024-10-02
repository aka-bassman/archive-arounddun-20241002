"use client";
import { ActionLogStore } from "./actionLog/actionLog.store";
import { BoardStore } from "./board/board.store";
import { ChatRoomStore } from "./chatRoom/chatRoom.store";
import { CommentStore } from "./comment/comment.store";
import { EmojiStore } from "./emoji/emoji.store";
import { GroupCallStore } from "./groupCall/groupCall.store";
import { MixStore, rootStoreOf } from "@core/client";
import { OrgStore } from "./org/org.store";
import { ReportStore } from "./report/report.store";
import { ServiceDeskStore } from "./serviceDesk/serviceDesk.store";
import { StoryStore } from "./story/story.store";
import { store as shared } from "@shared/client";

export class RootStore extends MixStore(
  shared,
  ActionLogStore,
  BoardStore,
  CommentStore,
  ReportStore,
  StoryStore,
  ChatRoomStore,
  ServiceDeskStore,
  EmojiStore,
  GroupCallStore,
  OrgStore
) {}
export const store = rootStoreOf(RootStore);
