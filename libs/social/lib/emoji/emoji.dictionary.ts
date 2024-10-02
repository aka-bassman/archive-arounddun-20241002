import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Emoji, EmojiFilter, EmojiInsight, EmojiSummary } from "./emoji.constant";
import type { EmojiSignal } from "./emoji.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Emoji", "이모지"],
  modelDesc: ["Emoji", "이모지"],

  // * ==================== Model ==================== * //
  name: ["Name", "이름"],
  "desc-name": ["Name", "이름"],

  file: ["File", "파일"],
  "desc-file": ["File", "파일"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Count in current query settting", "현재 쿼리 설정에 맞는 개수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Emoji, EmojiInsight, EmojiFilter>;

export const emojiSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalEmoji: ["Total Emoji", "총 이모지"],
  "desc-totalEmoji": ["Total number of emojis", "이모지의 총 개수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<EmojiSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("emoji" as const),
  // * ==================== Endpoint ==================== * //

  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<EmojiSignal, Emoji>;

export const emojiDictionary = { ...modelDictionary, ...signalDictionary };
