import * as db from "../db";
import { TestService } from "./test.service";
import { TestSignal } from "./test.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerTestModule = () =>
  databaseModuleOf(
    {
      constant: cnst.testCnst,
      database: db.testDb,
      signal: TestSignal,
      service: TestService,
    },
    allSrvs
  );
