import "reflect-metadata";
import { ConstantModel } from "./constant";
import { Dayjs } from "./types";
import { type Environment, baseEnv } from "./baseEnv";
import {
  ID,
  Int,
  JSON,
  ReturnType,
  type SingleFieldType,
  Type,
  getClassMeta,
  getNonArrayModel,
  scalarArgMap,
} from "./scalar";
import { applyMixins } from "../common/applyMixins";
import { capitalize } from "../common/capitalize";
import { lowerlize } from "../common/lowerlize";
import { makeDefault } from "./gql";
import type { Job as BullJob } from "bull";
import type { DocumentModel, FilterType, GetActionObject, QueryOf, SortOf } from "./types";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { SSOType } from "../nest";
import type { Socket } from "socket.io";

export class SignalStorage {}

export const getAllSignalRefs = () => {
  const signalNames = Reflect.getOwnMetadataKeys(SignalStorage.prototype) as string[] | undefined;
  const sigRefs =
    signalNames?.reduce<Type[]>((acc, signalName) => [...acc, ...getSignalRefsOnStorage(signalName)], []) ?? [];
  return sigRefs;
};
export const getSignalRefsOnStorage = (refName: string) => {
  const sigRefs = Reflect.getMetadata(refName, SignalStorage.prototype) as Type[] | undefined;
  return sigRefs ?? [];
};

const setSignalRefOnStorage = (refName: string, signalRef: Type) => {
  Reflect.defineMetadata(refName, [...getSignalRefsOnStorage(refName), signalRef], SignalStorage.prototype);
};

export type Resolve<T> = T;
export const resolve = <T>(data: any): Resolve<T> => data as Resolve<T>;
export const emit = <T>(data: any): Resolve<T> & { __Returns__: "Emit" } =>
  data as Resolve<T> & { __Returns__: "Emit" };
export const done = <T>(data: any): Resolve<T> & { __Returns__: "Done" } =>
  data as Resolve<T> & { __Returns__: "Done" };
export const subscribe = <T>(): Resolve<T> & { __Returns__: "Subscribe" } =>
  undefined as unknown as Resolve<T> & { __Returns__: "Subscribe" };
export interface SignalOption<Response = any> {
  nullable?: boolean;
  name?: string;
  default?: boolean;
  path?: string;
  onlyFor?: "graphql" | "restapi";
  sso?: SSOType;
  serverType?: "federation" | "batch" | "all";
  timeout?: number;
  partial?: (keyof Response)[] | readonly (keyof Response)[];
  cache?: number;
}

export interface ResolveFieldMeta {
  returns: ReturnType;
  argsOption: ArgsOption;
  key: string;
  descriptor: PropertyDescriptor;
}

export const signalTypes = ["graphql", "restapi"] as const;
export type SignalType = (typeof signalTypes)[number];

export const endpointTypes = ["Query", "Mutation", "Message", "Pubsub", "Process"] as const;
export type EndpointType = (typeof endpointTypes)[number];

export const guardTypes = ["Public", "None", "User", "Admin", "SuperAdmin", "Every", "Owner"] as const;
export type GuardType = (typeof guardTypes)[number];

export const roleTypes = ["Public", "User", "Admin", "SuperAdmin"] as const;
export type RoleType = (typeof roleTypes)[number];

export const argTypes = ["Body", "Param", "Query", "Upload", "Msg", "Room"] as const;
export type ArgType = (typeof argTypes)[number];

export const internalArgTypes = [
  "Account",
  "Me",
  "MyKeyring",
  "Self",
  "UserIp",
  "Access",
  "Signature",
  "Parent",
  "Req",
  "Res",
  "Ws",
  "Job",
] as const;
export type InternalArgType = (typeof internalArgTypes)[number];

