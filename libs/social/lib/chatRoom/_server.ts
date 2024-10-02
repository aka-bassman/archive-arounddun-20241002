import * as db from "../db";
import { ChatRoomService } from "./chatRoom.service";
import { ChatRoomSignal } from "./chatRoom.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerChatRoomModule = () =>
  databaseModuleOf(
    {
      constant: cnst.chatRoomCnst,
      database: db.chatRoomDb,
      signal: ChatRoomSignal,
      service: ChatRoomService,
    },
    allSrvs
  );
