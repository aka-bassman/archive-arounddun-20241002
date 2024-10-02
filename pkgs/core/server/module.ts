import { BullModule, getQueueToken } from "@nestjs/bull";
import { type ConstantModel, type Type, getGqlMetas, getSigMeta } from "@core/base";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { addSchema, schemaOf } from "./schema";
import { capitalize, lowerlize } from "@core/common";
import { controllerOf } from "./controller";
import { databaseModelOf } from "./database";
import { processorOf } from "./processor";
import { resolverOf } from "./resolver";
import { serviceOf } from "./serviceDecorators";
import { websocketOf, websocketServerOf } from "./websocket";
import type { Database, Mdl } from "./dbDecorators";
import type { default as MeiliSearch } from "meilisearch";
import type { Queue } from "bull";
import type { RedisClientType } from "redis";

const hasWebsocket = (signal: Type) =>
  getGqlMetas(signal).some((gqlMeta) => ["Message", "Pubsub"].includes(gqlMeta.type));
const hasProcessor = (signal: Type) => getGqlMetas(signal).some((gqlMeta) => gqlMeta.type === "Process");
const filterSrvs = (srvs: { [key: string]: Type | undefined }): { [key: string]: Type } =>
  Object.fromEntries(Object.entries(srvs).filter(([_, srv]) => !!srv)) as unknown as { [key: string]: Type };

interface DatabaseModuleCreateOptions {
  constant: ConstantModel<string, any, any, any, any, any>;
  database: Database<string, any, any, any, any, any, any, any, any>;
  signal: Type;
  service: Type;
  uses?: { [key: string]: any };
  useAsyncs?: { [key: string]: () => Promise<any> };
  providers?: Type[];
  extended?: boolean;
}
export const databaseModuleOf = (
  {
    constant,
    database,
    signal,
    service,
    uses = {},
    useAsyncs = {},
    providers = [],
    extended,
  }: DatabaseModuleCreateOptions,
  allSrvs: { [key: string]: Type | undefined }
): DynamicModule => {
  const [modelName, className] = [lowerlize(constant.refName), capitalize(constant.refName)];
  const mongoToken = getModelToken(className);
  @Global()
  @Module({
    imports: [
      MongooseModule.forFeature([
        {
          name: className,
          schema: extended
            ? addSchema(database.Model, database.Doc, database.Input, database.Middleware)
            : schemaOf(database.Model, database.Doc, database.Middleware),
        },
      ]),
      ...(hasProcessor(signal)
        ? [
            BullModule.registerQueue({
              name: modelName,
              defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
            }),
          ]
        : []),
    ],
    providers: [
      serviceOf(service),
      resolverOf(signal, filterSrvs(allSrvs)),
      ...(hasProcessor(signal)
        ? [
            processorOf(signal, filterSrvs(allSrvs)),
            { provide: `${className}Queue`, useFactory: (queue: Queue) => queue, inject: [getQueueToken(modelName)] },
          ]
        : []),
      ...(hasWebsocket(signal)
        ? [websocketOf(signal, filterSrvs(allSrvs)), { provide: "Websocket", useClass: websocketServerOf(signal) }]
        : []),
      ...Object.entries(uses).map(([key, useValue]) => ({ provide: capitalize(key), useValue: useValue as object })),
      ...Object.entries(useAsyncs).map(([key, useFactory]) => ({ provide: capitalize(key), useFactory })),
      {
        provide: `${modelName}Model`,
        useFactory: (model: Mdl<any, any>, redis: RedisClientType, meili: MeiliSearch) => {
          return databaseModelOf(database, model, redis, meili);
        },
        inject: [mongoToken, "REDIS_CLIENT", "MEILI_CLIENT"],
      },
      ...providers,
    ],
    controllers: [controllerOf(signal, filterSrvs(allSrvs))],
    exports: [service],
  })
  class DatabaseModule {}
  return DatabaseModule as unknown as DynamicModule;
};

