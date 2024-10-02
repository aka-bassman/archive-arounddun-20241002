import { LocalFileService } from "./localFile.service";
import { LocalFileSignal } from "./localFile.signal";
import { allSrvs } from "../srv";
import { serviceModuleOf } from "@core/server";

export const registerLocalFileModule = () =>
  serviceModuleOf({ signal: LocalFileSignal, service: LocalFileService, uses: {} }, allSrvs);