export interface GqlMeta {
  returns: (of?: any) => Type;
  signalOption: SignalOption;
  key: string;
  descriptor: PropertyDescriptor;
  guards: GuardType[];
  type: EndpointType;
}
export interface ArgsOption {
  nullable?: boolean;
  example?: string | number | boolean | Dayjs;
  enum?: string[] | readonly string[];
}
export interface ArgMeta {
  name: string;
  returns: ReturnType;
  argsOption: ArgsOption;
  key: string;
  idx: number;
  type: ArgType;
}
export interface InternalArgMeta {
  key: string;
  idx: number;
  type: InternalArgType;
  option?: { nullable?: boolean };
}
export interface SliceMeta {
  refName: string;
  sliceName: string;
  argLength: number;
  defaultArgs: any[];
}

const getDefaultArg = (argRef: Type | Type[]) => {
  const [modelRef, arrDepth] = getNonArrayModel(argRef);
  if (arrDepth) return [];
  const scalarArg = scalarArgMap.get(modelRef) as object | undefined;
  if (scalarArg) return scalarArg;
  else return {};
};
export interface SignalMeta {
  refName: string;
  slices: SliceMeta[];
  returns?: (of?) => Type;
  prefix?: string;
}
interface SignalDecoratorInput {
  name: string;
  prefix?: string;
}
export function Signal(returnsOrObj: (() => Type) | SignalDecoratorInput) {
  const returns = typeof returnsOrObj === "function" ? returnsOrObj : undefined;
  const prefix = typeof returnsOrObj === "object" ? returnsOrObj.prefix : undefined;

  return function (target: Type) {
    if (returns) {
      const modelRef = returns();
      const classMeta = getClassMeta(modelRef);
      const gqlMetas = getGqlMetas(target);
      const modelName = lowerlize(classMeta.refName);
      const listName = `${modelName}ListIn`;
      const slices = [
        { refName: modelName, sliceName: modelName, argLength: 1, defaultArgs: [{}] },
        ...gqlMetas
          .filter((gqlMeta) => {
            const name = gqlMeta.signalOption.name ?? gqlMeta.key;
            if (!name.includes(listName)) return false;
            const [retRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
            return retRef.prototype === modelRef.prototype && arrDepth === 1;
          })
          .map((gqlMeta) => {
            const name = gqlMeta.signalOption.name ?? gqlMeta.key;
            const sliceName = name.replace(listName, `${modelName}In`);

            const [argMetas] = getArgMetas(target, gqlMeta.key);
            const skipIdx = argMetas.findIndex((argMeta) => argMeta.name === "skip");
            if (skipIdx === -1) throw new Error(`Invalid Args for ${sliceName}`);
            const argLength = skipIdx;
            const queryArgRefs = argMetas.slice(0, skipIdx).map((argMeta) => argMeta.returns());
            const defaultArgs = queryArgRefs.map((queryArgRef, idx) =>
              argMetas[idx].argsOption.nullable ? null : getDefaultArg(queryArgRef as Type)
            );
            return { refName: modelName, sliceName, argLength, defaultArgs };
          }),
      ];
      setSigMeta(target, { returns, prefix, slices, refName: modelName });
      setSignalRefOnStorage(modelName, target);
    } else {
      const refName = typeof returnsOrObj === "object" ? lowerlize(returnsOrObj.name) : undefined;
      if (!refName) throw new Error("Signal name is required");
      setSigMeta(target, { returns, prefix, slices: [], refName });
      setSignalRefOnStorage(refName, target);
    }
  };
}
const createArgMetaDecorator = (type: InternalArgType) => {
  return function (option: { nullable?: boolean } = {}) {
    return function (prototype: object, key: string, idx: number) {
      const argMetas = getArgMetasOnPrototype(prototype, key);
      argMetas[idx] = { key, idx, type, option };
      setArgMetasOnPrototype(prototype, key, argMetas);
    };
  };
};

export const Account = createArgMetaDecorator("Account");
export interface Account {
  __InternalArg__: "Account";
  self?: Self;
  myKeyring?: MyKeyring;
  me?: Me;
  signature?: Signature;
  appName: string;
  environment: Environment;
}
export const defaultAccount: Account = {
  __InternalArg__: "Account",
  appName: baseEnv.appName,
  environment: baseEnv.environment,
};

export type ProtoNetwork = "ethereum-mainnet" | "ethereum-sepolia" | "klaytn-cypress" | "klaytn-baobab";

export const MyKeyring = createArgMetaDecorator("MyKeyring");
export interface MyKeyring {
  __InternalArg__: "MyKeyring";
  id: string;
  accountId: string | null;
  chainWallets: {
    network: ProtoNetwork;
    address: string;
  }[];
  status: "active" | "prepare";
  removedAt: Dayjs | null;
}

export const Self = createArgMetaDecorator("Self");
export interface Self {
  __InternalArg__: "Self";
  id: string;
  nickname: string;
  roles: string[];
  requestRoles: string[];
  image: {
    url: string;
    imageSize: [number, number];
  } | null;
  status: "active" | "restricted" | "dormant";
  profileStatus: "active" | "prepare" | "applied" | "approved" | "featured" | "reserved" | "rejected";
  removedAt: Dayjs | null;
}

export const Me = createArgMetaDecorator("Me");
export interface Me {
  __InternalArg__: "Me";
  id: string;
  accountId: string;
  roles: string[];
  status: "active";
  removedAt: Dayjs | null;
}

export const UserIp = createArgMetaDecorator("UserIp");
export interface UserIp {
  ip: string;
  __InternalArg__: "UserIp";
}

export const Access = createArgMetaDecorator("Access");
export interface Access {
  __InternalArg__: "Access";
  period: number;
  countryCode?: string;
  countryName?: string;
  city?: string;
  postal?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  ipv4?: string;
  state?: string;
  userAgent?: string;
  at: Dayjs;
}

export const Signature = createArgMetaDecorator("Signature");
export interface Signature {
  __InternalArg__: "Signature";
  network: ProtoNetwork;
  provider: "ethereum" | "klaytn";
  address: string;
  expireAt: Dayjs;
}

export const Req = createArgMetaDecorator("Req");
export type Req = { __InternalArg__: "Req"; account: Account; user: any } & ExpressRequest;

export const Res = createArgMetaDecorator("Res");
export type Res = { __InternalArg__: "Res" } & ExpressResponse;

export const Ws = createArgMetaDecorator("Ws");
export type Ws = { __InternalArg__: "Ws" } & {
  socket: Socket;
  subscribe: boolean;
  onSubscribe: (handler: () => void | Promise<void>) => void;
  onUnsubscribe: (handler: () => void | Promise<void>) => void;
  onDisconnect: (handler: () => void | Promise<void>) => void;
};

export const Job = createArgMetaDecorator("Job");
export type Job = { __InternalArg__: "Job" } & BullJob;

type Guard = <Response extends SingleFieldType>(
  returns: ReturnType<Response>,
  signalOption?: SignalOption<UnType<Response>>,
  guards?: GuardType[]
) => MethodDecorator;

const getQuery = (allow: GuardType): Guard =>
  function (returns: ReturnType, signalOption: SignalOption = {}, guards: GuardType[] = []) {
    return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
      const metadataMap = getGqlMetaMapOnPrototype(prototype);
      metadataMap.set(key, {
        returns: returns as unknown as () => Type,
        signalOption,
        key,
        descriptor,
        guards: [allow, ...guards],
        type: "Query",
      });
      setGqlMetaMapOnPrototype(prototype, metadataMap);
    };
  };