interface ServiceModuleCreateOptions {
  signal: Type;
  service: Type;
  uses?: { [key: string]: any };
  useAsyncs?: { [key: string]: () => Promise<any> };
  providers?: Type[];
}
export const serviceModuleOf = (
  { signal, service, uses = {}, useAsyncs = {}, providers = [] }: ServiceModuleCreateOptions,
  allSrvs: { [key: string]: Type | undefined }
): DynamicModule => {
  const sigMeta = getSigMeta(signal);
  const [modelName, className] = [lowerlize(sigMeta.refName), capitalize(sigMeta.refName)];
  @Global()
  @Module({
    imports: [
      ...(hasProcessor(signal)
        ? [
            BullModule.registerQueue({
              name: modelName,
              defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
            }),
          ]
        : []),
    ],
    providers: [
      serviceOf(service),
      resolverOf(signal, filterSrvs(allSrvs)),
      ...(hasWebsocket(signal)
        ? [websocketOf(signal, filterSrvs(allSrvs)), { provide: "Websocket", useClass: websocketServerOf(signal) }]
        : []),
      ...(hasProcessor(signal)
        ? [
            processorOf(signal, filterSrvs(allSrvs)),
            { provide: `${className}Queue`, useFactory: (queue: Queue) => queue, inject: [getQueueToken(modelName)] },
          ]
        : []),
      ...Object.entries(uses).map(([key, useValue]) => ({ provide: capitalize(key), useValue: useValue as object })),
      ...Object.entries(useAsyncs).map(([key, useFactory]) => ({ provide: capitalize(key), useFactory })),
      ...providers,
    ],
    controllers: [controllerOf(signal, filterSrvs(allSrvs))],
    exports: [service],
  })
  class ServiceModule {}
  return ServiceModule as unknown as DynamicModule;
};

interface ScalarModuleCreateOptions {
  signals: Type[];
  uses?: { [key: string]: any };
  useAsyncs?: { [key: string]: () => Promise<any> };
  providers?: Type[];
}
export const scalarModuleOf = (
  { signals, uses = {}, useAsyncs = {}, providers = [] }: ScalarModuleCreateOptions,
  allSrvs: { [key: string]: Type | undefined }
): DynamicModule => {
  @Global()
  @Module({
    imports: [],
    providers: [
      ...signals.map((signal) => resolverOf(signal, filterSrvs(allSrvs))),
      ...signals
        .filter(hasWebsocket)
        .map((signal) => [
          websocketOf(signal, filterSrvs(allSrvs)),
          { provide: "Websocket", useClass: websocketServerOf(signal) },
        ])
        .flat(),
      ...Object.entries(uses).map(([key, useValue]) => ({ provide: capitalize(key), useValue: useValue as object })),
      ...Object.entries(useAsyncs).map(([key, useFactory]) => ({ provide: capitalize(key), useFactory })),
      ...providers,
    ],
    controllers: signals.map((signal) => controllerOf(signal, filterSrvs(allSrvs))),
  })
  class ScalarModule {}
  return ScalarModule as unknown as DynamicModule;
};

interface BatchModuleCreateOptions {
  service: Type;
  uses?: { [key: string]: any };
  useAsyncs?: { [key: string]: () => Promise<any> };
  providers?: Type[];
}
export const batchModuleOf = ({
  service,
  uses = {},
  useAsyncs = {},
  providers = [],
}: BatchModuleCreateOptions): DynamicModule => {
  @Global()
  @Module({
    imports: [],
    providers: [
      serviceOf(service),
      ...Object.entries(uses).map(([key, useValue]) => ({ provide: capitalize(key), useValue: useValue as object })),
      ...Object.entries(useAsyncs).map(([key, useFactory]) => ({ provide: capitalize(key), useFactory })),
      ...providers,
    ],
    exports: [service],
  })
  class BatchModule {}
  return BatchModule as unknown as DynamicModule;
};

interface UseGlobalsCreateOptions {
  uses?: { [key: string]: any };
  useAsyncs?: { [key: string]: () => Promise<any> };
  injects?: { [key: string]: Type };
}
export const useGlobals = ({ uses, useAsyncs, injects }: UseGlobalsCreateOptions): DynamicModule => {
  @Global()
  @Module({
    imports: [],
    providers: [
      ...Object.entries(uses ?? {}).map(([key, useValue]) => ({
        provide: capitalize(key),
        useValue: useValue as object,
      })),
      ...Object.entries(useAsyncs ?? {}).map(([key, useFactory]) => ({ provide: capitalize(key), useFactory })),
      ...Object.entries(injects ?? {}).map(([key, inject]) => ({ provide: capitalize(key), useClass: inject })),
    ],
    exports: [
      ...Object.keys(uses ?? {}).map((key) => capitalize(key)),
      ...Object.keys(useAsyncs ?? {}).map((key) => capitalize(key)),
      ...Object.keys(injects ?? {}).map((key) => capitalize(key)),
    ],
  })
  class GlobalsModule {}
  return GlobalsModule as unknown as DynamicModule;
};
