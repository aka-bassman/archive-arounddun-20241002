import * as db from "../db";
import { ServiceDeskService } from "./serviceDesk.service";
import { ServiceDeskSignal } from "./serviceDesk.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerServiceDeskModule = () =>
  databaseModuleOf(
    {
      constant: cnst.serviceDeskCnst,
      database: db.serviceDeskDb,
      signal: ServiceDeskSignal,
      service: ServiceDeskService,
    },
    allSrvs
  );
