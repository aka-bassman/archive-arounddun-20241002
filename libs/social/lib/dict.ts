import { actionLogDictionary } from "./actionLog/actionLog.dictionary";
import { boardDictionary } from "./board/board.dictionary";
import { chatDictionary } from "./_social/chat.dictionary";
import { chatRoomDictionary } from "./chatRoom/chatRoom.dictionary";
import { commentDictionary } from "./comment/comment.dictionary";
import { emojiDictionary } from "./emoji/emoji.dictionary";
import { groupCallDictionary } from "./groupCall/groupCall.dictionary";
import { orgDictionary } from "./org/org.dictionary";
import { reportDictionary } from "./report/report.dictionary";
import { serviceDeskDictionary } from "./serviceDesk/serviceDesk.dictionary";
import { settingDictionary } from "./setting/setting.dictionary";
import { dictionary as shared } from "@shared";
import { socialDictionary } from "./_social/social.dictionary";
import { storyDictionary } from "./story/story.dictionary";
import { summaryDictionary } from "./summary/summary.dictionary";
import { userDictionary } from "./user/user.dictionary";

import * as sig from "./sig";
import { cnst } from "./cnst";
import { dictionaryOf, makeDictionary, makeTrans, scalarDictionaryOf } from "@core/base";

export const dictionary = makeDictionary(shared, {
  ...socialDictionary,
  // * ==================== Models ==================== * //
  org: dictionaryOf(orgDictionary, cnst.orgCnst, sig.OrgSignal),
  actionLog: dictionaryOf(actionLogDictionary, cnst.actionLogCnst, sig.ActionLogSignal),
  board: dictionaryOf(boardDictionary, cnst.boardCnst, sig.BoardSignal),
  chatRoom: dictionaryOf(chatRoomDictionary, cnst.chatRoomCnst, sig.ChatRoomSignal),
  comment: dictionaryOf(commentDictionary, cnst.commentCnst, sig.CommentSignal),
  emoji: dictionaryOf(emojiDictionary, cnst.emojiCnst, sig.EmojiSignal),
  groupCall: dictionaryOf(groupCallDictionary, cnst.groupCallCnst, sig.GroupCallSignal),
  report: dictionaryOf(reportDictionary, cnst.reportCnst, sig.ReportSignal),
  serviceDesk: dictionaryOf(serviceDeskDictionary, cnst.serviceDeskCnst, sig.ServiceDeskSignal),
  story: dictionaryOf(storyDictionary, cnst.storyCnst, sig.StorySignal),
  // * ==================== Models ==================== * //

  // * ==================== Extended Models ==================== * //
  setting: dictionaryOf(settingDictionary, cnst.settingCnst, sig.SettingSignal),
  summary: dictionaryOf(summaryDictionary, cnst.summaryCnst, sig.SummarySignal),
  user: dictionaryOf(userDictionary, cnst.userCnst, sig.UserSignal),
  // * ==================== Extended Models ==================== * //

  // * ==================== Scalar Models ==================== * //
  chat: scalarDictionaryOf(cnst.Chat, chatDictionary, sig.ChatSignal),
  // * ==================== Scalar Models ==================== * //

  // * ==================== Service Models ==================== * //
  // * ==================== Service Models ==================== * //
} as const);
export const { Revert, translate, msg } = makeTrans(dictionary);
