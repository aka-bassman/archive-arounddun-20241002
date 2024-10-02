import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.EmojiInput)
export class EmojiInput extends Input(cnst.EmojiInput) {}

@Database.Document(() => cnst.Emoji)
export class Emoji extends Document(cnst.Emoji) {}

@Database.Model(() => cnst.Emoji)
export class EmojiModel extends Model(Emoji, cnst.emojiCnst) {
  async getSummary(): Promise<cnst.EmojiSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Emoji)
export class EmojiMiddleware extends Middleware(EmojiModel, Emoji) {
  onSchema(schema: SchemaOf<EmojiModel, Emoji>) {
    schema.index({ name: "text" });
  }
}
