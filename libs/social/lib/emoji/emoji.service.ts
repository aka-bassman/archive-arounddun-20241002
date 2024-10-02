import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";

@Service("EmojiService")
export class EmojiService extends DbService(db.emojiDb) {
  async summarize(): Promise<cnst.EmojiSummary> {
    return {
      ...(await this.emojiModel.getSummary()),
    };
  }
}
