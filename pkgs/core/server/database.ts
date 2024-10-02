// TODO: 여기 너무 고치기 힘듦, 나중에..
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  DEFAULT_PAGE_SIZE,
  type DocumentModel,
  type FilterType,
  type FindQueryOption,
  type GetActionObject,
  type ListQueryOption,
  type QueryOf,
  type SortOf,
  dayjs,
  getFieldMetas,
  getFilterKeyMetaMapOnPrototype,
  getFilterQuery,
  getFilterSort,
} from "@core/base";
import { Logger, capitalize, lowerlize } from "@core/common";
import { Transaction } from "./serviceDecorators";
import { convertAggregateMatch } from "./schema";
import { createArrayLoader, createLoader, createQueryLoader, getLoaderMetas } from "./dataLoader";
import type { BaseMiddleware, Database, Mdl } from "./dbDecorators";
import type { Filter, Index, MeiliSearch } from "meilisearch";
import type { HydratedDocument } from "mongoose";
import type { RedisClientType } from "redis";
import type DataLoader from "dataloader";

export type DataInputOf<Input, Obj> = { [K in keyof Input as Input[K] extends any[] ? never : K]: Input[K] } & {
  [K in keyof Input as Input[K] extends any[] ? K : never]?: Input[K];
} & Partial<Obj>;

class CacheDatabase<T = any> {
  private logger: Logger;
  constructor(
    private readonly refName: string,
    private readonly redis: RedisClientType
  ) {
    this.logger = new Logger(`${refName}Cache`);
  }
  saveCacheTest(key: string, value: any) {
    this.logger.info(`saveCacheTest: ${key}`);
  }
}
class SearchDatabase<T = any> {
  private logger: Logger;
  private index: Index;
  constructor(
    readonly refName: string,
    readonly meili: MeiliSearch
  ) {
    this.logger = new Logger(`${refName}Search`);
    this.index = meili.index(lowerlize(refName));
  }
  async searchIds(
    searchText: string | undefined | null,
    option: { filter?: Filter; skip?: number | null; limit?: number | null; sort?: string[] | null } = {}
  ): Promise<{ ids: string[]; total: number }> {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE, sort } = option;
    if (!searchText) {
      const { results, total } = await this.index.getDocuments({ offset: skip ?? 0, limit: limit ?? 0 });
      return { ids: results.map((result) => result.id), total };
    }
    const { hits, estimatedTotalHits } = await this.index.search(searchText, {
      offset: skip ?? 0,
      limit: limit ?? 0,
      sort: sort ?? [],
      filter: option.filter,
      attributesToRetrieve: ["id"],
    });
    return { ids: hits.map((hit) => hit.id), total: estimatedTotalHits };
  }
  async count(
    searchText: string | undefined | null,
    option: { filter?: Filter; skip?: number | null; limit?: number | null; sort?: string | null } = {}
  ): Promise<number> {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE, sort = "" } = option;
    if (!searchText) {
      const { results, total } = await this.index.getDocuments({ offset: skip ?? 0, limit: limit ?? 0 });
      return total;
    }
    const { hits, estimatedTotalHits } = await this.index.search(searchText, {
      offset: skip ?? 0,
      limit: limit ?? 0,
      filter: option.filter,
      attributesToRetrieve: ["id"],
    });
    return estimatedTotalHits;
  }
}
export type DatabaseModel<
  T extends string,
  Input,
  Doc,
  Obj,
  Insight,
  Filter,
  Summary = any,
