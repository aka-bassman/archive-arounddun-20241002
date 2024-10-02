import { AnyVariables } from "@urql/core";
import {
  type ArgMeta,
  type DefaultSignal,
  type GqlMeta,
  type SliceMeta,
  getArgMetas,
  getGqlMetas,
  getSigMeta,
} from "./signalDecorators";
import { type Client, client } from "../common/client";
import {
  type ConstantFieldMeta,
  Float,
  JSON as GqlJSON,
  GqlScalar,
  ID,
  Int,
  Type,
  Upload,
  applyFnToArrayObjects,
  getClassMeta,
  getFieldMetaMap,
  getFieldMetas,
  getGqlTypeStr,
  getNonArrayModel,
  isGqlScalar,
  scalarDefaultMap,
} from "./scalar";
import { Dayjs, dayjs } from "./types";
import { Logger } from "../common/Logger";
import { capitalize } from "../common/capitalize";
import { getChildClassRefs, getLightModelRef } from "./classMeta";
import { immerable } from "immer";
import { lowerlize } from "../common/lowerlize";
import type { ConstantModel } from "./constant";
import type { DocumentModel, FilterType, ProtoFile, QueryOf, SortOf } from "./types";
import type { FetchPolicy } from "../common/types";

function graphql(literals: string | readonly string[], ...args: any[]) {
  if (typeof literals === "string") literals = [literals];
  let result = literals[0];
  args.forEach((arg: { [key: string]: any } | undefined, i: number) => {
    if (arg && arg.kind === "Document") result += (arg as { loc: { source: { body: string } } }).loc.source.body;
    else result += arg as unknown as string;
    result += literals[i + 1];
  });
  return result;
}

export class GqlStorage {}
export class FragmentStorage {}
export class PurifyStorage {}
export class DefaultStorage {}
export class CrystalizeStorage {}

export type PurifyFunc<I, M> = (
  self: DefaultOf<Pick<M, keyof I extends keyof M ? keyof I : never>>,
  isChild?: boolean
) => DocumentModel<I> | null;
export type CrystalizeFunc<M> = (
  self: {
    [K in keyof M as M[K] extends (...args: any) => any ? never : K]: M[K];
  },
  isChild?: boolean
) => M;

export type FieldState<T> = T extends string
  ? T
  : T extends number
    ? T
    : T extends boolean
      ? T
      : T extends Dayjs
        ? T
        : T extends any[]
          ? T
          : T extends { id: string }
            ? T | null
            : T;
export type DefaultOf<S> = S extends infer T ? { [K in keyof T]: FieldState<T[K]> } : never;

export interface FetchInitForm<Input, Full, Filter extends FilterType> {
  page?: number;
  limit?: number;
  sort?: SortOf<Filter> | symbol;
  default?: Partial<DefaultOf<Input>>;
  invalidate?: boolean;
  insight?: boolean;
}

export type ServerInit<
  T extends string,
  Light,
  Insight = any,
  QueryArgs = any[],
  Filter extends FilterType = any,
> = SliceMeta & {
  [K in `${Uncapitalize<T>}ObjList`]: Light[];
} & {
  [K in `${Uncapitalize<T>}ObjInsight`]: Insight;
} & {
  [K in `pageOf${Capitalize<T>}`]: number;
} & {
  [K in `lastPageOf${Capitalize<T>}`]: number;
} & {
  [K in `limitOf${Capitalize<T>}`]: number;
} & {
  [K in `queryArgsOf${Capitalize<T>}`]: QueryArgs;
} & {
  [K in `sortOf${Capitalize<T>}`]: SortOf<Filter>;
} & {
  [K in `${Uncapitalize<T>}InitAt`]: Date;
};
export type ClientInit<T extends string, Light, Insight = any, QueryArgs = any[], Filter extends FilterType = any> =
  | Promise<ServerInit<T, Light, Insight, QueryArgs, Filter>>
  | ServerInit<T, Light, Insight, QueryArgs, Filter>;

export type ServerView<T extends string, M> = { refName: T } & {
  [K in `${Uncapitalize<T>}Obj`]: M;
} & {
  [K in `${Uncapitalize<T>}ViewAt`]: Date;
};
export type ClientView<T extends string, M> = Promise<ServerView<T, M>> | ServerView<T, M>;

export type ServerEdit<T extends string, M> = { refName: T } & {
  [K in `${Uncapitalize<T>}Obj`]: M;
} & {
  [K in `${Uncapitalize<T>}ViewAt`]: Date;
};
export type ClientEdit<T extends string, M> = Promise<ServerEdit<T, M>> | ServerEdit<T, M>;

export type GqlScalarUtil<T extends string, M, I = M> = {
  [K in `default${Capitalize<T>}`]: DefaultOf<M>;
} & {
  [K in `purify${Capitalize<T>}`]: PurifyFunc<DocumentModel<I>, M>;
} & {
  [K in `crystalize${Capitalize<T>}`]: CrystalizeFunc<M>;
};

type FilterSkipLimitSort<Args, Filter> = Args extends [
  ...args: infer QueryArgs,
  skip: number | null,
  limit: number | null,
  sort: string | null, // TODO: SortOf<Filter>
]
  ? QueryArgs
  : never;
export type FilterListArgs<Args, Filter> = FilterOutInternalArgs<
  FilterSkipLimitSort<FilterOutInternalArgs<Args>, Filter>
