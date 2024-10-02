import * as db from "../db";
import { ImageHostingService } from "./imageHosting.service";
import { ImageHostingSignal } from "./imageHosting.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerImageHostingModule = () =>
  databaseModuleOf(
    {
      constant: cnst.imageHostingCnst,
      database: db.imageHostingDb,
      signal: ImageHostingSignal,
      service: ImageHostingService,
    },
    allSrvs
  );
