import * as db from "../db";
import { EmojiService } from "./emoji.service";
import { EmojiSignal } from "./emoji.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerEmojiModule = () =>
  databaseModuleOf(
    {
      constant: cnst.emojiCnst,
      database: db.emojiDb,
      signal: EmojiSignal,
      service: EmojiService,
    },
    allSrvs
  );
