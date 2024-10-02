import { LogService, Service, Use } from "@core/server";
import { type TextDoc, getFullModelRef } from "@core/base";
import { capitalize } from "@core/common";
import { makeTextFilter } from "@core/nest";
import type { DatabaseClient, SearchClient } from "@util/nest";
import type { cnst } from "../cnst";

@Service("SearchService")
export class SearchService extends LogService("SearchService") {
  @Use() searchClient: SearchClient;
  @Use() databaseClient: DatabaseClient;

  async onModuleInit() {
    //
  }
  async getSearchIndexNames() {
    return await this.searchClient.getIndexNames();
  }
  async getSearchResult(
    searchIndexName: string,
    options: { skip?: number; limit?: number; sort?: string; searchString?: string }
  ): Promise<cnst.SearchResult> {
    return await this.searchClient.getSearchResult(searchIndexName, options);
  }
  async dropSearchDocuments(searchIndexName: string) {
    return await this.searchClient.dropIndex(searchIndexName);
  }
  async resyncSearchDocuments(searchIndexName: string) {
    const BATCH_SIZE = 1000;
    const modelName = capitalize(searchIndexName);
    const modelRef = getFullModelRef(modelName);
    const model = this.databaseClient.getModel(modelName);
    const totalCount = await model.countDocuments({ removedAt: { $exists: false } });
    const filterText = makeTextFilter(modelRef);
    for (let i = 0; i < totalCount; i += BATCH_SIZE) {
      const docs = (await model
        .find({ removedAt: { $exists: false } })
        .skip(i)
        .limit(BATCH_SIZE)) as TextDoc[];
      const textDocs = docs.map((doc) => filterText(doc, { id: doc.id as string }));
      await this.searchClient.upsertDocuments(searchIndexName, textDocs);
    }
  }
}
