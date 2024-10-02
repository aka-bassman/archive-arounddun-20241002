import { actionLogSummaryDictionary } from "../actionLog/actionLog.dictionary";
import { boardSummaryDictionary } from "../board/board.dictionary";
import { chatRoomSummaryDictionary } from "../chatRoom/chatRoom.dictionary";
import { commentSummaryDictionary } from "../comment/comment.dictionary";
import { emojiSummaryDictionary } from "../emoji/emoji.dictionary";
import { groupCallSummaryDictionary } from "../groupCall/groupCall.dictionary";
import { orgSummaryDictionary } from "../org/org.dictionary";
import { reportSummaryDictionary } from "../report/report.dictionary";
import { serviceDeskSummaryDictionary } from "../serviceDesk/serviceDesk.dictionary";
import { storySummaryDictionary } from "../story/story.dictionary";
import { userSummaryDictionary } from "../user/user.dictionary";

import { ExtendModelDictionary, SignalDictionary } from "@core/base";
import type { SocialSummary } from "./summary.constant";
import type { SummarySignal } from "./summary.signal";

const modelDictionary = {
  // * ==================== Model ==================== * //
...orgSummaryDictionary,
  ...actionLogSummaryDictionary,
  ...boardSummaryDictionary,
  ...chatRoomSummaryDictionary,
  ...commentSummaryDictionary,
  ...emojiSummaryDictionary,
  ...groupCallSummaryDictionary,
  ...reportSummaryDictionary,
  ...serviceDeskSummaryDictionary,
  ...userSummaryDictionary,
  ...storySummaryDictionary,
  // * ==================== Model ==================== * //

  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies ExtendModelDictionary<SocialSummary>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<SummarySignal, SocialSummary>;

export const summaryDictionary = { ...modelDictionary, ...signalDictionary };
