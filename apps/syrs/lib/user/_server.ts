import * as db from "../db";
import { UserService } from "./user.service";
import { UserSignal } from "./user.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerUserModule = () =>
  databaseModuleOf(
    {
      constant: cnst.userCnst,
      database: db.userDb,
      signal: UserSignal,
      service: UserService,
      extended: true,
    },
    allSrvs
  );
