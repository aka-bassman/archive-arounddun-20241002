import * as db from "../db";
import { BannerService } from "./banner.service";
import { BannerSignal } from "./banner.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerBannerModule = () =>
  databaseModuleOf(
    {
      constant: cnst.bannerCnst,
      database: db.bannerDb,
      signal: BannerSignal,
      service: BannerService,
    },
    allSrvs
  );
