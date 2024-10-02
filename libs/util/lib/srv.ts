import { GetServices } from "@core/server";
import { LocalFileService } from "./localFile/localFile.service";
import { SearchService } from "./search/search.service";
import { SecurityService } from "./security/security.service";

export { LocalFileService } from "./localFile/localFile.service";
export { SecurityService } from "./security/security.service";
export { SearchService } from "./search/search.service";

export const allSrvs = {
  LocalFileService,
  SecurityService,
  SearchService,
};
export type AllSrvs = GetServices<typeof allSrvs>;