>;
export type FilterStateArgs<Args, Filter> = FilterSkipLimitSort<FilterOutInternalArgs<Args>, Filter>;
export type DbGraphQL<T extends string, Input, Full, Light, Insight, Filter extends FilterType, Fetch, Signal> = {
  refName: string;
  slices: SliceMeta[];
} & GetWsMessageOf<Signal> &
  GetWsPubsubOf<Signal> &
  GqlScalarUtil<T, Full> & {
    [K in `lightCrystalize${Capitalize<T>}`]: CrystalizeFunc<Light>;
  } & {
    [K in `default${Capitalize<T>}Insight`]: Insight;
  } & {
    [K in `add${Capitalize<T>}Files`]: (
      fileList: FileList,
      parentId?: string,
      option?: FetchPolicy
    ) => Promise<ProtoFile[]>;
  } & {
    [K in `merge${Capitalize<T>}`]: (
      modelOrId: Full | string,
      data: Partial<DocumentModel<Input>>,
      option?: FetchPolicy
    ) => Promise<Full>;
  } & {
    [K in `view${Capitalize<T>}`]: (
      id: string,
      option?: FetchPolicy
    ) => Promise<{ [K in Uncapitalize<T>]: Full } & { [K in `${Uncapitalize<T>}View`]: ServerView<T, Full> }>;
  } & {
    [K in `get${Capitalize<T>}View`]: (id: string, option?: FetchPolicy) => ClientView<T, Full>;
  } & {
    [K in `edit${Capitalize<T>}`]: (
      id: string,
      option?: FetchPolicy
    ) => Promise<{ [K in Uncapitalize<T>]: Full } & { [K in `${Uncapitalize<T>}Edit`]: ServerEdit<T, Full> }>;
  } & {
    [K in `get${Capitalize<T>}Edit`]: (id: string, option?: FetchPolicy) => ClientEdit<T, Full>;
  } & Fetch & {
    [K in `init${Capitalize<T>}`]: (
      query?: QueryOf<DocumentModel<Full>>,
      option?: FetchPolicy & FetchInitForm<Input, Full, Filter>
    ) => Promise<
      {
        [K in `${Uncapitalize<T>}Init`]: ServerInit<T, Light, Insight, [query?: QueryOf<DocumentModel<Full>>], Filter>;
      } & {
        [K in `${Uncapitalize<T>}List`]: Light[];
      } & {
        [K in `${Uncapitalize<T>}Insight`]: Insight;
      }
    >;
  } & {
    [K in `get${Capitalize<T>}Init`]: (
      query?: QueryOf<DocumentModel<Full>>,
      option?: FetchPolicy & FetchInitForm<Input, Full, Filter>
    ) => ClientInit<T, Light, Insight, [query?: QueryOf<DocumentModel<Full>>], Filter>;
  } & {
    [K in keyof Signal as K extends `${T}List${infer Suffix}`
      ? `init${Capitalize<T>}${Suffix}`
      : never]: K extends `${T}List${infer Suffix}`
      ? Signal[K] extends (...args: infer Args) => Promise<Full[]>
        ? (
            ...args: [
              ...queryArgs: FilterListArgs<Args, Filter>,
              option?: FetchPolicy & FetchInitForm<Input, Full, Filter>,
            ]
          ) => Promise<
            {
              [K in `${Uncapitalize<T>}Init${Suffix}`]: ServerInit<
                T,
                Light,
                Insight,
                FilterListArgs<Args, Filter>,
                Filter
              >;
            } & {
              [K in `${Uncapitalize<T>}List${Suffix}`]: Light[];
            } & {
              [K in `${Uncapitalize<T>}Insight${Suffix}`]: Insight;
            }
          >
        : never
      : never;
  } & {
    [K in keyof Signal as K extends `${T}List${infer Suffix}`
      ? `get${Capitalize<T>}Init${Suffix}`
      : never]: K extends `${T}List${infer Suffix}`
      ? Signal[K] extends (...args: infer Args) => Promise<Full[]>
        ? (
            ...args: [
              ...queryArgs: FilterListArgs<Args, Filter>,
              option?: FetchPolicy & FetchInitForm<Input, Full, Filter>,
            ]
          ) => ClientInit<T, Light, Insight, FilterListArgs<Args, Filter>, Filter>
        : never
      : never;
  };

type ConvertArg<T> =
  // T extends Dayjs ? Date :
  T extends Upload[] ? FileList : T;
type IsInternalArgs<T> = T extends { __InternalArg__: any }
  ? true
  : T extends { __InternalArg__: any } | null
    ? true
    : false;
export type FilterOutInternalArgs<T> = T extends [arg: infer Head, ...args: infer Rest]
  ? IsInternalArgs<Head> extends true
    ? FilterOutInternalArgs<Rest>
    : Head extends undefined
      ? [arg?: ConvertArg<Head> | undefined, ...args: FilterOutInternalArgs<Rest>]
      : Head extends null
        ? [arg?: ConvertArg<Head> | undefined, ...args: FilterOutInternalArgs<Rest>]
        : // : Head extends any[]
          // ? [arg?: ConvertArg<Head> | undefined, ...args: FilterOutInternalArgs<Rest>]
          [arg: ConvertArg<Head>, ...args: FilterOutInternalArgs<Rest>]
  : [];
type FunctionToTuple<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never;
type TupleToFunction<T extends any[], R> = (...args: [...args: T, option?: FetchPolicy]) => R;
export type RemoveInternalArgs<F extends (...args: any) => any, Returns = ReturnType<F>> = TupleToFunction<
  FilterOutInternalArgs<FunctionToTuple<F>>,
  Returns
>;
type ApplyPromise<T> = T extends (...args: infer Args) => infer Return
  ? Return extends Promise<any>
    ? T
    : (...args: Args) => Promise<Return>
  : never;

export type GetQueryMutationOf<Sig, M = unknown> = {
  [K in keyof Sig as K extends keyof M
    ? never
    : Sig[K] extends (...args: any) => Promise<{ __Returns__: string }>
      ? never
      : K]: Sig[K] extends (...args: any) => any ? ApplyPromise<RemoveInternalArgs<Sig[K]>> : never;
};
export type GetWsMessageOf<Sig> = {
  [K in keyof Sig as Sig[K] extends (...args: any) => Promise<{ __Returns__: "Emit" }>
    ? K
    : Sig[K] extends (...args: any) => { __Returns__: "Emit" }
      ? K
      : never]: Sig[K] extends (...args: any) => any ? ApplyPromise<RemoveInternalArgs<Sig[K], void>> : never;
} & {
  [K in keyof Sig as K extends string
    ? Sig[K] extends (...args: any) => Promise<{ __Returns__: "Emit" }> | { __Returns__: "Emit" }
      ? `listen${Capitalize<K>}`
      : never
    : never]: Sig[K] extends (...args: any) => any
    ? (handleEvent: (data: ReturnType<Sig[K]> extends Promise<infer R> ? R : never) => any) => () => void
    : never;
};
export type GetWsPubsubOf<Sig> = {
  [K in keyof Sig as K extends string
    ? Sig[K] extends (...args: any) => Promise<{ __Returns__: "Subscribe" }>
      ? `subscribe${Capitalize<K>}`
      : Sig[K] extends (...args: any) => { __Returns__: "Subscribe" }
        ? `subscribe${Capitalize<K>}`
        : never
    : never]: Sig[K] extends (...args: infer Args) => Promise<{ __Returns__: "Subscribe" } & infer Return>
    ? (...args: [...args: FilterOutInternalArgs<Args>, onData: (data: Return) => void]) => () => void
    : Sig[K] extends (...args: infer Args) => { __Returns__: "Subscribe" } & infer Return
      ? (...args: [...args: FilterOutInternalArgs<Args>, onData: (data: Return) => void]) => () => void
      : never;
};

