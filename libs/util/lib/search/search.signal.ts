import { Arg, Int, LogSignal, Query, Signal, resolve } from "@core/base";
import { SearchResult } from "./search.constant";
import { Srvs, type cnst } from "../cnst";

@Signal({ name: "Search" })
export class SearchSignal extends LogSignal(Srvs) {
  @Query.Admin(() => [String])
  async getSearchIndexNames() {
    const indexNames = await this.searchService.getSearchIndexNames();
    return resolve<string[]>(indexNames);
  }
  @Query.Admin(() => SearchResult)
  async getSearchResult(
    @Arg.Param("searchIndexName", () => String) searchIndexName: string,
    @Arg.Query("searchString", () => String, { nullable: true }) searchString: string | null,
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: string | null
  ) {
    const searchResult = await this.searchService.getSearchResult(searchIndexName, {
      skip: skip ?? undefined,
      limit: limit ?? undefined,
      sort: sort ?? undefined,
      searchString: searchString ?? undefined,
    });
    return resolve<cnst.SearchResult>(searchResult);
  }
  @Query.Admin(() => Boolean)
  async resyncSearchDocuments(@Arg.Param("searchIndexName", () => String) searchIndexName: string) {
    await this.searchService.resyncSearchDocuments(searchIndexName);
    return resolve<boolean>(true);
  }
  @Query.Admin(() => Boolean)
  async dropSearchDocuments(@Arg.Param("searchIndexName", () => String) searchIndexName: string) {
    await this.searchService.dropSearchDocuments(searchIndexName);
    return resolve<boolean>(true);
  }
}
