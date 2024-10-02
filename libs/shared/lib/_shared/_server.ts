import { SharedService } from "./shared.service";
import { allSrvs } from "../srv";
import { batchModuleOf, scalarModuleOf } from "@core/server";

export const registerSharedScalarModule = () => scalarModuleOf({ signals: [], uses: {} }, allSrvs);

export const registerSharedBatchModule = () => batchModuleOf({ service: SharedService, uses: {} });