export const scalarUtilOf = <T extends string, M>(name: T, target: Type<M>): GqlScalarUtil<T, M> => {
  const refName = getClassMeta(target).refName;
  const [fieldName, className] = [lowerlize(refName), capitalize(refName)];
  const graphQL = {
    refName,
    [className]: target,
    [`default${className}`]: Object.assign(new target() as object, { [immerable]: true }, makeDefault<M>(target)),
    [`purify${className}`]: makePurify<M>(target),
    [`crystalize${className}`]: makeCrystalize<M>(target),
    [`${fieldName}Fragment`]: makeFragment(target),
  };
  return graphQL as unknown as GqlScalarUtil<T, M>;
};

type LightWeightFetch<Fetch, Full, Light> = {
  [K in keyof Fetch]: Fetch[K] extends (...args: infer Args) => Promise<Full[]>
    ? (...args: Args) => Promise<Light[]>
    : Fetch[K];
};

export const getGqlOnStorage = (refName: string) => {
  const modelGql = Reflect.getMetadata(refName, GqlStorage.prototype) as { [key: string]: any } | undefined;
  if (!modelGql) throw new Error("Gql is not defined");
  return modelGql;
};
const setGqlOnStorage = (refName: string, modelGql: any) => {
  Reflect.defineMetadata(refName, modelGql, GqlStorage.prototype);
};

export const gqlOf = <
  T extends string,
  Input,
  Full extends { id: string },
  Light,
  Insight,
  Summary,
  Filter extends FilterType,
  Signal,
>(
  constant: ConstantModel<T, Input, Full, Light, Insight, Filter, Summary>,
  sigRef: Type<Signal>,
  option: { overwrite?: { [key: string]: any } } = {}
): DbGraphQL<
  T,
  Input,
  Full,
  Light,
  Insight,
  Filter,
  LightWeightFetch<
    GetQueryMutationOf<Signal & DefaultSignal<T, Input, Full, Light, Insight, Filter>, Full>,
    Full,
    Light
  >,
  Signal
