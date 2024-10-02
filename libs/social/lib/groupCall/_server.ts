import * as db from "../db";
import { GroupCallService } from "./groupCall.service";
import { GroupCallSignal } from "./groupCall.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerGroupCallModule = () =>
  databaseModuleOf(
    {
      constant: cnst.groupCallCnst,
      database: db.groupCallDb,
      signal: GroupCallSignal,
      service: GroupCallService,
    },
    allSrvs
  );