const getMutation = (allow: GuardType): Guard =>
  function (returns: ReturnType, signalOption: SignalOption = {}, guards: GuardType[] = []) {
    return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
      const metadataMap = getGqlMetaMapOnPrototype(prototype);
      metadataMap.set(key, {
        returns: returns as unknown as () => Type,
        signalOption,
        key,
        descriptor,
        guards: [allow, ...guards],
        type: "Mutation",
      });
      setGqlMetaMapOnPrototype(prototype, metadataMap);
    };
  };
const getMessage = (allow: GuardType): Guard =>
  function (returns: ReturnType, signalOption: SignalOption = {}, guards: GuardType[] = []) {
    return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
      const metadataMap = getGqlMetaMapOnPrototype(prototype);
      metadataMap.set(key, {
        returns: returns as unknown as () => Type,
        signalOption,
        key,
        descriptor,
        guards: [allow, ...guards],
        type: "Message",
      });
      setGqlMetaMapOnPrototype(prototype, metadataMap);
    };
  };
const getPubsub = (allow: GuardType): Guard =>
  function (returns: ReturnType, signalOption: SignalOption = {}, guards: GuardType[] = []) {
    return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
      const metadataMap = getGqlMetaMapOnPrototype(prototype);
      metadataMap.set(key, {
        returns: returns as unknown as () => Type,
        signalOption,
        key,
        descriptor,
        guards: [allow, ...guards],
        type: "Pubsub",
      });
      setGqlMetaMapOnPrototype(prototype, metadataMap);
    };
  };