> => {
  const refName = constant.refName;
  const [fieldName, className] = [lowerlize(refName), capitalize(refName)];
  const sigMeta = getSigMeta(sigRef);
  const names = {
    refName,
    model: fieldName,
    Model: className,
    _model: `_${fieldName}`,
    lightModel: `light${className}`,
    _lightModel: `_light${className}`,
    purifyModel: `purify${className}`,
    crystalizeModel: `crystalize${className}`,
    lightCrystalizeModel: `lightCrystalize${className}`,
    crystalizeModelInsight: `crystalize${className}Insight`,
    defaultModel: `default${className}`,
    defaultModelInsight: `default${className}Insight`,
    mergeModel: `merge${className}`,
    viewModel: `view${className}`,
    getModelView: `get${className}View`,
    modelView: `${fieldName}View`,
    modelViewAt: `${fieldName}ViewAt`,
    editModel: `edit${className}`,
    getModelEdit: `get${className}Edit`,
    modelEdit: `${fieldName}Edit`,
    listModel: `list${className}`,
    modelList: `${fieldName}List`,
    modelObjList: `${fieldName}ObjList`,
    modelInsight: `${fieldName}Insight`,
    modelObjInsight: `${fieldName}ObjInsight`,
    updateModel: `update${className}`,
    modelObj: `${fieldName}Obj`,
    _modelList: `_${fieldName}List`,
    modelInit: `${fieldName}Init`,
    pageOfModel: `pageOf${className}`,
    lastPageOfModel: `lastPageOf${className}`,
    limitOfModel: `limitOf${className}`,
    queryArgsOfModel: `queryArgsOf${className}`,
    sortOfModel: `sortOf${className}`,
    modelInitAt: `${fieldName}InitAt`,
    initModel: `init${className}`,
    getModelInit: `get${className}Init`,
    addModelFiles: `add${className}Files`,
  };
  const base = {
    refName,
    [names.purifyModel]: makePurify<Input>(constant.Input, option),
    [names.crystalizeModel]: makeCrystalize<Full>(constant.Full, option),
    [names.lightCrystalizeModel]: makeCrystalize<Light>(constant.Light, option),
    [names.crystalizeModelInsight]: makeCrystalize<Insight>(constant.Insight, option),
    [names.defaultModel]: Object.assign(
      new constant.Full() as object,
      { [immerable]: true },
      makeDefault<Full>(constant.Full, option)
    ),
    [names.defaultModelInsight]: Object.assign(
      new constant.Insight() as object,
      makeDefault<Insight>(constant.Insight, option)
    ),
  };
  const gql = Object.assign(option.overwrite ?? { client }, fetchOf(sigRef));
  const util = {
    [names.addModelFiles]: async (files: FileList, id?: string, option?: FetchPolicy) => {
      const fileGql = getGqlOnStorage("file");
      const metas = Array.from(files).map((file) => ({ lastModifiedAt: new Date(file.lastModified), size: file.size }));
      return await (fileGql.addFiles as (...args: any[]) => Promise<ProtoFile[]>)(
        files,
        metas,
        names.model,
        id,
        option
      );
    },
    [names.mergeModel]: async (modelOrId: Full | string, data: Partial<Input>, option?: FetchPolicy) => {
      const model =
        typeof modelOrId === "string" ||
        (modelOrId as unknown as { id: string; __ModelType__: string }).__ModelType__ !== "full"
          ? (base[names.crystalizeModel] as (m: any) => Full)(modelOrId)
          : modelOrId;
      const input = (base[names.purifyModel] as (m: any) => Input)({ ...model, ...data });
      if (!input) throw new Error("Error");
      return await (gql[names.updateModel] as (...args: any[]) => Promise<Full>)(model.id, input, option);
    },
    [names.viewModel]: async (id: string, option?: FetchPolicy) => {
      const modelObj = await (gql[names._model] as (...args: any[]) => Promise<Full>)(id, option);
      return {
        [names.model]: (base[names.crystalizeModel] as (...args: any[]) => Full)(modelObj),
        [names.modelView]: {
          refName: names.model,
          [names.modelObj]: modelObj,
          [names.modelViewAt]: new Date(),
        },
      };
    },
    [names.getModelView]: async (id: string, option?: FetchPolicy) => {
      const modelView = await (gql[names._model] as (...args: any[]) => Promise<Full>)(id, option);
      return {
        refName: names.model,
        [names.modelObj]: modelView,
        [names.modelViewAt]: new Date(),
      };
    },

    [names.editModel]: async (id: string, option?: FetchPolicy) => {
      const modelObj = await (gql[names._model] as (...args: any[]) => Promise<Full>)(id, option);
      return {
        [names.model]: (base[names.crystalizeModel] as (...args: any[]) => Full)(modelObj),
        [names.modelEdit]: {
          refName: names.model,
          [names.modelObj]: modelObj,
          [names.modelViewAt]: new Date(),
        },
      };
    },
    [names.getModelEdit]: async (id: string, option?: FetchPolicy) => {
      const modelEdit = await (
        gql[names.editModel] as (
          ...args: any[]
        ) => Promise<{ [K in Uncapitalize<T>]: Full } & { [K in `${Uncapitalize<T>}Edit`]: ServerEdit<T, Full> }>
      )(id, option);
      return modelEdit[names.modelEdit] as object;
    },
  };
  const sliceUtil = Object.fromEntries(
    sigMeta.slices.reduce((acc, { sliceName, argLength, defaultArgs }) => {
      const namesOfSlice = {
        modelList: sliceName.replace(names.model, names.modelList), // modelListInSelf
        modelInsight: sliceName.replace(names.model, names.modelInsight), // modelInsightInSelf
        modelInit: sliceName.replace(names.model, names.modelInit), // modelInitInSelf
        initModel: sliceName.replace(names.model, names.initModel), // initModelInSelf
        getModelInit: sliceName.replace(names.model, names.getModelInit), // getModelInitInSelf
      };
      const getInitFn = async (...args: any[]) => {
        const queryArgLength = Math.min(args.length, argLength);
        const queryArgs = [
          ...new Array(queryArgLength).fill(null).map((_, i) => args[i] as object),
          ...(queryArgLength < argLength
            ? new Array(argLength - queryArgLength)
                .fill(null)
                .map((_, i) => (defaultArgs[i + queryArgLength] ?? null) as object)
            : []),
        ];
        const fetchInitOption = (args[argLength] ?? {}) as FetchInitForm<Input, Full, Filter> & FetchPolicy;
        const { page = 1, limit = 20, sort = "latest", insight } = fetchInitOption;
        const skip = (page - 1) * limit;
        const [modelObjList, modelObjInsight] = await Promise.all([
          (gql[`_${namesOfSlice.modelList}`] as (...args: any[]) => Promise<Light[]>)(
            ...queryArgs,
            skip,
            limit,
            sort,
            fetchInitOption
          ),
          (gql[`_${namesOfSlice.modelInsight}`] as (...args: any[]) => Promise<Insight>)(...queryArgs, fetchInitOption),
        ]);
        const count = (modelObjInsight as { count: number }).count;
        return {
          // Client Component용
          refName: names.model,
          sliceName,
          argLength,
          [names.modelObjList]: modelObjList,
          [names.modelObjInsight]: modelObjInsight,
          [names.pageOfModel]: page,
          [names.lastPageOfModel]: Math.max(Math.floor((count - 1) / limit) + 1, 1),
          [names.limitOfModel]: limit,
          [names.queryArgsOfModel]: JSON.parse(JSON.stringify(queryArgs)) as object,
          [names.sortOfModel]: sort,
          [names.modelInitAt]: new Date(),
        };
      };
      const initFn = async (...args: any[]) => {
        const modelInit = await getInitFn(...(args as object[]));
        const modelObjList = modelInit[names.modelObjList] as Light[];
        const modelObjInsight = modelInit[names.modelObjInsight] as Insight;
        const modelList = modelObjList.map((modelObj) =>
          (base[names.lightCrystalizeModel] as (obj: any) => Light)(modelObj)
        );
        const modelInsight = (base[names.crystalizeModelInsight] as (obj: any) => Insight)(modelObjInsight);
        return {
          [namesOfSlice.modelList]: modelList, // Server Component용
          [namesOfSlice.modelInsight]: modelInsight, // Server Component용
          [namesOfSlice.modelInit]: modelInit,
        };
      };
      return [...acc, [namesOfSlice.getModelInit, getInitFn], [namesOfSlice.initModel, initFn]];
    }, [])
  ) as object;
  const overwriteSlices = option.overwrite
    ? (option.overwrite.slices as SliceMeta[]).filter(
        (slice: SliceMeta) => !sigMeta.slices.some((s) => s.sliceName === slice.sliceName)
      )
    : [];
  const modelGql = Object.assign(option.overwrite ?? {}, {
    ...gql,
    ...base,
    ...util,
    ...sliceUtil,
    slices: [...overwriteSlices, ...sigMeta.slices],
  });
  setGqlOnStorage(refName, modelGql);
  return modelGql as unknown as DbGraphQL<
    T,
    Input,
    Full,
    Light,
    Insight,
    Filter,
    LightWeightFetch<
      GetQueryMutationOf<Signal & DefaultSignal<T, Input, Full, Light, Insight, Filter>, Full>,
      Full,
      Light
    >,
    Signal
  >;
};

const getPredefinedDefault = (refName: string) => {
  const defaultData = Reflect.getMetadata(refName, DefaultStorage.prototype) as object | undefined;
  return defaultData;
};
const setPredefinedDefault = (refName: string, defaultData: object) => {
  Reflect.defineMetadata(refName, defaultData, DefaultStorage.prototype);
};

export const makeDefault = <T>(target: Type<T>, option: { isChild?: boolean; overwrite?: any } = {}): DefaultOf<T> => {
  const classMeta = getClassMeta(target);
  const predefinedDefault = getPredefinedDefault(classMeta.refName);
  if (predefinedDefault && !option.overwrite) return predefinedDefault as DefaultOf<T>;
  if (option.isChild && classMeta.type !== "scalar") return null as unknown as DefaultOf<T>;
  const metadatas = getFieldMetas(target);
  const result: { [key: string]: any } = {};
  for (const metadata of metadatas) {
    if (metadata.fieldType === "hidden") result[metadata.key] = null;
    else if (metadata.default) {
      if (typeof metadata.default === "function") result[metadata.key] = (metadata.default as () => object)();
      else result[metadata.key] = metadata.default as object;
    } else if (metadata.isArray) result[metadata.key] = [];
    else if (metadata.nullable) result[metadata.key] = null;
    else if (metadata.isClass) result[metadata.key] = metadata.isScalar ? makeDefault(metadata.modelRef) : null;
    else result[metadata.key] = scalarDefaultMap.get(metadata.modelRef) as object;
  }
  setPredefinedDefault(classMeta.refName, result);
  return result as DefaultOf<T>;
};

