import { SearchService } from "./search.service";
import { SearchSignal } from "./search.signal";
import { allSrvs } from "../srv";
import { serviceModuleOf } from "@core/server";

export const registerSearchModule = () =>
  serviceModuleOf({ signal: SearchSignal, service: SearchService, uses: {} }, allSrvs);
