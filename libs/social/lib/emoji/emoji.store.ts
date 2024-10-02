import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Emoji)
export class EmojiStore extends stateOf(fetch.emojiGql, {
  isEmojiModalOpen: false,
  emojiTimeout: null as NodeJS.Timeout | null,
  isShowEmojiSelecter: false,
  isEmojiEdit: false,
}) {
  runEmoji(emoji: cnst.Emoji) {
    const { emojiTimeout } = this.pick("emojiTimeout");
    // if (emojiTimeout) clearInterval(emojiTimeout); //! FIXME
    const timeout = setTimeout(() => { this.set({ emoji: undefined }); }, 3000);
    this.set({ emojiTimeout: timeout, emoji, isShowEmojiSelecter: false });
  }
}