const query = async <Query = any>(
  fetchClient: Client,
  query: string,
  variables: AnyVariables = {},
  option: FetchPolicy = {}
) => {
  const jwt = option.url ? null : fetchClient.getJwt();
  const { data, error } = await fetchClient.gql
    .query<Query>(query, variables, {
      fetch,
      url: option.url ?? fetchClient.uri,
      requestPolicy:
        typeof option.cache === "string" ? option.cache : option.cache === true ? "cache-first" : "network-only",
      fetchOptions: {
        ...(typeof option.cache === "number"
          ? { next: { revalidate: option.cache } }
          : option.cache === true
            ? { cache: "force-cache" }
            : { cache: "no-store" }),
        headers: {
          "apollo-require-preflight": "true",
          ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
          ...(option.token ? { authorization: `Bearer ${option.token}` } : {}),
        },
      },
    })
    .toPromise();
  if (!data) {
    const content = error?.graphQLErrors[0]?.message ?? "Unknown Error";
    if (option.onError) {
      option.onError(content);
      return;
    } else throw new Error(content);
  }
  return data;
};
const mutate = async <Mutation = any>(
  fetchClient: Client,
  mutation: string,
  variables: AnyVariables = {},
  option: FetchPolicy = {}
) => {
  const jwt = option.url ? null : fetchClient.getJwt();
  const { data, error } = await fetchClient.gql
    .mutation<Mutation>(mutation, variables, {
      fetch,
      url: option.url ?? fetchClient.uri,
      requestPolicy: "network-only",
      fetchOptions: {
        cache: "no-store",
        headers: {
          "apollo-require-preflight": "true",
          ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
          ...(option.token ? { authorization: `Bearer ${option.token}` } : {}),
        },
      },
    })
    .toPromise();
  if (!data) {
    const content = error?.graphQLErrors[0]?.message ?? "Unknown Error";
    if (option.onError) {
      option.onError(content);
      return;
    } else throw new Error(content);
  }
  return data;
};

const scalarPurifyMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Date | Dayjs) => dayjs(value).toDate()],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [GqlJSON, (value: object) => value],
]);
const getPurifyFn = (modelRef: Type): ((value: any) => object) => {
  const [valueRef] = getNonArrayModel(modelRef);
  return scalarPurifyMap.get(valueRef) ?? ((value) => value as object);
};

const purify = (metadata: ConstantFieldMeta, value: any, self: any) => {
  // 1. Check Data Validity
  if (
    metadata.nullable &&
    (value === null ||
      value === undefined ||
      (typeof value === "number" && isNaN(value)) ||
      (typeof value === "string" && !value.length))
  )
    return null;
  if (metadata.isArray) {
    if (!Array.isArray(value)) throw new Error(`Invalid Array Value in ${metadata.key} for value ${value}`);
    if (metadata.minlength && value.length < metadata.minlength)
      throw new Error(`Invalid Array Length (Min) in ${metadata.key} for value ${value}`);
    else if (metadata.maxlength && value.length > metadata.maxlength)
      throw new Error(`Invalid Array Length (Max) in ${metadata.key} for value ${value}`);
    return value.map((v) => purify({ ...metadata, isArray: false }, v, v) as object) as object;
  }
  if (metadata.isMap && metadata.of) {
    const purifyFn = getPurifyFn(metadata.of);
    return Object.fromEntries(
      [...(value as Map<string, any>).entries()].map(([key, val]) => [key, applyFnToArrayObjects(val, purifyFn)])
    );
  }
  if (metadata.isClass) return makePurify(metadata.modelRef)(value as object, true) as object;
  if (metadata.name === "Date" && dayjs(value as Date).isBefore(dayjs(new Date("0000"))))
    throw new Error(`Invalid Date Value (Default) in ${metadata.key} for value ${value}`);
  if (["String", "ID"].includes(metadata.name) && (value === "" || !value))
    throw new Error(`Invalid String Value (Default) in ${metadata.key} for value ${value}`);
  if (metadata.validate && !metadata.validate(value, self))
    throw new Error(`Invalid Value (Failed to pass validation) / ${value} in ${metadata.key}`);
  if (!metadata.nullable && !value && value !== 0 && value !== false)
    throw new Error(`Invalid Value (Nullable) in ${metadata.key} for value ${value}`);

  // 2. Convert Value
  const purifyFn = getPurifyFn(metadata.modelRef);
  return purifyFn(value);
};

const getPredefinedPurifyFn = (refName: string) => {
  const purify = Reflect.getMetadata(refName, PurifyStorage.prototype) as PurifyFunc<any, any> | undefined;
  return purify;
};
const setPredefinedPurifyFn = (refName: string, purify: PurifyFunc<any, any>) => {
  Reflect.defineMetadata(refName, purify, PurifyStorage.prototype);
};

export const makePurify = <I, M = I>(target: Type<I>, option: { overwrite?: any } = {}): PurifyFunc<I, M> => {
  const classMeta = getClassMeta(target);
  const purifyFn = getPredefinedPurifyFn(classMeta.refName);
  if (purifyFn && !option.overwrite) return purifyFn;
  const fn = ((self: { [key: string]: any }, isChild?: boolean) => {
    try {
      if (isChild && classMeta.type !== "scalar") {
        const id = self.id as string;
        if (!id) throw new Error(`Invalid Value (No ID) for id ${classMeta.refName}`);
        return id;
      }
      const metadatas = getFieldMetas(target);
      const result: { [key: string]: any } = {};
      for (const metadata of metadatas) {
        // if (metadata.fieldType === "hidden") continue;
        const value = self[metadata.key] as object;
        result[metadata.key] = purify(metadata, value, self) as object;
      }
      return result;
    } catch (err) {
      if (isChild) throw new Error(err as string);
      Logger.debug(err as string);
      return null;
    }
  }) as PurifyFunc<I, M>;
  setPredefinedPurifyFn(classMeta.refName, fn);
  return fn;
};
const scalarCrystalizeMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Date | Dayjs) => dayjs(value)],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [GqlJSON, (value: any) => value as object],
]);
const crystalize = (metadata: ConstantFieldMeta, value: any) => {
  if (value === undefined || value === null) return value as undefined | null;
  if (metadata.isArray && Array.isArray(value))
    return value.map((v: any) => crystalize({ ...metadata, isArray: false }, v) as object);
  if (metadata.isMap) {
    const [valueRef] = getNonArrayModel(metadata.of);
    const crystalizeValue = scalarCrystalizeMap.get(valueRef as unknown as GqlScalar) ?? ((value) => value as object);
    return new Map(
      Object.entries(value as object).map(([key, val]) => [key, applyFnToArrayObjects(val, crystalizeValue)])
    );
  }
  if (metadata.isClass) return makeCrystalize(metadata.modelRef)(value as object, true) as object;
  if (metadata.name === "Date") return dayjs(value as Date);
  return (scalarCrystalizeMap.get(metadata.modelRef) ?? ((value) => value as object))(value) as object;
};

