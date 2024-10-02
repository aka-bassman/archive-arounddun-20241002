import * as db from "../db";
import { ActionLogService } from "./actionLog.service";
import { ActionLogSignal } from "./actionLog.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerActionLogModule = () =>
  databaseModuleOf(
    {
      constant: cnst.actionLogCnst,
      database: db.actionLogDb,
      signal: ActionLogSignal,
      service: ActionLogService,
    },
    allSrvs
  );