const getProcess = (serverType: "Federation" | "Batch" | "All"): Guard =>
  function (returns: ReturnType, signalOption: SignalOption = {}) {
    return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
      const metadataMap = getGqlMetaMapOnPrototype(prototype);
      metadataMap.set(key, {
        returns: returns as unknown as () => Type,
        signalOption: { ...signalOption, serverType: lowerlize(serverType) as "federation" | "batch" | "all" },
        key,
        descriptor,
        guards: ["None"],
        type: "Process",
      });
      setGqlMetaMapOnPrototype(prototype, metadataMap);
    };
  };
export const Query = {
  Public: getQuery("Public"),
  Every: getQuery("Every"),
  Admin: getQuery("Admin"),
  User: getQuery("User"),
  SuperAdmin: getQuery("SuperAdmin"),
  None: getQuery("None"),
  Owner: getQuery("Owner"),
};
export const Mutation = {
  Public: getMutation("Public"),
  Every: getMutation("Every"),
  Admin: getMutation("Admin"),
  User: getMutation("User"),
  SuperAdmin: getMutation("SuperAdmin"),
  None: getMutation("None"),
  Owner: getMutation("Owner"),
};
export const Message = {
  Public: getMessage("Public"),
  Every: getMessage("Every"),
  Admin: getMessage("Admin"),
  User: getMessage("User"),
  SuperAdmin: getMessage("SuperAdmin"),
  None: getMessage("None"),
  Owner: getMessage("Owner"),
};
export const Pubsub = {
  Public: getPubsub("Public"),
  Every: getPubsub("Every"),
  Admin: getPubsub("Admin"),
  User: getPubsub("User"),
  SuperAdmin: getPubsub("SuperAdmin"),
  None: getPubsub("None"),
  Owner: getPubsub("Owner"),
};
export const Process = {
  Federation: getProcess("Federation"),
  Batch: getProcess("Batch"),
  All: getProcess("All"),
};
export function ResolveField(returns: ReturnType, argsOption: ArgsOption = {}) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const metadataMap = getResolveFieldMetaMapOnPrototype(target as Type);
    metadataMap.set(key, { returns, argsOption, key, descriptor });
    Reflect.defineMetadata("resolveField", metadataMap, target as Type);
  };
}

const getArg = (type: ArgType) =>
  function (name: string, returns: ReturnType, argsOption: ArgsOption = {}) {
    return function (prototype: object, key: string, idx: number) {
      const argMetas = getArgMetasOnPrototype(prototype, key);
      argMetas[idx] = { name, returns, argsOption, key, idx, type };
      setArgMetasOnPrototype(prototype, key, argMetas);
    };
  };
export const Arg = {
  Body: getArg("Body"),
  Param: getArg("Param"),
  Query: getArg("Query"),
  Upload: getArg("Upload"),
  Msg: getArg("Msg"),
  Room: getArg("Room"),
};

export function Parent() {
  return function (prototype: object, key: string, idx: number) {
    const argMetas = getArgMetasOnPrototype(prototype, key);
    argMetas[idx] = { key, idx, type: "Parent" };
    setArgMetasOnPrototype(prototype, key, argMetas);
  };
}

