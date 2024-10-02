import * as db from "../db";
import { OrgService } from "./org.service";
import { OrgSignal } from "./org.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerOrgModule = (host: string) =>
  databaseModuleOf(
    {
      constant: cnst.orgCnst,
      database: db.orgDb,
      signal: OrgSignal,
      service: OrgService,
      uses: {
        origin: host === "localhost" ? `http://localhost:4200` : `https://${host}`,
      },
    },
    allSrvs
  );
