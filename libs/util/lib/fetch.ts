import * as sig from "./sig";
import { cnst } from "./cnst";
import { fetchOf, makeFetch, scalarUtilOf } from "@core/base";

export const fetch = makeFetch(cnst.fetch, {
  ...fetchOf(sig.LocalFileSignal),
  ...fetchOf(sig.SecuritySignal),
  ...fetchOf(sig.SearchSignal),
  ...scalarUtilOf("accessToken" as const, cnst.AccessToken),
  ...scalarUtilOf("accessStat" as const, cnst.AccessStat),
  ...scalarUtilOf("coordinate" as const, cnst.Coordinate),
  ...scalarUtilOf("accessLog" as const, cnst.AccessLog),
  ...scalarUtilOf("searchResult" as const, cnst.SearchResult),
});