export function LogSignal<Srv>(
  srv: Srv
): Type<{ [K in keyof Srv as K extends string ? Uncapitalize<K> : never]: Srv[K] }> {
  class BaseSignal {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return BaseSignal as any;
}

type UnType<Class> = Class extends Type<infer T> ? T : never;

export type DefaultSignal<
  T extends string,
  Input,
  Full,
  Light,
  Insight,
  Filter extends FilterType,
> = DefaultSignalWithQuerySort<T, Input, Full, Light, Insight, GetActionObject<Filter>, SortOf<Filter>>;
type DefaultSignalWithQuerySort<T extends string, Input, Full, Light, Insight, Query, Sort> = {
  [K in `${Uncapitalize<T>}`]: (id: string) => Promise<Full>;
} & {
  [K in `light${Capitalize<T>}`]: (id: string) => Promise<Light>;
} & {
  [K in `${Uncapitalize<T>}List`]: (
    ...args: [query: Query, skip: number | null, limit: number | null, sort: Sort | null]
  ) => Promise<Full[]>;
} & {
  [K in `${Uncapitalize<T>}Insight`]: (query: Query) => Promise<Insight>;
} & {
  [K in `${Uncapitalize<T>}Exists`]: (query: Query) => Promise<boolean>;
} & {
  [K in `create${Capitalize<T>}`]: (data: DocumentModel<Input>, account: Account) => Promise<Full>;
} & {
  [K in `update${Capitalize<T>}`]: (id: string, data: DocumentModel<Input>, account: Account) => Promise<Full>;
} & {
  [K in `remove${Capitalize<T>}`]: (id: string, account: Account) => Promise<Full>;
};
export function DbSignal<Cnst extends ConstantModel<any, any, any, any, any, any>, Srv>(
  constant: Cnst,
  srv: Srv,
  option: {
    guards: { get: Guard; cru: Guard };
    omit?: ("get" | "list" | "insight" | "exist" | "create" | "update" | "remove")[];
  }
) {
  type Full = UnType<Cnst["Full"]>;
  type Light = UnType<Cnst["Light"]>;
  type Input = DocumentModel<UnType<Cnst["Input"]>>;
  type Insight = UnType<Cnst["Insight"]>;
  type Doc = DocumentModel<Full>;
  type Query = QueryOf<Doc> & { $search?: string };
  const meta = getClassMeta(constant.Full as Type<Full>);
  const serviceName = `${lowerlize(meta.refName)}Service`;
  const [modelName, className] = [lowerlize(meta.refName), capitalize(meta.refName)];
  const names = {
    modelId: `${modelName}Id`,
    model: modelName,
    lightModel: `light${className}`,
    modelList: `${modelName}List`,
    modelInsight: `${modelName}Insight`,
    modelExists: `${modelName}Exists`,
    getModel: `get${className}`,
    createModel: `create${className}`,
    updateModel: `update${className}`,
    removeModel: `remove${className}`,
  };
  class BaseSignal {
    @option.guards.get(() => constant.Light as Type<Light>)
    async [names.lightModel](@Arg.Param(names.modelId, () => ID) id: string) {
      const service = this[serviceName] as object;
      const model = await (service[names.getModel] as (id) => Promise<Doc>)(id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Light>(model);
    }
    @option.guards.get(() => constant.Full as Type<Full>)
    async [names.model](@Arg.Param(names.modelId, () => ID) id: string) {
      const service = this[serviceName] as object;
      const model = await (service[names.getModel] as (id) => Promise<Doc>)(id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Full>(model);
    }
    @Query.Admin(() => [constant.Full] as [Type<Full>])
    async [names.modelList](
      @Arg.Query("query", () => JSON) query: Query | null,
      @Arg.Query("skip", () => Int, { nullable: true, example: 0 }) skip: number | null,
      @Arg.Query("limit", () => Int, { nullable: true, example: 20 }) limit: number | null,
      @Arg.Query("sort", () => String, { nullable: true, example: "latest" }) sort: string | null
    ) {
      const service = this[serviceName] as {
        __list: (...args) => Promise<Doc[]>;
        __searchDocs: (...args) => Promise<Doc[]>;
      };
      const models = query?.$search
        ? await service.__searchDocs(query.$search, { skip, limit, sort })
        : await service.__list(query, { skip, limit, sort });
      return resolve<Full[]>(models);
    }
    @Query.Admin(() => constant.Insight as Type<Insight>)
    async [names.modelInsight](@Arg.Query("query", () => JSON) query: Query) {
      const service = this[serviceName] as {
        __insight: (...args) => Promise<Insight>;
        __searchCount: (...args) => Promise<number>;
      };
      const insight = query.$search
        ? { ...makeDefault(constant.Insight as Type<Insight>), count: await service.__searchCount(query.$search) }
        : await service.__insight(query);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Insight>(insight);
    }
    @Query.Admin(() => Boolean)
    async [names.modelExists](@Arg.Query("query", () => JSON) query: Query) {
      const service = this[serviceName] as { __exists: (...args) => Promise<boolean> };
      const exists = await service.__exists(query);
      return resolve<boolean>(exists);
    }
    @option.guards.cru(() => constant.Full as Type<Full>)
    async [names.createModel](@Arg.Body(`data`, () => constant.Input as Type<Input>) data: Query) {
      const service = this[serviceName] as object;
      const model = await (service[names.createModel] as (data) => Promise<Doc>)(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Full>(model);
    }
    @option.guards.cru(() => constant.Full as Type<Full>)
    async [names.updateModel](
      @Arg.Param(names.modelId, () => ID) id: string,
      @Arg.Body("data", () => constant.Input as Type<Input>) data: Input
    ) {
      const service = this[serviceName] as object;
      const model = await (service[names.updateModel] as (...args) => Promise<Doc>)(id, data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Full>(model);
    }
    @option.guards.cru(() => constant.Full as Type<Full>, { partial: ["status", "removedAt"] })
    async [names.removeModel](@Arg.Param(names.modelId, () => ID) id: string) {
      const service = this[serviceName] as object;
      const model = await (service[names.removeModel] as (id) => Promise<Doc>)(id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resolve<Full>(model);
    }
  }
  return BaseSignal as unknown as Type<{ [K in keyof Srv as K extends string ? Uncapitalize<K> : never]: Srv[K] }>;
}

export const getSigMeta = (sigRef: Type): SignalMeta => {
  const sigMeta = Reflect.getMetadata("signal", sigRef.prototype as object) as SignalMeta | undefined;
  if (!sigMeta) throw new Error(`No SignalMeta found for ${sigRef.name}`);
  return sigMeta;
};
const setSigMeta = (sigRef: Type, sigMeta: SignalMeta) => {
  Reflect.defineMetadata("signal", sigMeta, sigRef.prototype as object);
};

export const getGqlMeta = (sigRef: Type, key: string): GqlMeta => {
  const gqlMetaMap = Reflect.getMetadata("gql", sigRef.prototype as object) as Map<string, GqlMeta> | undefined;
  if (!gqlMetaMap) throw new Error(`No GqlMeta found for ${sigRef.name}`);
  const gqlMeta = gqlMetaMap.get(key);
  if (!gqlMeta) throw new Error(`No GqlMeta found for ${key}`);
  return gqlMeta;
};
export const getGqlMetaMapOnPrototype = (prototype: object): Map<string, GqlMeta> => {
  const gqlMetaMap = Reflect.getMetadata("gql", prototype) as Map<string, GqlMeta> | undefined;
  return gqlMetaMap ?? new Map<string, GqlMeta>();
};
export const getGqlMetas = (sigRef: Type): GqlMeta[] => {
  const gqlMetaMap = Reflect.getMetadata("gql", sigRef.prototype as object) as Map<string, GqlMeta> | undefined;
  return gqlMetaMap ? [...gqlMetaMap.values()] : [];
};
export const setGqlMetaMapOnPrototype = (prototype: object, gqlMetaMap: Map<string, GqlMeta>) => {
  Reflect.defineMetadata("gql", gqlMetaMap, prototype);
};
export const getArgMetas = (sigRef: Type, key: string): [ArgMeta[], InternalArgMeta[]] => {
  const metas =
    (Reflect.getMetadata("args", sigRef.prototype as object, key) as (ArgMeta | InternalArgMeta)[] | undefined) ?? [];
  const argMetas = metas.filter((meta) => !!(meta as unknown as { returns?: any }).returns) as ArgMeta[];
  const internalArgMetas = metas.filter((meta) => !(meta as unknown as { returns?: any }).returns) as InternalArgMeta[];
  return [argMetas, internalArgMetas];
};
const getArgMetasOnPrototype = (prototype: object, key: string): (ArgMeta | InternalArgMeta)[] => {
  return (Reflect.getMetadata("args", prototype, key) as (ArgMeta | InternalArgMeta)[] | undefined) ?? [];
};
export const setArgMetas = (sigRef: Type, key: string, argMetas: ArgMeta[], internalArgMetas: InternalArgMeta[]) => {
  Reflect.defineMetadata("args", [...argMetas, ...internalArgMetas], sigRef.prototype as object, key);
};
const setArgMetasOnPrototype = (prototype: object, key: string, argMetas: (ArgMeta | InternalArgMeta)[]) => {
  Reflect.defineMetadata("args", argMetas, prototype, key);
};
const getResolveFieldMetaMapOnPrototype = (prototype: object): Map<string, ResolveFieldMeta> => {
  const resolveFieldMetaMap = Reflect.getMetadata("resolveField", prototype) as
    | Map<string, ResolveFieldMeta>
    | undefined;
  return resolveFieldMetaMap ?? new Map<string, ResolveFieldMeta>();
};
export const getResolveFieldMetas = (sigRef: Type): ResolveFieldMeta[] => {
  const resolveFieldMetaMap = Reflect.getMetadata("resolveField", sigRef.prototype as object) as
    | Map<string, ResolveFieldMeta>
    | undefined;
  return resolveFieldMetaMap ? [...resolveFieldMetaMap.values()] : [];
};
const setResolveFieldMetaMapOnPrototype = (prototype: object, resolveFieldMetaMap: Map<string, ResolveFieldMeta>) => {
  Reflect.defineMetadata("resolveField", resolveFieldMetaMap, prototype);
};

export const getControllerPrefix = (sigMeta: SignalMeta) => {
  return sigMeta.returns ? lowerlize(getClassMeta(sigMeta.returns()).refName) : sigMeta.prefix;
};

export const getControllerPath = (gqlMeta: GqlMeta, paramArgMetas: ArgMeta[]) => {
  return (
    gqlMeta.signalOption.path ??
    [gqlMeta.signalOption.name ?? gqlMeta.key, ...paramArgMetas.map((argMeta) => `:${argMeta.name}`)].join("/")
  );
};

export const copySignal = (sigRef: Type) => {
  class CopiedSignal {}
  applyMixins(CopiedSignal, [sigRef]);

  const sigMeta = getSigMeta(sigRef);
  setSigMeta(CopiedSignal, sigMeta);

  const gqlMetaMap = getGqlMetaMapOnPrototype(sigRef.prototype as object);
  setGqlMetaMapOnPrototype(CopiedSignal.prototype, new Map(gqlMetaMap));

  const resolveFieldMetaMap = getResolveFieldMetaMapOnPrototype(sigRef.prototype as object);
  setResolveFieldMetaMapOnPrototype(CopiedSignal.prototype, new Map(resolveFieldMetaMap));

  for (const endpointMeta of [...gqlMetaMap.values(), ...resolveFieldMetaMap.values()]) {
    const argMetas = getArgMetasOnPrototype(sigRef.prototype as object, endpointMeta.key);
    setArgMetasOnPrototype(CopiedSignal.prototype, endpointMeta.key, [...argMetas]);

    const paramtypes = Reflect.getMetadata(
      "design:paramtypes",
      sigRef.prototype as object,
      endpointMeta.key
    ) as object[];
    Reflect.defineMetadata("design:paramtypes", [...paramtypes], CopiedSignal.prototype, endpointMeta.key);
  }

  return CopiedSignal;
};
