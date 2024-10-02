/* eslint-disable @typescript-eslint/use-unknown-in-catch-callback-variable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import "reflect-metadata";
import { type BaseMiddleware, type DataInputOf, type Database, type DatabaseModel } from ".";
import {
  BaseObject,
  type DocumentModel,
  FilterOutInternalArgs,
  type FilterType,
  FindQueryOption,
  type GetActionObject,
  ListQueryOption,
  QueryOf,
  type SortOf,
  Type,
  getFilterKeyMetaMapOnPrototype,
  getFilterQuery,
} from "../base";
import { CronExpression, Cron as NestCron, Interval as NestInterval } from "@nestjs/schedule";
import { Dayjs } from "@core/base";
import { Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Logger } from "@core/common";
import { applyMixins } from "../common/applyMixins";
import { capitalize } from "../common/capitalize";
import type { Queue as BullQueue, Job } from "bull";
import type { Connection, HydratedDocument } from "mongoose";
import type { Server } from "socket.io";

export type GetServices<AllSrvs extends { [key: string]: Type | undefined }> = {
  [key in keyof AllSrvs]: AllSrvs[key] extends Type<infer Srv> | undefined
    ? Srv
    : AllSrvs[key] extends Type<infer Srv>
      ? Srv
      : never;
};

export class ServiceStorage {}

const getServiceRefs = (refName: string) => {
  return (Reflect.getMetadata(refName, ServiceStorage.prototype) ?? []) as Type[];
};
const setServiceRefs = (refName: string, services: Type[]) => {
  Reflect.defineMetadata(refName, services, ServiceStorage.prototype);
};
const isServiceDefined = (srvRef: Type) => {
  return (Reflect.getMetadata("service", srvRef.prototype as object) as boolean | undefined) ?? false;
};
const setServiceDefined = (srvRef: Type) => {
  Reflect.defineMetadata("service", true, srvRef.prototype as object);
};
export interface ServiceInjectMeta {
  type: "Db" | "Srv" | "Use" | "Queue" | "Websocket";
  name: string;
  key: string;
}
const getServiceInjectMetaMapOnPrototype = (prototype: object) => {
  return (
    (Reflect.getMetadata("inject", prototype) as Map<string, ServiceInjectMeta> | undefined) ??
    new Map<string, ServiceInjectMeta>()
  );
};
const setServiceInjectMetaMapOnPrototype = (prototype: object, injectMetaMap: Map<string, ServiceInjectMeta>) => {
  Reflect.defineMetadata("inject", injectMetaMap, prototype);
};

export function Service(name: string) {
  return function (target: Type) {
    const services = getServiceRefs(name);
    setServiceRefs(name, [...services, target]);
    Reflect.defineMetadata(name, [...services, target], ServiceStorage.prototype);
    return target;
  };
}
export function Srv(name?: string): PropertyDecorator {
  return function (prototype: object, key: string) {
    const metadataMap = getServiceInjectMetaMapOnPrototype(prototype);
    metadataMap.set(key, { type: "Srv", key, name: name ?? capitalize(key) });
    setServiceInjectMetaMapOnPrototype(prototype, metadataMap);
  };
}
export function Use(name?: string): PropertyDecorator {
  return function (prototype: object, key: string) {
    const metadataMap = getServiceInjectMetaMapOnPrototype(prototype);
    metadataMap.set(key, { type: "Use", key, name: name ?? capitalize(key) });
    setServiceInjectMetaMapOnPrototype(prototype, metadataMap);
  };
}
export function Queue(name?: string): PropertyDecorator {
  return function (prototype: object, key: string) {
    const metadataMap = getServiceInjectMetaMapOnPrototype(prototype);
    metadataMap.set(key, { type: "Queue", key, name: name ?? capitalize(key) });
    setServiceInjectMetaMapOnPrototype(prototype, metadataMap);
  };
}
export type Queue<Signal> = {
  [K in keyof Signal as K extends string
    ? Signal[K] extends (...args: any) => Promise<{ __Returns__: "Done" }>
      ? K
      : never
    : never]: Signal[K] extends (...args: infer Args) => Promise<infer R>
    ? (...args: FilterOutInternalArgs<Args>) => Promise<Job>
    : never;
} & BullQueue;
export function Websocket(name?: string): PropertyDecorator {
  return function (prototype: object, key: string) {
    const metadataMap = getServiceInjectMetaMapOnPrototype(prototype);
    metadataMap.set(key, { type: "Websocket", key, name: name ?? capitalize(key) });
    setServiceInjectMetaMapOnPrototype(prototype, metadataMap);
  };
}
export type Websocket<Signal> = {
  [K in keyof Signal as K extends string
    ? Signal[K] extends (...args: any) => Promise<{ __Returns__: "Subscribe" }>
      ? K
      : Signal[K] extends (...args: any) => { __Returns__: "Subscribe" }
        ? K
        : never
    : never]: Signal[K] extends (...args: infer Args) => Promise<{ __Returns__: "Subscribe" } & infer R>
    ? (...args: [...FilterOutInternalArgs<Args>, data: DocumentModel<R>]) => Promise<void>
    : Signal[K] extends (...args: infer Args) => { __Returns__: "Subscribe" } & infer R
      ? (...args: [...FilterOutInternalArgs<Args>, data: DocumentModel<R>]) => void
      : never;
} & { server: Server };

export function Db(name: string): PropertyDecorator {
  return function (prototype: object, key: string) {
    const metadataMap = getServiceInjectMetaMapOnPrototype(prototype);
    metadataMap.set(key, { type: "Db", key, name });
    setServiceInjectMetaMapOnPrototype(prototype, metadataMap);
  };
}
export const serviceOf = (srvRef: Type) => {
  if (isServiceDefined(srvRef)) return srvRef;
  const injectMetaMap = getServiceInjectMetaMapOnPrototype(srvRef.prototype);
  for (const injectMeta of [...injectMetaMap.values()]) {
    if (injectMeta.type === "Db") InjectModel(injectMeta.name)(srvRef.prototype as object, injectMeta.key);
    else if (injectMeta.type === "Use") Inject(injectMeta.name)(srvRef.prototype as object, injectMeta.key);
    else if (injectMeta.type === "Srv") {
      const services = getServiceRefs(injectMeta.name);
      if (!services.length) throw new Error(`Service ${injectMeta.name} not found`);
      Inject(services.at(-1))(srvRef.prototype as object, injectMeta.key);
    } else if (injectMeta.type === "Queue") Inject(injectMeta.name)(srvRef.prototype as object, injectMeta.key);
    else Inject(injectMeta.name)(srvRef.prototype as object, injectMeta.key); // websocket
  }
  InjectConnection()(srvRef.prototype as object, "connection"); // only for internal use
  Injectable()(srvRef);
  setServiceDefined(srvRef);
  return srvRef;
};
export function MixSrvs<
  T1 = unknown,
  T2 = unknown,
  T3 = unknown,
  T4 = unknown,
  T5 = unknown,
  T6 = unknown,
  T7 = unknown,
  T8 = unknown,
  T9 = unknown,
  T10 = unknown,
  T11 = unknown,
  T12 = unknown,
  T13 = unknown,
  T14 = unknown,
  T15 = unknown,
  T16 = unknown,
  T17 = unknown,
  T18 = unknown,
  T19 = unknown,
  T20 = unknown,
>(
  t1: Type<T1>,
  t2?: Type<T2>,
  t3?: Type<T3>,
  t4?: Type<T4>,
  t5?: Type<T5>,
  t6?: Type<T6>,
  t7?: Type<T7>,
  t8?: Type<T8>,
  t9?: Type<T9>,
  t10?: Type<T10>,
  t11?: Type<T11>,
  t12?: Type<T12>,
  t13?: Type<T13>,
  t14?: Type<T14>,
  t15?: Type<T15>,
  t16?: Type<T16>,
  t17?: Type<T17>,
  t18?: Type<T18>,
  t19?: Type<T19>,
  t20?: Type<T20>
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20> {
  class Mix extends (t1 as any) {}
  const injectMetadataMap = new Map(
    [t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20]
      .filter((t) => !!t)
      .reduce((acc, srvRef: Type) => {
        const injectMetadataMap = getServiceInjectMetaMapOnPrototype(srvRef);
        applyMixins(Mix, [srvRef]);
        return [...acc, ...injectMetadataMap];
      }, [])
  );
  Reflect.defineMetadata("service", false, Mix.prototype);
  Reflect.defineMetadata("inject", injectMetadataMap, Mix.prototype);
  return Mix as unknown as Type<
    T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20
  >;
}

export const LogService = <T extends string>(name: T) => {
  class LogService {
    protected readonly logger = new Logger(name);
  }
  return LogService;
};

type QueueService<Signal> = {
  [K in keyof Signal as K extends string
    ? Signal[K] extends (...args: any) => Promise<{ __Returns__: "Done" }>
      ? K
      : never
    : never]: Signal[K] extends (...args: infer Args) => Promise<infer R>
    ? (...args: FilterOutInternalArgs<Args>) => Promise<Job>
    : never;
};

type DatabaseService<T extends string, Input, Doc, Model, Insight, Filter, Summary> = DatabaseServiceWithQuerySort<
  T,
  Input,
  Doc,
  Model,
  Insight,
  GetActionObject<Filter>,
  SortOf<Filter>
>;
type DatabaseServiceWithQuerySort<T extends string, Input, Doc, Model, Insight, Query, Sort> = {
  logger: Logger;
  __databaseModel: Model;
  __list(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<Doc[]>;
  __listIds(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<string[]>;
  __find(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc | null>;
  __findId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string | null>;
  __pick(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc>;
  __pickId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string>;
  __exists(query?: QueryOf<Doc>): Promise<string | null>;
  __count(query?: QueryOf<Doc>): Promise<number>;
  __insight(query?: QueryOf<Doc>): Promise<Insight>;
  __search(query: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<{ docs: Doc[]; count: number }>;
  __searchDocs(query: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<Doc[]>;
  __searchCount(query: QueryOf<Doc>): Promise<number>;
  _preCreate(data: DataInputOf<Input, Doc>): Promise<DataInputOf<Input, Doc>>;
  _postCreate(doc: Doc): Promise<Doc>;
  _preUpdate(id: string, data: Partial<Doc>): Promise<Partial<Doc>>;
  _postUpdate(doc: Doc): Promise<Doc>;
  _preRemove(id: string): Promise<void>;
  _postRemove(doc: Doc): Promise<Doc>;
} & { [key in `${T}Model`]: Model } & {
  [K in `get${Capitalize<T>}`]: (id: string) => Promise<Doc>;
} & {
  [K in `load${Capitalize<T>}`]: (id?: string) => Promise<Doc | null>;
} & {
  [K in `load${Capitalize<T>}Many`]: (ids: string[]) => Promise<Doc[]>;
} & {
  [K in `create${Capitalize<T>}`]: (data: DataInputOf<Input, Doc>) => Promise<Doc>;
} & {
  [K in `update${Capitalize<T>}`]: (id: string, data: Partial<Doc>) => Promise<Doc>;
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
export const DbService = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model extends DatabaseModel<T, Input, Doc, Obj, Insight, Filter, Summary>,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
  Signal = unknown,
>(
  database: Database<T, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary>,
  sigRef?: Type<Signal>
): Type<DatabaseService<T, Input, Doc, Model, Insight, Filter, Summary>> => {
  type Sort = SortOf<Filter>;
  const [modelName, className]: [string, string] = [database.refName, capitalize(database.refName)];
  class DbService {
    logger = new Logger(`${modelName}Service`);
    @Use(`${modelName}Model`) __databaseModel: DatabaseModel<T, Input, Doc, Model, Insight, Filter, Summary>;

    async __list(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<Doc[]> {
      return await this.__databaseModel.__list(query, queryOption);
    }
    async __listIds(query?: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>): Promise<string[]> {
      return await this.__databaseModel.__listIds(query, queryOption);
    }
    async __find(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc | null> {
      return await this.__databaseModel.__find(query, queryOption);
    }
    async __findId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string | null> {
      return await this.__databaseModel.__findId(query, queryOption);
    }
    async __pick(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<Doc> {
      return await this.__databaseModel.__pick(query, queryOption);
    }
    async __pickId(query?: QueryOf<Doc>, queryOption?: FindQueryOption<Sort>): Promise<string> {
      return await this.__databaseModel.__pickId(query, queryOption);
    }
    async __exists(query?: QueryOf<Doc>): Promise<string | null> {
      return await this.__databaseModel.__exists(query);
    }
    async __count(query?: QueryOf<Doc>): Promise<number> {
      return await this.__databaseModel.__count(query);
    }
    async __insight(query: QueryOf<Doc>): Promise<Insight> {
      return await this.__databaseModel.__insight(query);
    }
    async __search(searchText: string, queryOption?: ListQueryOption<Sort>): Promise<{ docs: Doc[]; count: number }> {
      return await this.__databaseModel[`search${className}`](searchText, queryOption);
    }
    async __searchDocs(searchText: string, queryOption?: ListQueryOption<Sort>): Promise<Doc[]> {
      return await this.__databaseModel[`searchDocs${className}`](searchText, queryOption);
    }
    async __searchCount(searchText: string): Promise<number> {
      return await this.__databaseModel[`searchCount${className}`](searchText);
    }

    async _preCreate(data: DataInputOf<Input, Doc>): Promise<DataInputOf<Input, Doc>> {
      return data;
    }
    async _postCreate(doc: Doc): Promise<Doc> {
      return doc;
    }
    async _preUpdate(id: string, data: Partial<Doc>): Promise<Partial<Doc>> {
      return data;
    }
    async _postUpdate(doc: Doc): Promise<Doc> {
      return doc;
    }
    async _preRemove(id: string) {
      return;
    }
    async _postRemove(doc: Doc): Promise<Doc> {
      return doc;
    }
    async [`get${className}`](id: string) {
      return await this.__databaseModel[`get${className}`](id);
    }
    async [`load${className}`](id?: string) {
      return await this.__databaseModel[`load${className}`](id);
    }
    async [`load${className}Many`](ids: string[]) {
      return await this.__databaseModel[`load${className}Many`](ids);
    }
    async [`create${className}`](data: DataInputOf<Input, Doc>): Promise<Doc> {
      const input = await this._preCreate(data);
      const doc = await this.__databaseModel[`create${className}`](input);
      return await this._postCreate(doc);
    }
    async [`update${className}`](id: string, data: DataInputOf<Input, Doc>): Promise<Doc> {
      const input = await this._preUpdate(id, data);
      const doc = await this.__databaseModel[`update${className}`](id, input);
      return await this._postUpdate(doc);
    }
    async [`remove${className}`](id: string): Promise<Doc> {
      await this._preRemove(id);
      const doc = await this.__databaseModel[`remove${className}`](id);
      return await this._postRemove(doc);
    }
    async [`search${className}`](query: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>) {
      return await this.__databaseModel[`search${className}`](query, queryOption);
    }
    async [`searchDocs${className}`](query: QueryOf<Doc>, queryOption?: ListQueryOption<Sort>) {
      return await this.__databaseModel[`searchDocs${className}`](query, queryOption);
    }
    async [`searchCount${className}`](query: QueryOf<Doc>) {
      return await this.__databaseModel[`searchCount${className}`](query);
    }
  }
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
    DbService.prototype[`list${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__list(query, queryOption);
    };
    DbService.prototype[`listIds${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__listIds(query, queryOption);
    };
    DbService.prototype[`find${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__find(query, queryOption);
    };
    DbService.prototype[`findId${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__findId(query, queryOption);
    };
    DbService.prototype[`pick${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__pick(query, queryOption);
    };
    DbService.prototype[`pickId${capitalize(queryKey)}`] = async function (...args: any) {
      const { query, queryOption } = getQueryDataFromKey(queryKey, args);
      return this.__pickId(query, queryOption);
    };
    DbService.prototype[`exists${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__exists(query);
    };
    DbService.prototype[`count${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__count(query);
    };
    DbService.prototype[`insight${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__insight(query);
    };
  });
  Use(`${modelName}Model`)(DbService.prototype, `${modelName}Model`);
  return DbService as any;
};

export const ExtendedUserService = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model extends DatabaseModel<T, Input, Doc, Obj, Insight, Filter, Summary>,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
  Srv,
  Signal = unknown,
>(
  database: Database<T, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary>,
  srvRef: Type<Srv>,
  sigRef?: Type<Signal>
) => {
  const filterKeyMetaMap = getFilterKeyMetaMapOnPrototype(database.Filter.prototype);
  const queryKeys = [...filterKeyMetaMap.keys()];
  queryKeys.forEach((queryKey) => {
    const queryFn = getFilterQuery(database.Filter, queryKey);
    srvRef.prototype[`list${capitalize(queryKey)}`] = async function (...args: any) {
      const queryOption = args.at(-1);
      const hasQueryOption =
        typeof queryOption === "object" &&
        (typeof queryOption.skip === "number" ||
          typeof queryOption.limit === "number" ||
          typeof queryOption.sort === "string");

      const query = queryFn(...(hasQueryOption ? args.slice(0, -1) : args));
      return this.__list(query, queryOption);
    };
    srvRef.prototype[`insight${capitalize(queryKey)}`] = async function (...args: any) {
      const query = queryFn(...args);
      return this.__insight(query);
    };
  });

  type UserObject = BaseObject & { nickname: string };
  return srvRef as unknown as Type<
    DatabaseService<T, Input, Doc, Model, Insight, Filter, Summary> & { queue: QueueService<Signal> } & {
      [K in keyof Srv]: Srv[K] extends (...args: infer Args) => Promise<UserObject>
        ? (...args: Args) => Promise<Doc>
        : Srv[K] extends (...args: infer Args) => Promise<UserObject[]>
          ? (...args: Args) => Promise<Doc[]>
          : Srv[K] extends UserObject
            ? Doc
            : Srv[K] extends UserObject[]
              ? Doc[]
              : Srv[K];
    }
  >;
};

export const ExtendedSummaryService = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
  Srv,
  Signal = unknown,
>(
  database: Database<T, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary>,
  srvRef: Type<Srv>,
  sigRef?: Type<Signal>
) => {
  type SummaryObject = BaseObject & { type: string; at: Dayjs };
  return srvRef as unknown as Type<
    Omit<
      DatabaseService<T, Input, Doc, Model, Insight, Filter, Summary> & { queue: QueueService<Signal> } & {
        [K in keyof Srv]: Srv[K] extends (...args: infer Args) => Promise<SummaryObject>
          ? (...args: Args) => Promise<Doc>
          : Srv[K] extends (...args: infer Args) => Promise<SummaryObject[]>
            ? (...args: Args) => Promise<Doc[]>
            : Srv[K] extends SummaryObject
              ? Doc
              : Srv[K] extends SummaryObject[]
                ? Doc[]
                : Srv[K];
      },
      "userService"
    >
  >;
};

export const ExtendedSettingService = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model extends DatabaseModel<T, Input, Doc, Obj, Insight, Filter, Summary>,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
  Srv,
  Signal = unknown,
>(
  database: Database<T, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary>,
  srvRef: Type<Srv>,
  sigRef?: Type<Signal>
) => {
  type SettingObject = BaseObject & { resignupDays: number };
  return srvRef as unknown as Type<
    DatabaseService<T, Input, Doc, Model, Insight, Filter, Summary> & { queue: QueueService<Signal> } & {
      [K in keyof Srv]: Srv[K] extends (...args: infer Args) => Promise<SettingObject>
        ? (...args: Args) => Promise<Doc>
        : Srv[K] extends (...args: infer Args) => Promise<SettingObject[]>
          ? (...args: Args) => Promise<Doc[]>
          : Srv[K] extends SettingObject
            ? Doc
            : Srv[K] extends SettingObject[]
              ? Doc[]
              : Srv[K];
    }
  >;
};

export const Try = () => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        const result = await originMethod.apply(this, args);
        return result;
      } catch (e) {
        this.logger?.warn(`${key} action error return: ${e}`);
      }
    };
  };
};

export const Cron = (cronTime: CronExpression | string, lock = true) => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    let isRunning = false;
    descriptor.value = async function (...args) {
      if (lock && isRunning) return this.logger?.warn(`Cronjob-${key} is already running, skipped`);
      try {
        isRunning = true;
        this.logger?.verbose(`Cron Job-${key} started`);
        const res = await originMethod.apply(this, args);
        this.logger?.verbose(`Cron Job-${key} finished`);
        isRunning = false;
        return res;
      } catch (e) {
        this.logger?.error(`Cron Job-${key} error return: ${e}`);
        isRunning = false;
      }
    };
    NestCron(cronTime)(target, key, descriptor);
  };
};

const getIntervalMetaMap = (prototype: object) => {
  return (
    (Reflect.getMetadata("serviceInterval", prototype) as Map<string, (...args) => any> | undefined) ??
    new Map<string, (...args) => any>()
  );
};
const setIntervalMetaMap = (prototype: object, intervalMetaMap: Map<string, (...args) => any>) => {
  Reflect.defineMetadata("serviceInterval", intervalMetaMap, prototype);
};
export const Interval = (ms: number, lock = true) => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const intervalMetaMap = getIntervalMetaMap(target);
    if (intervalMetaMap.has(key)) return descriptor;
    intervalMetaMap.set(key, descriptor.value);
    setIntervalMetaMap(target, intervalMetaMap);
    const originMethod = descriptor.value;
    let isRunning = false;
    descriptor.value = async function (...args) {
      if (lock && isRunning) return this.logger?.warn(`Cronjob-${key} is already running, skipped`);
      try {
        isRunning = true;
        this.logger?.verbose(`Interval Job-${key} started`);
        const res = await originMethod.apply(this, args);
        this.logger?.verbose(`Interval Job-${key} finished`);
        isRunning = false;
        return res;
      } catch (e) {
        this.logger?.error(`Cronjob-${key} error return: ${e}`);
        isRunning = false;
      }
    };
    NestInterval(ms)(target, key, descriptor);
  };
};

export const Transaction = () => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = function (...args) {
      if (!this.connection) throw new Error(`No Connection in function ${key}`);
      return new Promise((resolve, reject) => {
        (this.connection as Connection)
          .transaction(async () => {
            const res = await originMethod.apply(this, args);
            resolve(res);
          })
          .catch(reject);
      });
    };
    return descriptor;
  };
};

export const Cache = (timeout = 1000, getCacheKey?: (...args) => string): MethodDecorator => {
  return function (target: object, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    const cacheMap = new Map<string, any>();
    const timerMap = new Map<string, NodeJS.Timeout>();
    descriptor.value = async function (...args) {
      const classType = this.__model ? "doc" : this.__databaseModel ? "service" : "class";
      const model = this.__model ?? this.__databaseModel?.__model;
      const cache = this.__cache ?? this.__databaseModel?.__cache;
      const getCacheKeyFn = getCacheKey ?? JSON.stringify;
      const cacheKey = `${classType}:${model.modelName}:${key}:${getCacheKeyFn(...args)}`;
      const getCache = async (cacheKey: string) => {
        if (classType === "class") return cacheMap.get(cacheKey);
        const cached = (await cache.get(cacheKey)) as string | null;
        if (cached) return JSON.parse(cached);
        return null;
      };
      const setCache = async (cacheKey: string, value: any) => {
        if (classType === "class") {
          const existingTimer = timerMap.get(cacheKey);
          if (existingTimer) clearTimeout(existingTimer);
          cacheMap.set(cacheKey, value);
          const timer = setTimeout(() => {
            cacheMap.delete(cacheKey);
            timerMap.delete(cacheKey);
          }, timeout);
          timerMap.set(cacheKey, timer);
        } else await cache.set(cacheKey, JSON.stringify(value), { PX: timeout });
      };
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        this.logger?.trace(`${model.modelName} cache hit: ${cacheKey}`);
        return cachedData;
      }
      const result = await originMethod.apply(this, args);
      await setCache(cacheKey, result);
      this.logger?.trace(`${model.modelName} cache set: ${cacheKey}`);
      return result;
    };
  };
};
