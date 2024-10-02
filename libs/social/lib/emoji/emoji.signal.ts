import { DbSignal, Mutation, Query, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";
@Signal(() => cnst.Emoji)
export class EmojiSignal extends DbSignal(cnst.emojiCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Admin },
}) {}
