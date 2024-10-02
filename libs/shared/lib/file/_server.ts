import * as db from "../db";
import { FileService } from "./file.service";
import { FileSignal } from "./file.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerFileModule = () =>
  databaseModuleOf(
    {
      constant: cnst.fileCnst,
      database: db.fileDb,
      signal: FileSignal,
      service: FileService,
    },
    allSrvs
  );
