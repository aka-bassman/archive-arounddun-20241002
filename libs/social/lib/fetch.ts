import * as sig from "./sig";
import { cnst } from "./cnst";
import { gqlOf, makeFetch, scalarUtilOf } from "@core/base";
import { fetch as shared } from "@shared";

const actionLogGql = gqlOf(cnst.actionLogCnst, sig.ActionLogSignal);
const boardGql = gqlOf(cnst.boardCnst, sig.BoardSignal);
const chatRoomGql = gqlOf(cnst.chatRoomCnst, sig.ChatRoomSignal);
const commentGql = gqlOf(cnst.commentCnst, sig.CommentSignal);
const emojiGql = gqlOf(cnst.emojiCnst, sig.EmojiSignal);
const groupCallGql = gqlOf(cnst.groupCallCnst, sig.GroupCallSignal);
const orgGql = gqlOf(cnst.orgCnst, sig.OrgSignal);
const reportGql = gqlOf(cnst.reportCnst, sig.ReportSignal);
const serviceDeskGql = gqlOf(cnst.serviceDeskCnst, sig.ServiceDeskSignal);
const storyGql = gqlOf(cnst.storyCnst, sig.StorySignal);
const settingGql = gqlOf(cnst.settingCnst, sig.SettingSignal, { overwrite: shared.settingGql });
const summaryGql = gqlOf(cnst.summaryCnst, sig.SummarySignal, { overwrite: shared.summaryGql });
const userGql = gqlOf(cnst.userCnst, sig.UserSignal, { overwrite: shared.userGql });

export const fetch = makeFetch(shared, {
  ...actionLogGql,
  ...boardGql,
  ...chatRoomGql,
  ...commentGql,
  ...emojiGql,
  ...groupCallGql,
  ...reportGql,
  ...serviceDeskGql,
  ...storyGql,
  ...settingGql,
  ...orgGql,
  ...summaryGql,
  ...userGql,
  ...scalarUtilOf("storyStat", cnst.StoryStat),
  ...scalarUtilOf("chat", cnst.Chat),
  ...scalarUtilOf("chatContribution", cnst.ChatContribution),
  ...scalarUtilOf("callContribution", cnst.CallContribution),
  actionLogGql,
  boardGql,
  chatRoomGql,
  commentGql,
  emojiGql,
  groupCallGql,
  reportGql,
  serviceDeskGql,
  storyGql,
  settingGql,
  orgGql,
  summaryGql,
  userGql,
});
