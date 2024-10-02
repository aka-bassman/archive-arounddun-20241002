import * as db from "../db";
import { SettingService } from "./setting.service";
import { SettingSignal } from "./setting.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerSettingModule = () =>
  databaseModuleOf(
    {
      constant: cnst.settingCnst,
      database: db.settingDb,
      signal: SettingSignal,
      service: SettingService,
    },
    allSrvs
  );
