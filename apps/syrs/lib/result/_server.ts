import * as db from "../db";
import { ResultService } from "./result.service";
import { ResultSignal } from "./result.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerResultModule = () =>
  databaseModuleOf(
    {
      constant: cnst.resultCnst,
      database: db.resultDb,
      signal: ResultSignal,
      service: ResultService,
    },
    allSrvs
  );
