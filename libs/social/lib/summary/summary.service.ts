import * as db from "../db";
import { ExtendedSummaryService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import { srv as shared } from "@shared/server";
import type * as srv from "../srv";

@Service("SummaryService")
export class SummaryService extends ExtendedSummaryService(db.summaryDb, shared.SummaryService) {
  @Srv() protected readonly orgService: srv.OrgService;
  @Srv() protected readonly groupCallService: srv.GroupCallService;
  @Srv() protected readonly actionLogService: srv.ActionLogService;
  @Srv() protected readonly boardService: srv.BoardService;
  @Srv() protected readonly commentService: srv.CommentService;
  @Srv() protected readonly storyService: srv.StoryService;
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly reportService: srv.ReportService;
  @Srv() protected readonly chatRoomService: srv.ChatRoomService;
  @Srv() protected readonly serviceDeskService: srv.ServiceDeskService;
  @Srv() protected readonly emojiService: srv.EmojiService;

  async getSocialSummary(): Promise<cnst.SocialSummary> {
    return {
      ...(await this.actionLogService.summarize()),
      ...(await this.groupCallService.summarize()),
      ...(await this.emojiService.summarize()),
      ...(await this.serviceDeskService.summarize()),
      ...(await this.chatRoomService.summarize()),
      ...(await this.reportService.summarize()),
      ...(await this.boardService.summarize()),
      ...(await this.commentService.summarize()),
      ...(await this.storyService.summarize()),
      ...(await this.orgService.summarize()),
      ...(await this.userService.summarizeSocial()),
    };
  }
}