const getPredefinedCrystalizeFn = (refName: string) => {
  const crystalize = Reflect.getMetadata(refName, CrystalizeStorage.prototype) as CrystalizeFunc<any> | undefined;
  return crystalize;
};
const setPredefinedCrystalizeFn = (refName: string, crystalize: CrystalizeFunc<any>) => {
  Reflect.defineMetadata(refName, crystalize, CrystalizeStorage.prototype);
};
export const makeCrystalize = <M>(
  target: Type<M>,
  option: { overwrite?: any; partial?: string[] } = {}
): CrystalizeFunc<M> => {
  const classMeta = getClassMeta(target);
  const crystalizeFn = getPredefinedCrystalizeFn(classMeta.refName);
  if (crystalizeFn && !option.overwrite && !option.partial?.length) return crystalizeFn;
  const fieldMetaMap = getFieldMetaMap(target);
  const fieldKeys = option.partial?.length
    ? classMeta.type === "scalar"
      ? option.partial
      : ["id", ...option.partial, "updatedAt"]
    : [...fieldMetaMap.keys()];
  const metadatas = fieldKeys.map((key) => fieldMetaMap.get(key)) as ConstantFieldMeta[];
  const fn = ((self: M, isChild?: boolean) => {
    try {
      const result: { [key: string]: any } = Object.assign(new target() as object, self);
      for (const metadata of metadatas.filter((m) => !!self[m.key])) {
        if (metadata.fieldType === "hidden") continue;
        result[metadata.key] = crystalize(metadata, self[metadata.key]) as object;
      }
      return result;
    } catch (err) {
      if (isChild) throw new Error(err as string);
      return null;
    }
  }) as CrystalizeFunc<M>;
  if (!option.partial?.length) setPredefinedCrystalizeFn(classMeta.refName, fn);
  return fn;
};

const fragmentize = (target: Type, fragMap = new Map<string, string>()) => {
  const classMeta = getClassMeta(target);
  const metadatas = getFieldMetas(target);
  const fragment =
    `fragment ${lowerlize(classMeta.refName)}Fragment on ${capitalize(
      classMeta.type === "light" ? classMeta.refName.slice(5) : classMeta.refName
    )} {\n` +
    metadatas
      .filter((metadata) => metadata.fieldType !== "hidden")
      .map((metadata) => {
        return metadata.isClass
          ? `  ${metadata.key} {\n    ...${lowerlize(metadata.name)}Fragment\n  }`
          : `  ${metadata.key}`;
      })
      .join(`\n`) +
    `\n}`;
  fragMap.set(classMeta.refName, fragment);
  getChildClassRefs(target).map((childRef) => fragmentize(childRef, fragMap));
  return fragMap;
};

const getPredefinedFragment = (refName: string) => {
  const fragment = Reflect.getMetadata(refName, FragmentStorage.prototype) as string | undefined;
  return fragment;
};
const setPredefinedFragment = (refName: string, fragment: string) => {
  Reflect.defineMetadata(refName, fragment, FragmentStorage.prototype);
};

export const makeFragment = (target: Type, option: { overwrite?: any; excludeSelf?: boolean } = {}) => {
  const classMeta = getClassMeta(target);
  const fragment = getPredefinedFragment(classMeta.refName);
  if (fragment && !option.overwrite && !option.excludeSelf) return fragment;
  const fragMap = new Map(fragmentize(target));
  if (option.excludeSelf) fragMap.delete(classMeta.refName);
  const gqlStr = [...fragMap.values()].join("\n");
  if (!option.excludeSelf) setPredefinedFragment(classMeta.refName, gqlStr);
  return gqlStr;
};

export const getGqlStr = (
  modelRef: Type,
  gqlMeta: GqlMeta,
  argMetas: ArgMeta[],
  returnRef: Type,
  partial?: string[]
) => {
  const isScalar = isGqlScalar(modelRef);
  const argStr = makeArgStr(argMetas);
  const argAssignStr = makeArgAssignStr(argMetas);
  const returnStr = makeReturnStr(returnRef, partial);
  const gqlStr = `${isScalar ? "" : makeFragment(returnRef, { excludeSelf: !!partial?.length })}
${lowerlize(gqlMeta.type) + " " + gqlMeta.key + argStr}{
  ${gqlMeta.key}${argAssignStr}${returnStr}
}
`;
  return gqlStr;
};

const scalarSerializeMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Date | Dayjs) => dayjs(value).toDate()],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [GqlJSON, (value: any) => value as object],
]);
const getSerializeFn = (inputRef: Type) => {
  const serializeFn = scalarSerializeMap.get(inputRef);
  if (!serializeFn) return (value) => value as object;
  else return serializeFn;
};
const serializeInput = (value: any, inputRef: Type, arrDepth: number) => {
  if (arrDepth && Array.isArray(value))
    return value.map((v) => serializeInput(v, inputRef, arrDepth - 1) as object) as unknown as object[];
  else if (inputRef.prototype === Map.prototype) {
    const [valueRef] = getNonArrayModel(inputRef);
    const serializeFn = getSerializeFn(valueRef);
    return Object.fromEntries(
      [...(value as Map<string, any>).entries()].map(([key, val]) => [key, applyFnToArrayObjects(val, serializeFn)])
    );
  } else if (isGqlScalar(inputRef)) {
    const serializeFn = getSerializeFn(inputRef);
    return serializeFn(value) as object;
  }
  const classMeta = getClassMeta(inputRef);
  if (classMeta.type !== "scalar")
    return value as { id: string }; // id string
  else
    return Object.fromEntries(
      getFieldMetas(inputRef).map((fieldMeta) => [
        fieldMeta.key,
        serializeInput((value as { [key: string]: any })[fieldMeta.key], fieldMeta.modelRef, fieldMeta.arrDepth),
      ])
    );
};

