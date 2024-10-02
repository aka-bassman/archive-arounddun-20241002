import { Document, Input } from "@core/server";
import { cnst } from "../cnst";

export class Chat extends Document(cnst.Chat) {}
export class ChatInput extends Input(cnst.Chat) {}
