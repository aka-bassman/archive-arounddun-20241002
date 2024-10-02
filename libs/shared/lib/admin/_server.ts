import * as db from "../db";
import { AdminService } from "./admin.service";
import { AdminSignal } from "./admin.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";
import type * as option from "../option";

export const registerAdminModule = (rootAdminInfo: option.AccountInfo) =>
  databaseModuleOf(
    {
      constant: cnst.adminCnst,
      database: db.adminDb,
      signal: AdminSignal,
      service: AdminService,
      uses: { rootAdminInfo },
    },
    allSrvs
  );
