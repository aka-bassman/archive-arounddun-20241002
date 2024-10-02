import { Dayjs, Field, ID, Model, dayjs } from "@core/base";
import { cnst as shared } from "@shared";

export const chatTypes = ["text", "image", "emoji", "enter", "exit"] as const;
export type ChatType = (typeof chatTypes)[number];

@Model.Scalar("Chat")
export class Chat {
  @Field.Prop(() => ID)
  user: string;

  @Field.Prop(() => String, { enum: chatTypes, default: "text" })
  type: ChatType;

  @Field.Prop(() => [shared.File])
  images: shared.File[];

  @Field.Prop(() => ID, { nullable: true })
  emoji: string | null;

  @Field.Prop(() => String, { nullable: true })
  text: string | null;

  @Field.Prop(() => Date, { default: () => dayjs() })
  at: Dayjs;

  isSame(chat: Chat) {
    if (this.user !== chat.user || this.type !== chat.type) return false;
    if (this.type === "text" && this.text !== chat.text) return false;
    else if (this.type === "image" && this.images.every((image, idx) => image.id !== chat.images[idx].id))
      return false;
    else if (this.type === "emoji" && this.emoji !== chat.emoji) return false;
    else return true;
  }

  static getPrev(chats: Chat[], idx: number) {
    return idx > 0 ? chats[idx - 1] : null;
  }

  static getNext(chats: Chat[], idx: number) {
    return idx < chats.length - 1 ? chats[idx + 1] : null;
  }
}
