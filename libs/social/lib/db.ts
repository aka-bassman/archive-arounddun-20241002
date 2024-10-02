import * as actionLog from "./actionLog/actionLog.document";
import * as board from "./board/board.document";
import * as chatRoom from "./chatRoom/chatRoom.document";
import * as comment from "./comment/comment.document";
import * as emoji from "./emoji/emoji.document";
import * as groupCall from "./groupCall/groupCall.document";
import * as org from "./org/org.document";
import * as report from "./report/report.document";
import * as serviceDesk from "./serviceDesk/serviceDesk.document";
import * as setting from "./setting/setting.document";
import * as story from "./story/story.document";
import * as summary from "./summary/summary.document";
import * as user from "./user/user.document";
import { cnst } from "./cnst";
import { dbOf } from "@core/server";

export { db as shared } from "@shared/server";
export type * from "./org/org.document";
export type * from "./_social/social.document";
export type * from "./_social/chat.document";
export type * from "./user/user.document";
export type * from "./summary/summary.document";
export type * from "./board/board.document";
export type * from "./story/story.document";
export type * from "./comment/comment.document";
export type * from "./actionLog/actionLog.document";
export type * from "./report/report.document";
export type * from "./chatRoom/chatRoom.document";
export type * from "./serviceDesk/serviceDesk.document";
export type * from "./emoji/emoji.document";
export type * from "./groupCall/groupCall.document";
export type * from "./setting/setting.document";
export const actionLogDb = dbOf(
  "actionLog" as const,
  actionLog.ActionLogInput,
  actionLog.ActionLog,
  actionLog.ActionLogModel,
  actionLog.ActionLogMiddleware,
  cnst.ActionLog,
  cnst.ActionLogInsight,
  cnst.ActionLogFilter,
  cnst.ActionLogSummary
);
export const boardDb = dbOf(
  "board" as const,
  board.BoardInput,
  board.Board,
  board.BoardModel,
  board.BoardMiddleware,
  cnst.Board,
  cnst.BoardInsight,
  cnst.BoardFilter,
  cnst.BoardSummary
);
export const chatRoomDb = dbOf(
  "chatRoom" as const,
  chatRoom.ChatRoomInput,
  chatRoom.ChatRoom,
  chatRoom.ChatRoomModel,
  chatRoom.ChatRoomMiddleware,
  cnst.ChatRoom,
  cnst.ChatRoomInsight,
  cnst.ChatRoomFilter,
  cnst.ChatRoomSummary
);
export const commentDb = dbOf(
  "comment" as const,
  comment.CommentInput,
  comment.Comment,
  comment.CommentModel,
  comment.CommentMiddleware,
  cnst.Comment,
  cnst.CommentInsight,
  cnst.CommentFilter,
  cnst.CommentSummary
);
export const emojiDb = dbOf(
  "emoji" as const,
  emoji.EmojiInput,
  emoji.Emoji,
  emoji.EmojiModel,
  emoji.EmojiMiddleware,
  cnst.Emoji,
  cnst.EmojiInsight,
  cnst.EmojiFilter,
  cnst.EmojiSummary
);
export const groupCallDb = dbOf(
  "groupCall" as const,
  groupCall.GroupCallInput,
  groupCall.GroupCall,
  groupCall.GroupCallModel,
  groupCall.GroupCallMiddleware,
  cnst.GroupCall,
  cnst.GroupCallInsight,
  cnst.GroupCallFilter,
  cnst.GroupCallSummary
);
export const reportDb = dbOf(
  "report" as const,
  report.ReportInput,
  report.Report,
  report.ReportModel,
  report.ReportMiddleware,
  cnst.Report,
  cnst.ReportInsight,
  cnst.ReportFilter,
  cnst.ReportSummary
);
export const serviceDeskDb = dbOf(
  "serviceDesk" as const,
  serviceDesk.ServiceDeskInput,
  serviceDesk.ServiceDesk,
  serviceDesk.ServiceDeskModel,
  serviceDesk.ServiceDeskMiddleware,
  cnst.ServiceDesk,
  cnst.ServiceDeskInsight,
  cnst.ServiceDeskFilter,
  cnst.ServiceDeskSummary
);
export const settingDb = dbOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.SettingModel,
  setting.SettingMiddleware,
  cnst.shared.Setting,
  cnst.shared.SettingInsight,
  cnst.shared.SettingFilter
);
export const storyDb = dbOf(
  "story" as const,
  story.StoryInput,
  story.Story,
  story.StoryModel,
  story.StoryMiddleware,
  cnst.Story,
  cnst.StoryInsight,
  cnst.StoryFilter,
  cnst.StorySummary
);
export const summaryDb = dbOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.SummaryModel,
  summary.SummaryMiddleware,
  cnst.shared.Summary,
  cnst.shared.SummaryInsight,
  cnst.shared.SummaryFilter
);
export const userDb = dbOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.UserModel,
  user.UserMiddleware,
  cnst.User,
  cnst.UserInsight,
  cnst.UserFilter,
  cnst.UserSummary
);
export const orgDb = dbOf(
  "org" as const,
  org.OrgInput,
  org.Org,
  org.OrgModel,
  org.OrgMiddleware,
  cnst.Org,
  cnst.OrgInsight,
  cnst.OrgFilter,
  cnst.OrgSummary
);
