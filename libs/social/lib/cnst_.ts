import * as actionLog from "./actionLog/actionLog.constant";
import * as board from "./board/board.constant";
import * as chatRoom from "./chatRoom/chatRoom.constant";
import * as comment from "./comment/comment.constant";
import * as emoji from "./emoji/emoji.constant";
import * as groupCall from "./groupCall/groupCall.constant";
import * as org from "./org/org.constant";
import * as report from "./report/report.constant";
import * as serviceDesk from "./serviceDesk/serviceDesk.constant";
import * as setting from "./setting/setting.constant";
import * as story from "./story/story.constant";
import * as summary from "./summary/summary.constant";
import * as user from "./user/user.constant";
import { cnstOf } from "@core/base";
import { cnst as shared } from "@shared";

export { cnst as shared } from "@shared";
export { cnst as util } from "@util";
export * from "./org/org.constant";
export * from "./_social/social.constant";
export * from "./_social/chat.constant";
export * from "./user/user.constant";
export * from "./summary/summary.constant";
export * from "./board/board.constant";
export * from "./story/story.constant";
export * from "./comment/comment.constant";
export * from "./actionLog/actionLog.constant";
export * from "./report/report.constant";
export * from "./chatRoom/chatRoom.constant";
export * from "./serviceDesk/serviceDesk.constant";
export * from "./emoji/emoji.constant";
export * from "./groupCall/groupCall.constant";
export * from "./setting/setting.constant";

export const orgCnst = cnstOf(
  "org" as const,
  org.OrgInput,
  org.Org,
  org.LightOrg,
  org.OrgInsight,
  org.OrgFilter,
  org.OrgSummary
);
export const actionLogCnst = cnstOf(
  "actionLog" as const,
  actionLog.ActionLogInput,
  actionLog.ActionLog,
  actionLog.LightActionLog,
  actionLog.ActionLogInsight,
  actionLog.ActionLogFilter,
  actionLog.ActionLogSummary
);
export const boardCnst = cnstOf(
  "board" as const,
  board.BoardInput,
  board.Board,
  board.LightBoard,
  board.BoardInsight,
  board.BoardFilter,
  board.BoardSummary
);
export const chatRoomCnst = cnstOf(
  "chatRoom" as const,
  chatRoom.ChatRoomInput,
  chatRoom.ChatRoom,
  chatRoom.LightChatRoom,
  chatRoom.ChatRoomInsight,
  chatRoom.ChatRoomFilter,
  chatRoom.ChatRoomSummary
);
export const commentCnst = cnstOf(
  "comment" as const,
  comment.CommentInput,
  comment.Comment,
  comment.LightComment,
  comment.CommentInsight,
  comment.CommentFilter,
  comment.CommentSummary
);
export const emojiCnst = cnstOf(
  "emoji" as const,
  emoji.EmojiInput,
  emoji.Emoji,
  emoji.LightEmoji,
  emoji.EmojiInsight,
  emoji.EmojiFilter,
  emoji.EmojiSummary
);
export const groupCallCnst = cnstOf(
  "groupCall" as const,
  groupCall.GroupCallInput,
  groupCall.GroupCall,
  groupCall.LightGroupCall,
  groupCall.GroupCallInsight,
  groupCall.GroupCallFilter,
  groupCall.GroupCallSummary
);
export const reportCnst = cnstOf(
  "report" as const,
  report.ReportInput,
  report.Report,
  report.LightReport,
  report.ReportInsight,
  report.ReportFilter,
  report.ReportSummary
);
export const serviceDeskCnst = cnstOf(
  "serviceDesk" as const,
  serviceDesk.ServiceDeskInput,
  serviceDesk.ServiceDesk,
  serviceDesk.LightServiceDesk,
  serviceDesk.ServiceDeskInsight,
  serviceDesk.ServiceDeskFilter,
  serviceDesk.ServiceDeskSummary
);
export const settingCnst = cnstOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.LightSetting,
  shared.SettingInsight,
  shared.SettingFilter
);
export const storyCnst = cnstOf(
  "story" as const,
  story.StoryInput,
  story.Story,
  story.LightStory,
  story.StoryInsight,
  story.StoryFilter,
  story.StorySummary
);
export const summaryCnst = cnstOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.LightSummary,
  shared.SummaryInsight,
  shared.SummaryFilter
);
export const userCnst = cnstOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.LightUser,
  user.UserInsight,
  user.UserFilter,
  user.UserSummary
);