export const serializeArg = (argMeta: ArgMeta, value: any) => {
  const [returnRef, arrDepth] = getNonArrayModel(argMeta.returns() as Type);
  if (argMeta.argsOption.nullable && (value === null || value === undefined)) return null;
  else if (!argMeta.argsOption.nullable && (value === null || value === undefined))
    throw new Error(`Invalid Value (Nullable) in ${argMeta.name} for value ${value}`);
  return serializeInput(value, returnRef, arrDepth) as object[];
};

const scalarDeserializeMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Date | Dayjs) => dayjs(value)],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [GqlJSON, (value: any) => value as object],
]);
const getDeserializeFn = (inputRef: Type) => {
  const deserializeFn = scalarDeserializeMap.get(inputRef);
  if (!deserializeFn) return (value) => value as object;
  return deserializeFn;
};
const deserializeInput = (value: any, inputRef: Type, arrDepth: number) => {
  if (arrDepth && Array.isArray(value))
    return value.map((v) => deserializeInput(v, inputRef, arrDepth - 1) as object) as unknown as object[];
  else if (inputRef.prototype === Map.prototype) {
    const [valueRef] = getNonArrayModel(inputRef);
    const deserializeFn = getDeserializeFn(valueRef);
    return Object.fromEntries(
      [...(value as Map<string, any>).entries()].map(([key, val]) => [key, applyFnToArrayObjects(val, deserializeFn)])
    );
  } else if (isGqlScalar(inputRef)) {
    const deserializeFn = getDeserializeFn(inputRef);
    return deserializeFn(value) as object;
  }
  const classMeta = getClassMeta(inputRef);
  if (classMeta.type !== "scalar") return value as { id: string };
  else
    return Object.fromEntries(
      getFieldMetas(inputRef).map((fieldMeta) => [
        fieldMeta.key,
        deserializeInput((value as { [key: string]: any })[fieldMeta.key], fieldMeta.modelRef, fieldMeta.arrDepth),
      ])
    );
};

export const deserializeArg = (argMeta: ArgMeta, value: any) => {
  const [returnRef, arrDepth] = getNonArrayModel(argMeta.returns() as Type);
  if (argMeta.argsOption.nullable && (value === null || value === undefined)) return null;
  else if (!argMeta.argsOption.nullable && (value === null || value === undefined))
    throw new Error(`Invalid Value (Nullable) in ${argMeta.name} for value ${value}`);
  return deserializeInput(value, returnRef, arrDepth) as object[];
};

