import { ActionLogService } from "./actionLog/actionLog.service";
import { BoardService } from "./board/board.service";
import { ChatRoomService } from "./chatRoom/chatRoom.service";
import { CommentService } from "./comment/comment.service";
import { EmojiService } from "./emoji/emoji.service";
import { GetServices } from "@core/server";
import { GroupCallService } from "./groupCall/groupCall.service";
import { OrgService } from "./org/org.service";
import { ReportService } from "./report/report.service";
import { ServiceDeskService } from "./serviceDesk/serviceDesk.service";
import { SettingService } from "./setting/setting.service";
import { StoryService } from "./story/story.service";
import { SummaryService } from "./summary/summary.service";
import { UserService } from "./user/user.service";
import { srv as shared } from "@shared/server";

export { srv as shared } from "@shared/server";
export { srv as util } from "@util/server";
export { UserService } from "./user/user.service";
export { BoardService } from "./board/board.service";
export { StoryService } from "./story/story.service";
export { CommentService } from "./comment/comment.service";
export { ActionLogService } from "./actionLog/actionLog.service";
export { SummaryService } from "./summary/summary.service";
export { ReportService } from "./report/report.service";
export { ChatRoomService } from "./chatRoom/chatRoom.service";
export { ServiceDeskService } from "./serviceDesk/serviceDesk.service";
export { EmojiService } from "./emoji/emoji.service";
export { GroupCallService } from "./groupCall/groupCall.service";
export { SettingService } from "./setting/setting.service";

export { OrgService } from "./org/org.service";
export const allSrvs = {
  ...shared.allSrvs,
  UserService,
  BoardService,
  StoryService,
  CommentService,
  ActionLogService,
  SummaryService,
  ReportService,
  ChatRoomService,
  ServiceDeskService,
  EmojiService,
  GroupCallService,
  SettingService,
  OrgService,
};

export type AllSrvs = GetServices<typeof allSrvs>;