> = DatabaseModelWithQuerySort<T, Input, Doc, Obj, Insight, GetActionObject<Filter>, SortOf<Filter>, Summary>;
type DatabaseModelWithQuerySort<T extends string, Input, Doc, Obj, Insight, Query, Sort, Summary = any> = {
  logger: Logger;
  __model: Mdl<Doc, Obj>;
  __cache: CacheDatabase<T>;
  __search: SearchDatabase<T>;
  __loader: DataLoader<string, Doc, string>;
  __list(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<Doc[]>;
  __listIds(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<string[]>;
  __find(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc | null>;
  __findId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string | null>;
  __pick(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc>;
  __pickId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string>;
  __exists(query?: QueryOf<Doc>): Promise<string | null>;
  __count(query?: QueryOf<Doc>): Promise<number>;
  __insight(query?: QueryOf<Doc>): Promise<Insight>;
  getDefaultSummary(addQuery?: QueryOf<Doc>): Promise<Summary>;
} & {
  [key in Capitalize<T>]: Mdl<Doc, Obj>;
} & {
  [key in `${T}Loader`]: DataLoader<string, Doc, string>;
} & {
  [key in `${T}Cache`]: CacheDatabase<T>;
} & {
  [key in `${T}Search`]: SearchDatabase<T>;
} & {
  [K in `get${Capitalize<T>}`]: (id: string) => Promise<Doc>;
} & {
  [K in `load${Capitalize<T>}`]: (id?: string) => Promise<Doc | null>;
} & {
  [K in `load${Capitalize<T>}Many`]: (ids: string) => Promise<Doc[]>;
} & {
  [K in `create${Capitalize<T>}`]: (data: DataInputOf<Input, DocumentModel<Obj>>) => Promise<Doc>;
} & {
  [K in `update${Capitalize<T>}`]: (id: string, data: DataInputOf<Input, DocumentModel<Obj>>) => Promise<Doc>;
} & {
  [K in `remove${Capitalize<T>}`]: (id: string) => Promise<Doc>;
} & {
  [K in `search${Capitalize<T>}`]: (
    searchText: string,
    queryOption?: ListQueryOption<Sort>
  ) => Promise<{ docs: Doc[]; count: number }>;
} & {
  [K in `searchDocs${Capitalize<T>}`]: (searchText: string, queryOption?: ListQueryOption<Sort>) => Promise<Doc[]>;
} & {
  [K in `searchCount${Capitalize<T>}`]: (searchText: string) => Promise<number>;
} & {
  [K in keyof Query as K extends string ? `list${Capitalize<K>}` : never]: Query[K] extends (...args: infer Args) => any
    ? (...args: [...Args, queryOption?: ListQueryOption<Sort>]) => Promise<Doc[]>
    : never;
} & {
  [K in keyof Query as K extends string ? `listIds${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args, queryOption?: ListQueryOption<Sort>]) => Promise<string[]>
    : never;
} & {
  [K in keyof Query as K extends string ? `find${Capitalize<K>}` : never]: Query[K] extends (...args: infer Args) => any
    ? (...args: [...Args, queryOption?: FindQueryOption<Sort>]) => Promise<Doc | null>
    : never;
} & {
  [K in keyof Query as K extends string ? `findId${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args, queryOption?: FindQueryOption<Sort>]) => Promise<string | null>
    : never;
} & {
  [K in keyof Query as K extends string ? `pick${Capitalize<K>}` : never]: Query[K] extends (...args: infer Args) => any
    ? (...args: [...Args, queryOption?: FindQueryOption<Sort>]) => Promise<Doc>
    : never;
} & {
  [K in keyof Query as K extends string ? `pickId${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args, queryOption?: FindQueryOption<Sort>]) => Promise<string>
    : never;
} & {
  [K in keyof Query as K extends string ? `exists${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args]) => Promise<string | null>
    : never;
} & {
  [K in keyof Query as K extends string ? `count${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args]) => Promise<number>
    : never;
} & {
  [K in keyof Query as K extends string ? `insight${Capitalize<K>}` : never]: Query[K] extends (
    ...args: infer Args
  ) => any
    ? (...args: [...Args]) => Promise<Insight>
    : never;
};

class DatabaseModelStorage {
  __ModelType__ = "DatabaseModelStorage";
}
export const databaseModelOf = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model extends Mdl<any, any>,
  Middleware extends BaseMiddleware,
  Insight,
  Obj,
  Filter extends FilterType,
  Summary,
>(
  database: Database<T, Input, Doc, Model, Middleware, Insight, Obj, Filter, Summary>,
  model: Mdl<any, any>,
  redis: RedisClientType,
  meili: MeiliSearch
): DatabaseModel<T, Input, Doc, Model, Insight, Filter, Summary> => {
  //! 잘되는지 확인 필요
  type Sort = SortOf<Filter>;
  const [modelName, className]: [string, string] = [database.refName, capitalize(database.refName)];
  const insightFieldMetas = getFieldMetas(database.Insight);
  const accumulator = Object.fromEntries(insightFieldMetas.map((fieldMeta) => [fieldMeta.key, fieldMeta.accumulate]));
  const defaultInsight = Object.fromEntries(insightFieldMetas.map((fieldMeta) => [fieldMeta.key, fieldMeta.default]));

  const makeSafeQuery = (query?: QueryOf<Doc>) => ({ removedAt: { $exists: false }, ...(query ?? {}) });
  const makeSafeMatchStage = (query?: QueryOf<Doc>) => ({
    $match: { removedAt: { $exists: false }, ...convertAggregateMatch(query) },
  });
  const getListQuery = (query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>) => {
    const find = makeSafeQuery(query);
    const sort = getFilterSort(database.Filter, (queryOption?.sort as string) ?? "latest") as { [key: string]: 1 | -1 };
    const skip = queryOption?.skip ?? 0;
    const limit = queryOption?.limit === null ? DEFAULT_PAGE_SIZE : (queryOption?.limit ?? 0);
    const sample = queryOption?.sample;
    return { find, sort, skip, limit, sample };
  };
  const getFindQuery = (query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>) => {
    const find = makeSafeQuery(query);
    const sort = getFilterSort(database.Filter, (queryOption?.sort as string) ?? "latest") as { [key: string]: 1 | -1 };
    const skip = queryOption?.skip ?? 0;
    const sample = queryOption?.sample ?? false;
    return { find, sort, skip, sample };
  };
  const getSearchSort = (sortKey?: Sort | null | undefined) => {
    const sort = getFilterSort(database.Filter, (sortKey as string) ?? "latest");
    return Object.entries(sort).map(([key, value]) => `${key}:${value === 1 ? "asc" : "desc"}`);
  };
  const loader = createLoader(model);
  const cacheDatabase = new CacheDatabase(database.refName, redis);
  const searchDatabase = new SearchDatabase(database.refName, meili);

  const DatabaseModel =
    Reflect.getMetadata(database.refName, DatabaseModelStorage.prototype) ??
    class DatabaseModel {
      logger: Logger = new Logger(`${modelName}Model`);
      readonly __model: Mdl<any, any> = model;
      readonly __cache: CacheDatabase = cacheDatabase;
      readonly __search: SearchDatabase = searchDatabase;
      readonly __loader: DataLoader<string, HydratedDocument<any>, string> = loader;
      async __list(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<Doc[]> {
        const { find, sort, skip, limit, sample } = getListQuery(query, queryOption);
        return sample
          ? await this.__model.sample(find, limit)
          : ((await this.__model.find(find).sort(sort).skip(skip).limit(limit)) as Doc[]);
      }
      async __listIds(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<string[]> {
        const { find, sort, skip, limit, sample } = getListQuery(query, queryOption);
        return (
          sample
            ? await this.__model.sample(find, limit, [{ $project: { _id: 1 } }])
            : await this.__model.find(find).sort(sort).skip(skip).limit(limit).select("_id")
        ).map(({ _id }) => _id.toString());
      }
      async __find(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc | null> {
        const { find, sort, skip, sample } = getFindQuery(query, queryOption);
        const doc = sample
          ? await this.__model.sampleOne(find)
          : await this.__model.findOne(find).sort(sort).skip(skip);
        if (!doc) return null;
        return doc as Doc;
      }
      async __findId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string | null> {
        const { find, sort, skip, sample } = getFindQuery(query, queryOption);
        const doc = sample
          ? await this.__model.sampleOne(find, [{ $project: { _id: 1 } }])
          : await this.__model.findOne(find).sort(sort).skip(skip).select("_id");
        if (!doc) return null;
        return doc._id.toString();
      }
      async __pick(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc> {
        const { find, sort, skip, sample } = getFindQuery(query, queryOption);
        const doc = sample
          ? await this.__model.sampleOne(find)
          : await this.__model.findOne(find).sort(sort).skip(skip);
        if (!doc) throw new Error(`No Document (${database.refName}): ${JSON.stringify(query)}`);
        return doc as Doc;
      }
      async __pickId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string> {
        const { find, sort, skip, sample } = getFindQuery(query, queryOption);
        const doc = sample
          ? await this.__model.sampleOne(find, [{ $project: { _id: 1 } }])
          : await this.__model.findOne(find).sort(sort).skip(skip).select("_id");
        if (!doc) throw new Error(`No Document (${database.refName}): ${JSON.stringify(query)}`);
        return doc._id.toString();
      }
      async __exists(query?: QueryOf<Doc>): Promise<string | null> {
        const find = makeSafeQuery(query);
        const existingId = await (this.__model as any).exists(find);
        return existingId?.toString() ?? null;
      }
      async __count(query?: QueryOf<Doc>): Promise<number> {
        const find = makeSafeQuery(query);
        return await this.__model.countDocuments(find);
      }
      async __insight(query?: QueryOf<Doc>): Promise<Insight> {
        if (!accumulator) throw new Error(`No Insight (${database.refName})`);
        const res = await this.__model.aggregate([
          makeSafeMatchStage(query),
          { $group: { _id: null, ...accumulator } },
        ]);
        const data = res[0];
        return data ?? defaultInsight;
      }
      async getDefaultSummary(addQuery: QueryOf<Doc> = {}) {
        if (!database.Summary) return {};
        const fieldMetas = getFieldMetas(database.Summary);
        const summary: any = {};
        await Promise.all(
          fieldMetas
            .filter((fieldMeta) => !!fieldMeta.query)
            .map(async (fieldMeta) => {
              const query = typeof fieldMeta.query === "function" ? fieldMeta.query() : fieldMeta.query;
              summary[fieldMeta.key] = query
                ? await model.countDocuments({ ...query, ...addQuery })
                : fieldMeta.default;
            })
        );
        return summary;
      }
      async [`get${className}`](id: string) {
        const doc = await this.__loader.load(id);
        if (!doc) throw new Error(`No Document (${database.refName}): ${id}`);
        return doc;
      }
      async [`load${className}`](id?: string) {
        return (id ? await this.__loader.load(id) : null) as Doc | null;
      }
      async [`load${className}Many`](ids: string[]) {
        return await this.__loader.loadMany(ids);
      }
      async [`create${className}`](data) {
        return await new this.__model(data).save();
      }
      async [`update${className}`](id, data) {
        const doc = await this.__model.pickById(id);
        return await doc.set(data).save();
      }
      async [`remove${className}`](id) {
        const doc = await this.__model.pickById(id);
        return await doc.set({ removedAt: dayjs() }).save();
      }
      async [`search${className}`](searchText: string, queryOption: ListQueryOption<Sort> = {}) {
        const { skip, limit, sort } = queryOption;
        const { ids, total } = await this.__search.searchIds(searchText, { skip, limit, sort: getSearchSort(sort) });
        const docs = await this.__loader.loadMany(ids);
        return { docs, count: total };
      }
      async [`searchDocs${className}`](searchText: string, queryOption: ListQueryOption<Sort> = {}) {
        const { skip, limit, sort } = queryOption;
        const { ids } = await this.__search.searchIds(searchText, { skip, limit, sort: getSearchSort(sort) });
        return await this.__loader.loadMany(ids);
      }
      async [`searchCount${className}`](searchText: string) {
        return await this.__search.count(searchText);
      }
    };

  DatabaseModel.prototype[className] = model;
  DatabaseModel.prototype[`${modelName}Loader`] = loader;
  DatabaseModel.prototype[`${modelName}Cache`] = cacheDatabase;
  DatabaseModel.prototype[`${modelName}Search`] = searchDatabase;

  const getQueryDataFromKey = (queryKey: string, args: any): { query: any; queryOption: any } => {
    const lastArg = args.at(-1);
    const hasQueryOption =
      typeof lastArg === "object" &&
      (typeof lastArg.skip === "number" || typeof lastArg.limit === "number" || typeof lastArg.sort === "string");
    const queryFn = getFilterQuery(database.Filter, queryKey);
    const query = queryFn(...(hasQueryOption ? args.slice(0, -1) : args));
    const queryOption = hasQueryOption ? lastArg : {};
    return { query, queryOption };
  };
  const filterKeyMetaMap = getFilterKeyMetaMapOnPrototype(database.Filter.prototype);
  const queryKeys = [...filterKeyMetaMap.keys()];
  queryKeys.forEach((queryKey) => {
    const queryFn = getFilterQuery(database.Filter, queryKey);
    DatabaseModel.prototype[`list${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__list(query, queryOption);
    };
    DatabaseModel.prototype[`listIds${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__listIds(query, queryOption);
    };
    DatabaseModel.prototype[`find${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__find(query, queryOption);
    };
    DatabaseModel.prototype[`findId${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__findId(query, queryOption);
    };
    DatabaseModel.prototype[`pick${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__pick(query, queryOption);
    };
    DatabaseModel.prototype[`pickId${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__pickId(query, queryOption);
    };
    DatabaseModel.prototype[`exists${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__exists(query);
    };
    DatabaseModel.prototype[`count${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__count(query);
    };
    DatabaseModel.prototype[`insight${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__insight(query);
    };
  });
  const loaderMetas = getLoaderMetas(database.Model);
  loaderMetas.forEach((loaderMeta) => {
    const loader =
      loaderMeta.type === "Field"
        ? createLoader(model, loaderMeta.fieldName)
        : loaderMeta.type === "ArrayField"
          ? createArrayLoader(model, loaderMeta.fieldName)
          : loaderMeta.type === "Query"
            ? createQueryLoader(model, loaderMeta.queryKeys ?? [])
            : null;
    DatabaseModel.prototype[loaderMeta.key] = loader;
  });
  Object.getOwnPropertyNames(database.Model.prototype).forEach((key) => {
    DatabaseModel.prototype[key] = database.Model.prototype[key];
  });

  const createDescriptor = Object.getOwnPropertyDescriptor(DatabaseModel.prototype, `create${className}`);
  if (createDescriptor) Transaction()(DatabaseModel.prototype, `create${className}`, createDescriptor);

  const updateDescriptor = Object.getOwnPropertyDescriptor(DatabaseModel.prototype, `update${className}`);
  if (updateDescriptor) Transaction()(DatabaseModel.prototype, `update${className}`, updateDescriptor);

  const removeDescriptor = Object.getOwnPropertyDescriptor(DatabaseModel.prototype, `remove${className}`);
  if (removeDescriptor) Transaction()(DatabaseModel.prototype, `remove${className}`, removeDescriptor);

  Reflect.defineMetadata(database.refName, DatabaseModel, DatabaseModelStorage.prototype);
  return new DatabaseModel();
};
