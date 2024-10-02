import { SecurityService } from "./security.service";
import { SecuritySignal } from "./security.signal";
import { allSrvs } from "../srv";
import { generateAeskey, generateJwtSecret } from "@core/nest";
import { serviceModuleOf } from "@core/server";
import type { BackendEnv } from "@core/base";

export const registerSecurityModule = ({ appName, environment, onCleanup }: BackendEnv) => {
  return serviceModuleOf(
    {
      signal: SecuritySignal,
      service: SecurityService,
      uses: {
        jwtSecret: generateJwtSecret(appName, environment),
        aeskey: generateAeskey(appName, environment),
        onCleanup,
      },
    },
    allSrvs
  );
};
