import * as db from "../db";
import { KeyringService } from "./keyring.service";
import { KeyringSignal } from "./keyring.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";
import { getSsoProviders } from "@core/nest";
import type * as option from "../option";

export const registerKeyringModule = (securityOption: option.util.SecurityOptions, host: string) =>
  databaseModuleOf(
    {
      constant: cnst.keyringCnst,
      database: db.keyringDb,
      signal: KeyringSignal,
      service: KeyringService,
      uses: { host },
      providers: [...getSsoProviders(host, securityOption.sso)],
    },
    allSrvs
  );
