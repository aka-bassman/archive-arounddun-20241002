import * as db from "../db";
import { ReportService } from "./report.service";
import { ReportSignal } from "./report.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerReportModule = () =>
  databaseModuleOf(
    {
      constant: cnst.reportCnst,
      database: db.reportDb,
      signal: ReportSignal,
      service: ReportService,
    },
    allSrvs
  );
