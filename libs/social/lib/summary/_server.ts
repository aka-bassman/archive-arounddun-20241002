import * as db from "../db";
import { SummaryService } from "./summary.service";
import { SummarySignal } from "./summary.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerSummaryModule = () =>
  databaseModuleOf(
    {
      constant: cnst.summaryCnst,
      database: db.summaryDb,
      signal: SummarySignal,
      service: SummaryService,
      extended: true,
    },
    allSrvs
  );
