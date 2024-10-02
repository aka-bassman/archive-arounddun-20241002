import * as db from "../db";
import { PromptService } from "./prompt.service";
import { PromptSignal } from "./prompt.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerPromptModule = () =>
  databaseModuleOf(
    {
      constant: cnst.promptCnst,
      database: db.promptDb,
      signal: PromptSignal,
      service: PromptService,
    },
    allSrvs
  );
