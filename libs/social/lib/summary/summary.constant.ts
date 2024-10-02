import { ActionLogSummary } from "../actionLog/actionLog.constant";
import { BoardSummary } from "../board/board.constant";
import { ChatRoomSummary } from "../chatRoom/chatRoom.constant";
import { CommentSummary } from "../comment/comment.constant";
import { EmojiSummary } from "../emoji/emoji.constant";
import { GroupCallSummary } from "../groupCall/groupCall.constant";
import { OrgSummary } from "../org/org.constant";
import { ReportSummary } from "../report/report.constant";
import { ServiceDeskSummary } from "../serviceDesk/serviceDesk.constant";
import { SocialUserSummary } from "../user/user.constant";
import { StorySummary } from "../story/story.constant";

import { AddModel, Full, Light, MixModels, Model } from "@core/base";
import { cnst as shared } from "@shared";

@Model.Summary("SocialSummary")
export class SocialSummary extends MixModels(
  OrgSummary,
  GroupCallSummary,
  EmojiSummary,
  ServiceDeskSummary,
  ChatRoomSummary,
  ActionLogSummary,
  BoardSummary,
  CommentSummary,
  StorySummary,
  SocialUserSummary,
  ReportSummary
) {}

export class SummaryObject extends AddModel(shared.Summary, SocialSummary) {}

@Model.Light("LightSummary")
export class LightSummary extends Light(SummaryObject, ["at"] as const) {}

@Model.Full("Summary")
export class Summary extends Full(SummaryObject, LightSummary, shared.Summary, shared.LightSummary) {}

export class SummaryInput extends shared.SummaryInput {}