export const fetchOf = <Signal>(
  sigRef: Type<Signal>
): GetWsMessageOf<Signal> & GetWsPubsubOf<Signal> & GetQueryMutationOf<Signal> => {
  const gqls: { [key: string]: any } = {};
  const gqlMetas = getGqlMetas(sigRef);
  gqlMetas
    .filter((gqlMeta) => !gqlMeta.signalOption.default)
    .forEach((gqlMeta) => {
      if (gqlMeta.type === "Message") {
        const [returnRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
        const isScalar = isGqlScalar(returnRef);
        const emitEvent = function (this: { client: Client }, ...args: any[]) {
          if (!this.client.socket) {
            Logger.warn(`${gqlMeta.key} emit suppressed - socket is not connected`);
            return;
          }
          const [argMetas] = getArgMetas(sigRef, gqlMeta.signalOption.name ?? gqlMeta.key);
          const message = Object.fromEntries(
            argMetas.map((argMeta) => [argMeta.name, serializeArg(argMeta, args[argMeta.idx]) ?? null])
          );
          Logger.debug(`socket emit: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
          this.client.socket.emit(gqlMeta.key, message);
        };
        const listenEvent = function (this: { client: Client }, handleEvent: (data: object) => any) {
          const crystalize = (data) => {
            if (isScalar) {
              if (returnRef.prototype === Date.prototype) return dayjs(data as Date);
              else return data as object;
            } else if (Array.isArray(data)) return data.map((d) => crystalize(d) as object);
            else return makeCrystalize(returnRef)(data as object) as object;
          };
          const handle = (data) => {
            Logger.debug(`socket listened: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            handleEvent(crystalize(data) as object);
          };
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.client.waitUntilWebSocketConnected().then(() => {
            if (!this.client.socket) return;
            Logger.debug(`socket listen start: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            this.client.socket.removeListener(gqlMeta.key, handle);
            this.client.socket.on(gqlMeta.key, handle);
          });
          return async () => {
            await this.client.waitUntilWebSocketConnected();
            Logger.debug(`socket listen end: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            this.client.socket?.removeListener(gqlMeta.key, handle);
          };
        };
        gqls[gqlMeta.key] = emitEvent;
        gqls[`listen${capitalize(gqlMeta.key)}`] = listenEvent;
      } else if (gqlMeta.type === "Pubsub") {
        const [returnRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
        const [argMetas] = getArgMetas(sigRef, gqlMeta.signalOption.name ?? gqlMeta.key);
        const isScalar = isGqlScalar(returnRef);
        const makeRoomId = (gqlKey: string, argValues: any[]) => `${gqlKey}-${argValues.join("-")}`;
        const crystalize = (data) => {
          if (isScalar) {
            if (returnRef.prototype === Date.prototype) return dayjs(data as Date);
            else return data as object;
          } else if (Array.isArray(data)) return data.map((d) => crystalize(d) as object);
          else return makeCrystalize(returnRef)(data as object) as object;
        };
        const subscribeEvent = function (this: { client: Client }, ...args) {
          const onData = args.at(-1) as (data: any) => any;
          const message = Object.fromEntries(
            argMetas.map((argMeta) => [argMeta.name, serializeArg(argMeta, args[argMeta.idx]) ?? null])
          );
          const handleEvent = (data: { __subscribe__: boolean }) => {
            if (data.__subscribe__) return; // ack
            onData(crystalize(data) as object);
          };
          const roomId = makeRoomId(
            gqlMeta.key,
            argMetas.map((argMeta) => message[argMeta.name])
          );

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.client.waitUntilWebSocketConnected().then(() => {
            if (!this.client.socket) return;
            Logger.debug(`socket subscribe start: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            const hasListeners = this.client.socket.hasListeners(roomId);
            if (!hasListeners) this.client.socket.emit(gqlMeta.key, { ...message, __subscribe__: true });
            this.client.socket.on(roomId, handleEvent);
          });

          return async () => {
            //! 앱에서 다른 앱 넘어갈 때 언마운트 되버리면서 subscribe가 끊기는 일이 있음.
            await this.client.waitUntilWebSocketConnected();
            if (!this.client.socket) return;
            Logger.debug(`socket unsubscribe: ${gqlMeta.key}: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            this.client.socket.removeListener(roomId, handleEvent);
            const hasListeners = this.client.socket.hasListeners(roomId);
            if (!hasListeners) this.client.socket.emit(gqlMeta.key, { ...message, __subscribe__: false });
          };
        };
        gqls[`subscribe${capitalize(gqlMeta.key)}`] = subscribeEvent;
      } else if (gqlMeta.type === "Query" || gqlMeta.type === "Mutation") {
        const name = gqlMeta.signalOption.name ?? gqlMeta.key;
        const makeReq = ({ resolve }: { resolve: boolean }) =>
          async function (this: { client: Client }, ...args) {
            Logger.debug(`fetch: ${gqlMeta.key} start: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}`);
            const now = Date.now();
            const [argMetas] = getArgMetas(sigRef, gqlMeta.signalOption.name ?? gqlMeta.key);
            const [modelRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
            const isScalar = isGqlScalar(modelRef);
            const returnRef = isScalar || !arrDepth ? modelRef : getLightModelRef(modelRef);
            const fetchPolicy =
              (args[argMetas.length] as FetchPolicy | undefined) ?? ({ crystalize: true } as FetchPolicy);
            const partial = fetchPolicy.partial ?? (gqlMeta.signalOption.partial as string[] | undefined);
            const crystalize = (data) => {
              if (fetchPolicy.crystalize === false) return data as object;
              if (isScalar) {
                if (returnRef.prototype === Date.prototype) return dayjs(data as Date);
                else return data as object;
              } else if (Array.isArray(data)) return data.map((d) => crystalize(d) as object);
              else return makeCrystalize(returnRef, { partial })(data as object) as object;
            };
            const res = (
              (await (gqlMeta.type === "Query" ? query : mutate)(
                this.client,
                graphql(getGqlStr(modelRef, gqlMeta, argMetas, returnRef, partial)),
                Object.fromEntries(
                  argMetas.map((argMeta) => [argMeta.name, serializeArg(argMeta, args[argMeta.idx]) ?? null])
                ),
                fetchPolicy
              )) as unknown as { [key: string]: object }
            )[name];
            const data = resolve ? (crystalize(res) as object) : res;
            Logger.debug(
              `fetch: ${gqlMeta.key} end: ${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")} ${Date.now() - now}ms`
            );
            return data;
          };
        gqls[name] = makeReq({ resolve: true });
        gqls[`_${name}`] = makeReq({ resolve: false });
      }
    });
  return gqls as unknown as GetWsMessageOf<Signal> & GetWsPubsubOf<Signal> & GetQueryMutationOf<Signal>;
};

type CustomFetch<T> = Omit<T, "client" | "clone"> & {
  client: Client;
  clone: (option?: { jwt: string | null }) => CustomFetch<T>;
  // [Symbol.dispose]: () => void;
};
export const makeFetch = <
  F1 extends object,
  F2 extends object,
  F3 extends object,
  F4 extends object,
  F5 extends object,
  F6 extends object,
  F7 extends object,
  F8 extends object,
  F9 extends object,
  F10 extends object,
>(
  fetch1: F1,
  fetch2?: Partial<F2>,
  fetch3?: Partial<F3>,
  fetch4?: Partial<F4>,
  fetch5?: Partial<F5>,
  fetch6?: Partial<F6>,
  fetch7?: Partial<F7>,
  fetch8?: Partial<F8>,
  fetch9?: Partial<F9>,
  fetch10?: Partial<F10>
): CustomFetch<F10 & F9 & F8 & F7 & F6 & F5 & F4 & F3 & F2 & F1> => {
  return Object.assign(fetch1, fetch2, fetch3, fetch4, fetch5, fetch6, fetch7, fetch8, fetch9, fetch10) as CustomFetch<
    F10 & F9 & F8 & F7 & F6 & F5 & F4 & F3 & F2 & F1
  >;
};

const makeArgStr = (argMetas: ArgMeta[]) => {
  return argMetas.length
    ? `(${argMetas
        .map((argMeta) => {
          const [argRef, arrDepth] = getNonArrayModel(argMeta.returns() as Type);
          const argRefType = isGqlScalar(argRef)
            ? "gqlScalar"
            : getClassMeta(argRef).type === "scalar"
              ? "scalar"
              : "model";
          const gqlTypeStr =
            "[".repeat(arrDepth) +
            (getGqlTypeStr(argRef) + (argRefType === "scalar" ? "Input" : "")) +
            "!]".repeat(arrDepth);
          return `$${argMeta.name}: ` + gqlTypeStr + (argMeta.argsOption.nullable ? "" : "!");
        })
        .join(", ")})`
    : "";
};

const makeArgAssignStr = (argMetas: ArgMeta[]) => {
  return argMetas.length ? `(${argMetas.map((argMeta) => `${argMeta.name}: $${argMeta.name}`).join(", ")})` : "";
};

const makeReturnStr = (returnRef: Type, partial?: string[]) => {
  const isScalar = isGqlScalar(returnRef);
  if (isScalar) return "";
  const classMeta = getClassMeta(returnRef);
  if (!partial?.length)
    return ` {
    ...${lowerlize(classMeta.refName)}Fragment
  }`;
  const targetKeys = classMeta.type === "scalar" ? partial : [...new Set(["id", ...partial, "updatedAt"])];
  const fieldMetaMap = getFieldMetaMap(returnRef);
  return ` {
${targetKeys
  .map((key) => fieldMetaMap.get(key))
  .filter((metadata) => metadata && metadata.fieldType !== "hidden")
  .map((fieldMeta: ConstantFieldMeta) =>
    fieldMeta.isClass
      ? `    ${fieldMeta.key} {
      ...${lowerlize(fieldMeta.name)}Fragment
    }`
      : `    ${fieldMeta.key}`
  )
  .join("\n")}
  }`;
};
