import { SyrsService } from "./syrs.service";
import { allSrvs } from "../srv";
import { batchModuleOf, scalarModuleOf } from "@core/server";

export const registerSyrsScalarModule = () => scalarModuleOf({ signals: [], uses: {} }, allSrvs);

export const registerSyrsBatchModule = () => batchModuleOf({ service: SyrsService, uses: {} });
