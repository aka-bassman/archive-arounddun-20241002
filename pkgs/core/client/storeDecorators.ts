"use client";
import {
  type Dayjs,
  DbGraphQL,
  DefaultOf,
  DocumentModel,
  FetchInitForm,
  FieldState,
  FilterListArgs,
  FilterStateArgs,
  type FilterType,
  type GetStateObject,
  ProtoFile,
  QueryOf,
  SliceMeta,
  type SortOf,
  Type,
  getClassMeta,
  getFieldMetas,
  getFullModelRef,
  getGqlOnStorage,
  getLightModelRef,
} from "../base";
import { type FetchPolicy } from "../common/types";
import { Logger } from "../common/Logger";
import { MutableRefObject, useEffect, useRef } from "react";
import { Mutate, StoreApi, create } from "zustand";
import { applyMixins } from "../common/applyMixins";
import { capitalize } from "../common/capitalize";
import { deepObjectify } from "../common/deepObjectify";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { isQueryEqual } from "../common/isQueryEqual";
import { lowerlize } from "../common/lowerlize";
import { msg } from "@core/base";
import { pathSet } from "../common/pathSet";
import type { Submit } from "./types";

export const st = {} as unknown as WithSelectors<any>;
class StoreStorage {}
interface StoreMeta {
  refName: string;
  useKeys: string[];
  doKeys: string[];
  slices: SliceMeta[];
}
const getStoreMeta = (storeName: string): StoreMeta => {
  const storeMeta = Reflect.getMetadata(storeName, StoreStorage.prototype as object) as StoreMeta | undefined;
  if (!storeMeta) throw new Error(`storeMeta is not defined: ${storeName}`);
  return storeMeta;
};
const setStoreMeta = (storeName: string, storeMeta: StoreMeta) => {
  Reflect.defineMetadata(storeName, storeMeta, StoreStorage.prototype);
};
const getStoreNames = () => {
  const storeNames = Reflect.getMetadataKeys(StoreStorage.prototype) as string[] | undefined;
  if (!storeNames) throw new Error(`storeNames is not defined`);
  return storeNames;
};

type SliceStateKey =
  | "defaultModel"
  | "modelInsight"
  | "modelMap"
  | "modelMapLoading"
  | "modelInitMap"
  | "modelInitAt"
  | "modelSelection"
  | "lastPageOfModel"
  | "pageOfModel"
  | "limitOfModel"
  | "queryArgsOfModel"
  | "sortOfModel";
type SliceActionKey =
  | "initModel"
  | "refreshModel"
  | "selectModel"
  | "setPageOfModel"
  | "addPageOfModel"
  | "setLimitOfModel"
  | "setQueryArgsOfModel"
  | "setSortOfModel";
type BaseState<T extends string, Full> = {
  [K in `${Uncapitalize<T>}`]: Full | null;
} & {
  [K in `${Uncapitalize<T>}Loading`]: string | boolean;
} & {
  [K in `${Uncapitalize<T>}Form`]: DefaultOf<Full>;
} & {
  [K in `${Uncapitalize<T>}FormLoading`]: string | boolean;
} & {
  [K in `${Uncapitalize<T>}Submit`]: Submit;
} & {
  [K in `${Uncapitalize<T>}ViewMap`]: Map<string, Full>;
} & {
  [K in `${Uncapitalize<T>}ViewAt`]: Date;
} & {
  [K in `${Uncapitalize<T>}Modal`]: string | null;
} & {
  [K in `${Uncapitalize<T>}Operation`]: "sleep" | "reset" | "idle" | "error" | "loading";
};

type SliceState<
  T extends string,
  Full,
  Light,
  QueryArgs,
  Insight,
  Filter extends FilterType,
  Suffix extends string = "",
> = {
  [K in `default${Capitalize<T>}${Suffix}`]: DefaultOf<Full>;
} & {
  [K in `${Uncapitalize<T>}Map${Suffix}`]: Map<string, Light>;
} & {
  [K in `${Uncapitalize<T>}MapLoading${Suffix}`]: boolean;
} & {
  [K in `${Uncapitalize<T>}InitMap${Suffix}`]: Map<string, Light>;
} & {
  [K in `${Uncapitalize<T>}InitAt${Suffix}`]: Date;
} & {
  [K in `${Uncapitalize<T>}Selection${Suffix}`]: Map<string, Light>;
} & {
  [K in `${Uncapitalize<T>}Insight${Suffix}`]: Insight;
} & {
  [K in `lastPageOf${Capitalize<T>}${Suffix}`]: number;
} & {
  [K in `pageOf${Capitalize<T>}${Suffix}`]: number;
} & {
  [K in `limitOf${Capitalize<T>}${Suffix}`]: number;
} & {
  [K in `queryArgsOf${Capitalize<T>}${Suffix}`]: QueryArgs;
} & {
  [K in `sortOf${Capitalize<T>}${Suffix}`]: SortOf<Filter>;
};

type MergeFields<T> = {
  [K in keyof T]: T[K] extends object ? T[K] : never;
}[keyof T];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type DefaultState<T extends string, Full, Light, Insight, Filter extends FilterType, Signal> = BaseState<T, Full> &
  SliceState<T, Full, Light, [query: QueryOf<DocumentModel<Full>>], Insight, Filter> &
  UnionToIntersection<
    MergeFields<{
      [K in keyof Signal as K extends `${T}List${infer Suffix}` ? K : never]: K extends `${T}List${infer Suffix}`
        ? Signal[K] extends (...args: infer Args) => Promise<Full[]>
          ? SliceState<T, Full, Light, FilterStateArgs<Args, Filter>, Insight, Filter, Suffix>
          : never
        : never;
    }>
  >;

export const createState = <T extends string, Input, Full, Light, Insight, Filter extends FilterType, Fetch, Signal>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>
): DefaultState<T, Full, Light, Insight, Filter, Signal> => {
  const [fieldName, className] = [lowerlize(gql.refName), capitalize(gql.refName)];
  const names = {
    model: fieldName,
    Model: className,
    modelLoading: `${fieldName}Loading`,
    modelForm: `${fieldName}Form`,
    modelFormLoading: `${fieldName}FormLoading`,
    modelSubmit: `${fieldName}Submit`,
    modelViewMap: `${fieldName}ViewMap`,
    modelViewAt: `${fieldName}ViewAt`,
    modelModal: `${fieldName}Modal`,
    modelOperation: `${fieldName}Operation`,
    defaultModel: `default${className}`,
    defaultModelInsight: `default${className}Insight`,
    modelMap: `${fieldName}Map`,
    modelMapLoading: `${fieldName}MapLoading`,
    modelInitMap: `${fieldName}InitMap`,
    modelInitAt: `${fieldName}InitAt`,
    modelSelection: `${fieldName}Selection`,
    modelInsight: `${fieldName}Insight`,
    lastPageOfModel: `lastPageOf${className}`,
    pageOfModel: `pageOf${className}`,
    limitOfModel: `limitOf${className}`,
    queryArgsOfModel: `queryArgsOf${className}`,
    sortOfModel: `sortOf${className}`,
  };
  const baseState = {
    [names.model]: null,
    [names.modelLoading]: true,
    [names.modelForm]: { ...gql[names.defaultModel] } as object,
    [names.modelFormLoading]: true,
    [names.modelSubmit]: { disabled: true, loading: false, times: 0 },
    [names.modelViewMap]: new Map(),
    [names.modelViewAt]: new Date(0),
    [names.modelModal]: null,
    [names.modelOperation]: "sleep",
  };
  const sliceState = gql.slices.reduce((acc, { sliceName, defaultArgs }) => {
    const SliceName = capitalize(sliceName);
    const namesOfSlice: { [key in SliceStateKey]: string } = {
      defaultModel: SliceName.replace(names.Model, names.defaultModel), //clusterInSelf Cluster
      modelMap: sliceName.replace(names.model, names.modelMap),
      modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
      modelInitMap: sliceName.replace(names.model, names.modelInitMap),
      modelInitAt: sliceName.replace(names.model, names.modelInitAt),
      modelSelection: sliceName.replace(names.model, names.modelSelection),
      modelInsight: sliceName.replace(names.model, names.modelInsight),
      lastPageOfModel: SliceName.replace(names.Model, names.lastPageOfModel),
      pageOfModel: SliceName.replace(names.Model, names.pageOfModel),
      limitOfModel: SliceName.replace(names.Model, names.limitOfModel),
      queryArgsOfModel: SliceName.replace(names.Model, names.queryArgsOfModel),
      sortOfModel: SliceName.replace(names.Model, names.sortOfModel),
    };
    const singleSliceState = {
      [namesOfSlice.defaultModel]: { ...gql[names.defaultModel] } as object,
      [namesOfSlice.modelMap]: new Map(),
      [namesOfSlice.modelMapLoading]: true,
      [namesOfSlice.modelInitMap]: new Map(),
      [namesOfSlice.modelInitAt]: new Date(0),
      [namesOfSlice.modelSelection]: new Map(),
      [namesOfSlice.modelInsight]: gql[names.defaultModelInsight] as object,
      [namesOfSlice.lastPageOfModel]: 1,
      [namesOfSlice.pageOfModel]: 1,
      [namesOfSlice.limitOfModel]: 20,
      [namesOfSlice.queryArgsOfModel]: defaultArgs,
      [namesOfSlice.sortOfModel]: "latest",
    };
    return Object.assign(acc, singleSliceState);
  }, {});
  return { ...baseState, ...sliceState } as DefaultState<T, Full, Light, Insight, Filter, Signal>;
};

type GetState<T, K> = K extends keyof T ? T[K] : never;

type PickState<G> = G extends () => infer S ? PickFunc<S, keyof S> : never;
type PickFunc<T, F extends keyof T = keyof T> = (...fields: F[]) => {
  [K in (typeof fields)[number]]: Exclude<T[K], null | undefined | "loading">;
}; // & { [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K] };
type MakeState<Maker> = Maker extends (...args: any) => infer S ? S : Maker;

export interface SetGet<State> {
  set: (state: Partial<MakeState<State>> | ((state: MakeState<State>) => any)) => void;
  get: GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">;
  pick: PickState<GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">>;
}
export interface SetPick<State> {
  set: (state: Partial<MakeState<State>> | ((state: MakeState<State>) => any)) => void;
  pick: PickState<GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">>;
}
export type State<StateMaker, Actions = () => Record<string, never>> = (StateMaker extends (...args: any) => infer R
  ? R
  : StateMaker) &
  (Actions extends (...args: any) => infer R ? R : never);
export type Get<State, Actions> = MakeState<State> & MakeState<Actions>;

export interface CreateOption<Full extends { id: string }> {
  idx?: number;
  path?: string;
  modal?: string;
  sliceName?: string;
  onError?: (e: string) => void;
  onSuccess?: (model: Full) => void | Promise<void>;
}
export interface NewOption {
  modal?: string;
  setDefault?: boolean;
  sliceName?: string;
}

type PartialOrNull<O> = { [K in keyof O]?: O[K] | null };
type BaseAction<T extends string, Input, Full extends { id: string }, Light> = {
  [K in `create${Capitalize<T>}InForm`]: (options?: CreateOption<Full>) => Promise<void>;
} & {
  [K in `update${Capitalize<T>}InForm`]: (options?: CreateOption<Full>) => Promise<void>;
} & {
  [K in `create${Capitalize<T>}`]: (data: GetStateObject<Input>, options?: CreateOption<Full>) => Promise<void>;
} & {
  [K in `update${Capitalize<T>}`]: (
    id: string,
    data: GetStateObject<Input>,
    options?: CreateOption<Full>
  ) => Promise<void>;
} & {
  [K in `remove${Capitalize<T>}`]: (id: string, options?: FetchPolicy & { modal?: string | null }) => Promise<void>;
} & {
  [K in `check${Capitalize<T>}Submitable`]: (disabled?: boolean) => Promise<void>;
} & {
  [K in `submit${Capitalize<T>}`]: (options?: CreateOption<Full>) => Promise<void>;
} & {
  [K in `new${Capitalize<T>}`]: (partial?: PartialOrNull<Full>, options?: NewOption) => void;
} & {
  [K in `edit${Capitalize<T>}`]: (
    model: Full | string,
    options?: { modal?: string | null } & FetchPolicy
  ) => Promise<void>;
} & {
  [K in `merge${Capitalize<T>}`]: (model: Full | string, data: Partial<Full>, options?: FetchPolicy) => Promise<void>;
} & {
  [K in `view${Capitalize<T>}`]: (
    model: Full | string,
    options?: { modal?: string | null } & FetchPolicy
  ) => Promise<void>;
} & { [K in `set${Capitalize<T>}`]: (model: Full | Light) => void } & {
  [K in `reset${Capitalize<T>}`]: (model?: Full) => void;
};
type SliceAction<
  T extends string,
  Input,
  Full extends { id: string },
  Light,
  QueryArgs extends any[],
  Filter extends FilterType,
  Suffix extends string = "",
> = {
  [K in `init${Capitalize<T>}${Suffix}`]: (
    ...args: [...args: QueryArgs, initForm?: FetchInitForm<Input, Full, Filter> & FetchPolicy]
  ) => Promise<void>;
} & {
  [K in `refresh${Capitalize<T>}${Suffix}`]: (
    ...args: [...args: QueryArgs, initForm?: FetchInitForm<Input, Full, Filter> & FetchPolicy]
  ) => Promise<void>;
} & {
  [K in `select${Capitalize<T>}${Suffix}`]: (
    model: Light | Light[],
    options?: { refresh?: boolean; remove?: boolean }
  ) => void;
} & {
  [K in `setPageOf${Capitalize<T>}${Suffix}`]: (page: number, options?: FetchPolicy) => Promise<void>;
} & {
  [K in `addPageOf${Capitalize<T>}${Suffix}`]: (page: number, options?: FetchPolicy) => Promise<void>;
} & {
  [K in `setLimitOf${Capitalize<T>}${Suffix}`]: (limit: number, options?: FetchPolicy) => Promise<void>;
} & {
  [K in `setQueryArgsOf${Capitalize<T>}${Suffix}`]: (
    ...args: [...args: QueryArgs, options?: FetchPolicy]
  ) => Promise<void>;
} & {
  [K in `setSortOf${Capitalize<T>}${Suffix}`]: (sort: SortOf<Filter>, options?: FetchPolicy) => Promise<void>;
};

type DefaultActions<
  T extends string,
  Input,
  Full extends { id: string },
  Light,
  Filter extends FilterType,
  Fetch,
  Signal,
> = BaseAction<T, Input, Full, Light> &
  FormSetter<Full, T> &
  SliceAction<T, Input, Full, Light, [query: QueryOf<DocumentModel<Full>>], Filter> &
  UnionToIntersection<
    MergeFields<{
      [K in keyof Signal as K extends `${T}List${infer Suffix}` ? K : never]: K extends `${T}List${infer Suffix}`
        ? Signal[K] extends (...args: infer Args) => Promise<Full[]>
          ? SliceAction<T, Input, Full, Light, FilterListArgs<Args, Filter>, Filter, Suffix>
          : never
        : never;
    }>
  >;

export const createActions = <
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Insight,
  Filter extends FilterType,
  Fetch,
  Signal,
>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>
): DefaultActions<T, Input, Full, Light, Filter, Fetch, Signal> => {
  const formSetterActions = makeFormSetter<T, Input, Full, Light, Insight, Filter, Fetch, Signal>(gql);
  const baseActions = makeActions<T, Input, Full, Light, Insight, Filter, Fetch, Signal>(gql);
  return { ...formSetterActions, ...baseActions } as unknown as DefaultActions<
    T,
    Input,
    Full,
    Light,
    Filter,
    Fetch,
    Signal
  >;
};

type SingleOf<M> = M extends (infer V)[] ? V : never;
type SetterKey<
  Prefix extends string,
  K extends string,
  S extends string,
> = `${Prefix}${Capitalize<K>}On${Capitalize<S>}`;
type FormSetter<Full, S extends string> = {
  [K in keyof Full as Full[K] extends (...args: any) => any ? never : SetterKey<"set", string & K, S>]: (
    value?: FieldState<Full[K]>
  ) => void;
} & {
  [K in keyof Full as Full[K] extends any[] ? SetterKey<"add", string & K, S> : never]: (
    value: DefaultOf<SingleOf<Full[K]>> | DefaultOf<SingleOf<Full[K]>>[],
    options?: { idx?: number; limit?: number }
  ) => void;
} & {
  [K in keyof Full as Full[K] extends any[] ? SetterKey<"sub", string & K, S> : never]: (
    idx: number | number[]
  ) => void;
} & {
  [K in keyof Full as Full[K] extends any[] ? SetterKey<"addOrSub", string & K, S> : never]: (
    value: SingleOf<Full[K]>,
    options?: { idx?: number; limit?: number }
  ) => void;
} & {
  [K in keyof Full as Full[K] extends (ProtoFile | null) | ProtoFile[] ? SetterKey<"upload", string & K, S> : never]: (
    fileList: FileList,
    idx?: number
  ) => Promise<void>;
} & {
  [K in `writeOn${Capitalize<S>}`]: (path: string | (string | number)[], value: any) => void;
};

const makeFormSetter = <T extends string, Input, Full, Light, Insight, Filter extends FilterType, Fetch, Signal>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>
): FormSetter<Full, T> => {
  const fileGql = getGqlOnStorage("file");
  const [fieldName, className] = [lowerlize(gql.refName), capitalize(gql.refName)];
  const modelRef = getFullModelRef(gql.refName);
  const fieldMetas = getFieldMetas(modelRef);
  const names = {
    model: fieldName,
    Model: className,
    modelForm: `${fieldName}Form`,
    writeOnModel: `writeOn${className}`,
    addModelFiles: `add${className}Files`,
  };
  const baseSetAction = {
    [names.writeOnModel]: function (this: SetGet<any>, path: string | (string | number)[], value: any) {
      this.set((state: { [key: string]: any }) => {
        pathSet(state[names.modelForm], path, value);
      });
    },
  };
  const fieldSetAction = fieldMetas.reduce((acc, fieldMeta) => {
    const [fieldKeyName, classKeyName] = [lowerlize(fieldMeta.key), capitalize(fieldMeta.key)];
    const namesOfField = {
      field: fieldKeyName,
      Field: classKeyName,
      setFieldOnModel: `set${classKeyName}On${className}`,
      addFieldOnModel: `add${classKeyName}On${className}`,
      subFieldOnModel: `sub${classKeyName}On${className}`,
      addOrSubFieldOnModel: `addOrSub${classKeyName}On${className}`,
      uploadFieldOnModel: `upload${classKeyName}On${className}`,
    };
    const singleFieldSetAction = {
      [namesOfField.setFieldOnModel]: function (this: SetGet<any>, value: any) {
        this.set((state: { [key: string]: any }) => {
          (state[names.modelForm] as { [key: string]: any })[namesOfField.field] = value as object;
        });
      },
      ...(fieldMeta.isArray
        ? {
            [namesOfField.addFieldOnModel]: function (
              this: SetGet<any>,
              value: Light | Light[],
              options: { idx?: number; limit?: number } = {}
            ) {
              const form = (this.get() as { [key: string]: any })[names.modelForm] as { [key: string]: any };
              const length = (form[namesOfField.field] as any[]).length;
              if (options.limit && options.limit <= length) return;
              const idx = options.idx ?? length;
              this.set((state: { [key: string]: any }) => {
                (state[names.modelForm] as { [key: string]: any })[namesOfField.field] = [
                  ...(form[namesOfField.field] as object[]).slice(0, idx),
                  ...(Array.isArray(value) ? value : [value]),
                  ...(form[namesOfField.field] as object[]).slice(idx),
                ];
              });
            },
            [namesOfField.subFieldOnModel]: function (this: SetGet<any>, idx: number | number[]) {
              const form = (this.get() as { [key: string]: any })[names.modelForm] as { [key: string]: object[] };
              this.set((state: { [key: string]: any }) => {
                (state[names.modelForm] as { [key: string]: any })[namesOfField.field] =
                  typeof idx === "number"
                    ? form[namesOfField.field].filter((_, i) => i !== idx)
                    : form[namesOfField.field].filter((_, i) => !idx.includes(i));
              });
            },
            [namesOfField.addOrSubFieldOnModel]: function (
              this: SetGet<any>,
              value: any,
              options: { idx?: number; limit?: number } = {}
            ) {
              const { [names.modelForm]: form } = this.get() as { [key: string]: { [key: string]: any[] } };
              const index = form[namesOfField.field].findIndex((v) => v === value);
              index === -1
                ? (this[namesOfField.addFieldOnModel] as (...args: any) => void)(value, options)
                : (this[namesOfField.subFieldOnModel] as (...args: any) => void)(index);
            },
          }
        : {}),
      ...(fieldMeta.name === "File"
        ? {
            [namesOfField.uploadFieldOnModel]: async function (this: SetGet<any>, fileList: FileList, index?: number) {
              const form = (this.get() as { [key: string]: any })[names.modelForm] as { [key: string]: any };
              if (!fileList.length) return;
              const files = await (gql[names.addModelFiles] as (...args: any) => Promise<ProtoFile[]>)(
                fileList,
                form.id
              );
              if (fieldMeta.isArray) {
                const idx = index ?? (form[namesOfField.field] as ProtoFile[]).length;
                this.set((state: { [key: string]: { [key: string]: ProtoFile[] } }) => {
                  state[names.modelForm][namesOfField.field] = [
                    ...(form[namesOfField.field] as ProtoFile[]).slice(0, idx),
                    ...files,
                    ...(form[namesOfField.field] as ProtoFile[]).slice(idx),
                  ];
                });
              } else {
                this.set((state: { [key: string]: { [key: string]: ProtoFile | null } }) => {
                  state[names.modelForm][namesOfField.field] = files[0];
                });
              }
              files.map((file) => {
                const intervalKey = setInterval(() => {
                  void (async () => {
                    const currentFile = await (fileGql.file as (id: string) => Promise<ProtoFile>)(file.id);
                    if (fieldMeta.isArray)
                      this.set((state: { [key: string]: { [key: string]: ProtoFile[] } }) => {
                        state[names.modelForm][namesOfField.field] = state[names.modelForm][namesOfField.field].map(
                          (file) => (file.id === currentFile.id ? currentFile : file)
                        );
                      });
                    else
                      this.set((state: { [key: string]: { [key: string]: ProtoFile | null } }) => {
                        state[names.modelForm][namesOfField.field] = currentFile;
                      });
                    if (currentFile.status !== "uploading") clearInterval(intervalKey);
                  })();
                }, 3000);
              });
            },
          }
        : {}),
    };
    return Object.assign(acc, singleFieldSetAction);
  }, {});
  return Object.assign(fieldSetAction, baseSetAction) as unknown as FormSetter<Full, T>;
};

const makeActions = <
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Insight,
  Filter extends FilterType,
  Fetch,
  Signal,
>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>
): DefaultActions<T, Input, Full, Light, Filter, Fetch, Signal> => {
  type Sort = SortOf<Filter>;
  const [fieldName, className] = [lowerlize(gql.refName), capitalize(gql.refName)];
  const modelRef = getFullModelRef(className);
  const lightModelRef = getLightModelRef(modelRef);
  const names = {
    model: fieldName,
    _model: `_${fieldName}`,
    Model: className,
    modelList: `${fieldName}List`,
    purifyModel: `purify${className}`,
    crystalizeModel: `crystalize${className}`,
    lightCrystalizeModel: `lightCrystalize${className}`,
    crystalizeInsight: `crystalize${className}Insight`,
    modelOperation: `${fieldName}Operation`,
    defaultModel: `default${className}`,
    modelInsight: `${fieldName}Insight`,
    modelForm: `${fieldName}Form`,
    modelSubmit: `${fieldName}Submit`,
    modelLoading: `${fieldName}Loading`,
    modelFormLoading: `${fieldName}FormLoading`,
    modelMap: `${fieldName}Map`,
    modelMapLoading: `${fieldName}MapLoading`,
    modelSelection: `${fieldName}Selection`,
    createModelInForm: `create${className}InForm`,
    updateModelInForm: `modify${className}InForm`,
    createModel: `create${className}`,
    updateModel: `update${className}`,
    removeModel: `remove${className}`,
    checkModelSubmitable: `check${className}Submitable`,
    submitModel: `submit${className}`,
    newModel: `new${className}`,
    editModel: `edit${className}`,
    mergeModel: `merge${className}`,
    viewModel: `view${className}`,
    setModel: `set${className}`,
    resetModel: `reset${className}`,
    modelViewAt: `${fieldName}ViewAt`,
    modelModal: `${fieldName}Modal`,
    initModel: `init${className}`,
    modelInitMap: `${fieldName}InitMap`,
    modelInitAt: `${fieldName}InitAt`,
    refreshModel: `refresh${className}`,
    selectModel: `select${className}`,
    setPageOfModel: `setPageOf${className}`,
    addPageOfModel: `addPageOf${className}`,
    setLimitOfModel: `setLimitOf${className}`,
    setQueryArgsOfModel: `setQueryArgsOf${className}`,
    setSortOfModel: `setSortOf${className}`,
    lastPageOfModel: `lastPageOf${className}`,
    pageOfModel: `pageOf${className}`,
    limitOfModel: `limitOf${className}`,
    queryArgsOfModel: `queryArgsOf${className}`,
    sortOfModel: `sortOf${className}`,
  };
  const baseAction = {
    [names.createModelInForm]: async function (
      this: SetGet<any>,
      { idx, path, modal, sliceName = names.model, onError, onSuccess }: CreateOption<Full> = {}
    ) {
      const SliceName = capitalize(sliceName);
      const namesOfSlice = {
        defaultModel: SliceName.replace(names.Model, names.defaultModel),
        modelMap: sliceName.replace(names.model, names.modelMap),
        modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        modelInsight: sliceName.replace(names.model, names.modelInsight),
      };
      const currentState = this.get() as { [key: string]: any };
      const modelForm = currentState[names.modelForm] as Input;
      const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
      const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
      const modelInsight = currentState[namesOfSlice.modelInsight] as Insight & { count: number };
      const defaultModel = currentState[namesOfSlice.defaultModel] as Full;
      const modelInput = (gql[names.purifyModel] as (form: any) => DefaultOf<Input> | null)(modelForm);
      if (!modelInput) return;
      this.set({ [names.modelLoading]: true });
      const model = await (gql[names.createModel] as (...args) => Promise<Full>)(modelInput, { onError });
      const modelList = [...modelMap.entries()];
      const newModelMap = modelMapLoading
        ? modelMap
        : new Map([...modelList.slice(0, idx ?? 0), [model.id, model], ...modelList.slice(idx ?? 0)] as [
            string,
            Light,
          ][]);
      const newModelInsight = (gql[names.crystalizeInsight] as (obj) => Insight)({
        ...modelInsight,
        count: modelInsight.count + 1,
      });
      this.set({
        [names.modelForm]: defaultModel,
        [names.model]: model,
        [names.modelLoading]: false,
        [namesOfSlice.modelMap]: newModelMap,
        [namesOfSlice.modelInsight]: newModelInsight,
        [names.modelViewAt]: new Date(),
        [names.modelModal]: modal ?? null,
        ...(typeof path === "string" && path ? { [path]: model } : {}),
      });
      await onSuccess?.(model);
    },
    [names.updateModelInForm]: async function (
      this: SetGet<any>,
      { path, modal, sliceName = names.model, onError, onSuccess }: CreateOption<Full> = {}
    ) {
      const SliceName = capitalize(sliceName);
      const namesOfSlice = {
        defaultModel: SliceName.replace(names.Model, names.defaultModel),
      };
      const currentState = this.get() as { [key: string]: any };
      const model = currentState[names.model] as Full | null;
      const modelForm = currentState[names.modelForm] as Input & { id: string };
      const defaultModel = currentState[namesOfSlice.defaultModel] as Input;
      const modelInput = (gql[names.purifyModel] as (form) => DefaultOf<Input> | null)(modelForm);
      if (!modelInput) return;
      if (model?.id === modelForm.id) this.set({ [names.modelLoading]: modelForm.id });
      const updatedModel = await (gql[names.updateModel] as (...args) => Promise<Full>)(modelForm.id, modelInput, {
        onError,
      });
      this.set({
        ...(model?.id === updatedModel.id
          ? { [names.model]: updatedModel, [names.modelLoading]: false, [names.modelViewAt]: new Date() }
          : {}),
        [names.modelForm]: defaultModel,
        [names.modelModal]: modal ?? null,
        ...(typeof path === "string" && path ? { [path]: updatedModel } : {}),
      });
      const updatedLightModel = (gql[names.lightCrystalizeModel] as (obj) => Light)(updatedModel);
      gql.slices.forEach(({ sliceName }) => {
        const namesOfSlice = {
          modelMap: sliceName.replace(names.model, names.modelMap),
          modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        };
        const currentState = this.get() as { [key: string]: any };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
        if (modelMapLoading || !modelMap.has(updatedModel.id)) return;
        const newModelMap = new Map(modelMap).set(updatedModel.id, updatedLightModel);
        this.set({ [namesOfSlice.modelMap]: newModelMap });
      });
      await onSuccess?.(updatedModel);
    },
    [names.createModel]: async function (
      this: SetGet<any>,
      data: GetStateObject<Input>,
      { idx, path, modal, sliceName = names.model, onError, onSuccess }: CreateOption<Full> = {}
    ) {
      const SliceName = capitalize(sliceName);
      const namesOfSlice = {
        defaultModel: SliceName.replace(names.Model, names.defaultModel),
        modelMap: sliceName.replace(names.model, names.modelMap),
        modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        modelInsight: sliceName.replace(names.model, names.modelInsight),
      };
      const currentState = this.get() as { [key: string]: any };
      const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
      const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
      const modelInsight = currentState[namesOfSlice.modelInsight] as Insight & { count: number };
      const modelInput = (gql[names.purifyModel] as (data: any) => Input | null)(data);
      if (!modelInput) return;
      this.set({ [names.modelLoading]: true });
      const model = await (gql[names.createModel] as (...args: any[]) => Promise<Full>)(modelInput, { onError });
      const modelList = [...modelMap.entries()];
      const newModelMap = modelMapLoading
        ? modelMap
        : new Map([...modelList.slice(0, idx ?? 0), [model.id, model], ...modelList.slice(idx ?? 0)] as [
            string,
            Light,
          ][]);
      const newModelInsight = (gql[names.crystalizeInsight] as (obj) => Insight)({
        ...modelInsight,
        count: modelInsight.count + 1,
      });
      this.set({
        [names.model]: model,
        [names.modelLoading]: false,
        [namesOfSlice.modelMap]: newModelMap,
        [namesOfSlice.modelInsight]: newModelInsight,
        [names.modelViewAt]: new Date(),
        [names.modelModal]: modal ?? null,
        ...(typeof path === "string" && path ? { [path]: model } : {}),
      });
      await onSuccess?.(model);
    },
    [names.updateModel]: async function (
      this: SetGet<any>,
      id: string,
      data: GetStateObject<Input>,
      { idx, path, modal, sliceName = names.model, onError, onSuccess }: CreateOption<Full> = {}
    ) {
      const currentState = this.get() as { [key: string]: any };
      const model = currentState[names.model] as Full | null;
      const modelInput = (gql[names.purifyModel] as (data) => DefaultOf<Input> | null)(data);
      if (!modelInput) return;
      if (model?.id === id) this.set({ [names.modelLoading]: id });
      const updatedModel = await (gql[names.updateModel] as (...args) => Promise<Full>)(id, modelInput, { onError });
      this.set({
        ...(model?.id === updatedModel.id
          ? { [names.model]: updatedModel, [names.modelLoading]: false, [names.modelViewAt]: new Date() }
          : {}),
        [names.modelModal]: modal ?? null,
        ...(typeof path === "string" && path ? { [path]: updatedModel } : {}),
      });
      const updatedLightModel = (gql[names.lightCrystalizeModel] as (obj) => Light)(updatedModel);
      gql.slices.forEach(({ sliceName }) => {
        const namesOfSlice = {
          modelMap: sliceName.replace(names.model, names.modelMap),
          modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        };
        const currentState = this.get() as { [key: string]: any };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
        if (modelMapLoading || !modelMap.has(updatedModel.id)) return;
        const newModelMap = new Map(modelMap).set(updatedModel.id, updatedLightModel);
        this.set({ [namesOfSlice.modelMap]: newModelMap });
      });
      await onSuccess?.(updatedModel);
    },
    [names.removeModel]: async function (
      this: SetGet<any>,
      id: string,
      options?: FetchPolicy & { modal?: string | null }
    ) {
      const { modal, ...fetchPolicyOptions } = options ?? {};
      const model = await (gql[names.removeModel] as (...args) => Promise<Full & { removedAt: Dayjs | null }>)(
        id,
        fetchPolicyOptions
      );
      const lightModel = (gql[names.lightCrystalizeModel] as (obj) => Light)(model);
      gql.slices.forEach(({ sliceName }) => {
        const namesOfSlice = {
          modelMap: sliceName.replace(names.model, names.modelMap),
          modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
          modelSelection: sliceName.replace(names.model, names.modelSelection),
          modelInsight: sliceName.replace(names.model, names.modelInsight),
          modelModal: sliceName.replace(names.model, names.modelModal),
        };
        const currentState = this.get() as { [key: string]: any };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
        const modelSelection = currentState[namesOfSlice.modelSelection] as Map<string, Light>;
        const modelInsight = currentState[namesOfSlice.modelInsight] as Insight & { count: number };
        if (modelMapLoading || !modelMap.has(model.id)) return;
        const newModelMap = new Map(modelMap);
        if (model.removedAt) {
          newModelMap.delete(id);
          const newModelInsight = (gql[names.crystalizeInsight] as (obj) => Full)({
            ...modelInsight,
            count: modelInsight.count - 1,
          });
          const newModelSelection = new Map(modelSelection);
          newModelSelection.delete(id);
          this.set({
            [namesOfSlice.modelMap]: newModelMap,
            [namesOfSlice.modelInsight]: newModelInsight,
            ...(modelSelection.has(model.id) ? { [namesOfSlice.modelSelection]: newModelSelection } : {}),
            ...(modal !== undefined ? { [namesOfSlice.modelModal]: modal } : {}),
          });
        } else {
          newModelMap.set(id, lightModel);
          this.set({
            [namesOfSlice.modelMap]: newModelMap,
            ...(modal !== undefined ? { [namesOfSlice.modelModal]: modal } : {}),
          });
        }
      });
    },
    [names.checkModelSubmitable]: function (this: SetGet<any>, disabled?: boolean) {
      const currentState = this.get() as { [key: string]: any };
      const modelForm = currentState[names.modelForm] as Input;
      const modelSubmit = currentState[names.modelSubmit] as { disabled: boolean };
      const modelInput = (gql[names.purifyModel] as (obj) => DefaultOf<Input> | null)(modelForm);
      this.set({ [names.modelSubmit]: { ...modelSubmit, disabled: !modelInput || disabled } });
    },
    [names.submitModel]: async function (this: SetGet<any>, option?: CreateOption<Full>) {
      const currentState = this.get() as { [key: string]: any };
      const modelForm = currentState[names.modelForm] as Input & { id: string };
      const modelSubmit = currentState[names.modelSubmit] as { loading: boolean; times: number };
      this.set({ [names.modelSubmit]: { ...modelSubmit, loading: true } });
      modelForm.id
        ? await (this[names.updateModelInForm] as (...args) => Promise<Full>)(option)
        : await (this[names.createModelInForm] as (...args) => Promise<Full>)(option);
      this.set({ [names.modelSubmit]: { ...modelSubmit, loading: false, times: modelSubmit.times + 1 } });
    },
    [names.newModel]: function (
      this: SetGet<any>,
      partial: Partial<Full> = {},
      { modal, setDefault, sliceName = names.model }: NewOption = {}
    ) {
      const SliceName = capitalize(sliceName);
      const namesOfSlice = {
        defaultModel: SliceName.replace(names.Model, names.defaultModel),
      };
      const currentState = this.get() as { [key: string]: any };
      const defaultModel = currentState[namesOfSlice.defaultModel] as Full;
      this.set({
        [names.modelForm]: { ...defaultModel, ...partial },
        [namesOfSlice.defaultModel]: setDefault ? { ...defaultModel, ...partial } : defaultModel,
        [names.model]: null,
        [names.modelModal]: modal ?? "edit",
        [names.modelFormLoading]: false,
      });
    },
    [names.editModel]: async function (
      this: SetGet<any>,
      modelOrId: Full | string,
      { modal, onError }: { modal?: string | null } & FetchPolicy = {}
    ) {
      const id = typeof modelOrId === "string" ? modelOrId : modelOrId.id;
      this.set({ [names.modelFormLoading]: id, [names.modelModal]: modal ?? "edit" });
      this.set((state: { [key: string]: { [key: string]: any } }) => {
        state[names.modelForm].id = id;
      });
      const model = await (gql[names.model] as (...args) => Promise<Full>)(id, { onError });
      const modelForm = deepObjectify<Input>(model as unknown as Input);
      this.set({
        [names.model]: model,
        [names.modelFormLoading]: false,
        [names.modelViewAt]: new Date(),
        [names.modelForm]: modelForm,
      });
    },
    [names.mergeModel]: async function (
      this: SetGet<any>,
      modelOrId: Full | string,
      data: Partial<Full>,
      options?: FetchPolicy
    ) {
      const id = typeof modelOrId === "string" ? modelOrId : modelOrId.id;
      const currentState = this.get() as { [key: string]: any };
      const model = currentState[names.model] as Full | null;
      if (id === model?.id) this.set({ modelLoading: id });
      const updatedModel = await (gql[names.mergeModel] as (...args) => Promise<Full>)(modelOrId, data, options);
      this.set({
        [names.model]: id === model?.id ? updatedModel : model,
        [names.modelLoading]: false,
      });
      const updatedLightModel = (gql[names.lightCrystalizeModel] as (obj) => Light)(updatedModel);
      gql.slices.forEach(({ sliceName }) => {
        const namesOfSlice = {
          modelMap: sliceName.replace(names.model, names.modelMap),
          modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        };
        const currentState = this.get() as { [key: string]: any };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
        if (modelMapLoading || !modelMap.has(updatedModel.id)) return;
        const newModelMap = new Map(modelMap).set(updatedModel.id, updatedLightModel);
        this.set({ [namesOfSlice.modelMap]: newModelMap });
      });
    },
    [names.viewModel]: async function (
      this: SetGet<any>,
      modelOrId: Full | string,
      { modal, onError }: { modal?: string | null } & FetchPolicy = {}
    ) {
      const id = typeof modelOrId === "string" ? modelOrId : modelOrId.id;
      this.set({ [names.modelModal]: modal ?? "view", [names.modelLoading]: id });
      const model = await (gql[names.model] as (...args) => Promise<Full>)(id, { onError });
      this.set({ [names.model]: model, [names.modelViewAt]: new Date(), [names.modelLoading]: false });
    },
    [names.setModel]: function (this: SetGet<any>, fullOrLightModel: Full | Light) {
      const currentState = this.get() as { [key: string]: any };
      const model = currentState[names.model] as Full | null;
      const isFull = fullOrLightModel instanceof modelRef;
      if (isFull) {
        const crystalizedModel = (gql[names.crystalizeModel] as (obj) => Full)(fullOrLightModel);
        this.set({ [names.model]: crystalizedModel });
      } else if (model?.id === fullOrLightModel.id) {
        const crystalizedModel = (gql[names.crystalizeModel] as (obj) => Full)({ ...model, ...fullOrLightModel });
        this.set({ [names.model]: crystalizedModel });
      }
      const lightModel = (gql[names.lightCrystalizeModel] as (obj) => Light)(fullOrLightModel);
      gql.slices.forEach(({ sliceName }) => {
        const namesOfSlice = {
          modelMap: sliceName.replace(names.model, names.modelMap),
          modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const modelMapLoading = currentState[namesOfSlice.modelMapLoading] as boolean;
        if (modelMapLoading || !modelMap.has(lightModel.id)) return;
        this.set({ [namesOfSlice.modelMap]: new Map(modelMap).set(lightModel.id, lightModel) });
      });
    },
    [names.resetModel]: function (this: SetGet<any>, model?: Full) {
      const currentState = this.get() as { [key: string]: any };
      const defaultModel = currentState[names.defaultModel] as Full;
      this.set({
        [names.model]: model ?? null,
        [names.modelViewAt]: new Date(0),
        [names.modelForm]: defaultModel,
        [names.modelModal]: null,
      });
      return model ?? null;
    },
  };
  const sliceAction = gql.slices.reduce((acc, { sliceName, argLength }) => {
    const SliceName = capitalize(sliceName);
    const namesOfSlice: { [key in SliceActionKey | SliceStateKey | "modelList"]: string } = {
      defaultModel: SliceName.replace(names.Model, names.defaultModel),
      modelList: sliceName.replace(names.model, names.modelList),
      modelInsight: sliceName.replace(names.model, names.modelInsight),
      modelMap: sliceName.replace(names.model, names.modelMap),
      modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
      initModel: SliceName.replace(names.Model, names.initModel),
      modelInitMap: SliceName.replace(names.Model, names.modelInitMap),
      modelInitAt: SliceName.replace(names.Model, names.modelInitAt),
      refreshModel: SliceName.replace(names.Model, names.refreshModel),
      selectModel: SliceName.replace(names.Model, names.selectModel),
      setPageOfModel: SliceName.replace(names.Model, names.setPageOfModel),
      addPageOfModel: SliceName.replace(names.Model, names.addPageOfModel),
      setLimitOfModel: SliceName.replace(names.Model, names.setLimitOfModel),
      setQueryArgsOfModel: SliceName.replace(names.Model, names.setQueryArgsOfModel),
      setSortOfModel: SliceName.replace(names.Model, names.setSortOfModel),
      lastPageOfModel: SliceName.replace(names.Model, names.lastPageOfModel),
      pageOfModel: SliceName.replace(names.Model, names.pageOfModel),
      limitOfModel: SliceName.replace(names.Model, names.limitOfModel),
      queryArgsOfModel: SliceName.replace(names.Model, names.queryArgsOfModel),
      sortOfModel: SliceName.replace(names.Model, names.sortOfModel),
      modelSelection: SliceName.replace(names.Model, names.modelSelection),
    };
    const singleSliceAction = {
      [namesOfSlice.initModel]: async function (
        this: SetGet<any>,
        ...args: [...args: any[], initForm: FetchInitForm<Input, Full, Filter> & FetchPolicy]
      ) {
        const initArgLength = Math.min(args.length, argLength);
        const initForm = { invalidate: false, ...(args[argLength] ?? {}) } as FetchInitForm<Input, Full, Filter> &
          FetchPolicy;
        const queryArgs = new Array(initArgLength).fill(null).map((_, i) => args[i] as object);
        const defaultModel = { ...gql[names.defaultModel], ...(initForm.default ?? {}) } as Input;
        this.set({ [names.defaultModel]: defaultModel });
        await (this[namesOfSlice.refreshModel] as (...args) => Promise<void>)(
          ...(initArgLength === argLength ? [...queryArgs, initForm] : queryArgs)
        );
      },
      [namesOfSlice.refreshModel]: async function (
        this: SetGet<any>,
        ...args: [...args: any[], initForm: FetchInitForm<Input, Full, Filter> & FetchPolicy]
      ) {
        const refreshArgLength = Math.min(args.length, argLength);
        const currentState = this.get() as { [key: string]: any };
        const existingQueryArgs = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const queryArgs = [
          ...new Array(refreshArgLength).fill(null).map((_, i) => args[i] as object),
          ...existingQueryArgs.slice(refreshArgLength, argLength),
        ];
        const initForm = (args[argLength] ?? {}) as FetchInitForm<Input, Full, Filter> & FetchPolicy;
        const {
          page = currentState[namesOfSlice.pageOfModel] as number,
          limit = currentState[namesOfSlice.limitOfModel] as number,
          sort = currentState[namesOfSlice.sortOfModel] as Sort,
          invalidate = true,
        } = initForm;
        const modelOperation = currentState[names.modelOperation] as string;
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const pageOfModel = currentState[namesOfSlice.pageOfModel] as number;
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (
          !invalidate &&
          !["sleep", "reset"].includes(modelOperation) &&
          isQueryEqual(queryArgs, queryArgsOfModel) &&
          page === pageOfModel &&
          limit === limitOfModel &&
          isQueryEqual(sort as unknown as object, sortOfModel as unknown as object)
        )
          return; // store-level cache hit
        else this.set({ [namesOfSlice.modelMapLoading]: true });
        const [modelList, modelInsight] = await Promise.all([
          (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
            ...queryArgs,
            (page - 1) * limit,
            limit,
            sort,
            { onError: initForm.onError }
          ),
          (gql[namesOfSlice.modelInsight] as (...args) => Promise<Insight & { count: number }>)(...queryArgs, {
            onError: initForm.onError,
          }),
        ]);
        const modelMap = new Map();
        modelList.forEach((model) => modelMap.set(model.id, model));
        this.set({
          [namesOfSlice.modelMap]: modelMap,
          [namesOfSlice.modelMapLoading]: false,
          [namesOfSlice.modelInsight]: modelInsight,
          [namesOfSlice.modelInitMap]: modelMap,
          [namesOfSlice.modelInitAt]: new Date(),
          [namesOfSlice.lastPageOfModel]: Math.max(Math.floor((modelInsight.count - 1) / limit) + 1, 1),
          [namesOfSlice.limitOfModel]: limit,
          [namesOfSlice.queryArgsOfModel]: queryArgs,
          [namesOfSlice.sortOfModel]: sort,
          [namesOfSlice.pageOfModel]: page,
          [names.modelOperation]: "idle",
        });
      },
      [namesOfSlice.selectModel]: function (
        this: SetGet<any>,
        model: Light | Light[],
        { refresh, remove }: { refresh?: boolean; remove?: boolean } = {}
      ) {
        const models = Array.isArray(model) ? model : [model];
        const currentState = this.get() as { [key: string]: any };
        const modelSelection = currentState[namesOfSlice.modelSelection] as Map<string, Light>;
        if (refresh) this.set({ [namesOfSlice.modelSelection]: new Map(models.map((model) => [model.id, model])) });
        else if (remove) {
          const newModelSelection = new Map(modelSelection);
          models.map((model) => newModelSelection.delete(model.id));
          this.set({ [namesOfSlice.modelSelection]: newModelSelection });
        } else {
          const newModelSelection = new Map(modelSelection);
          models.map((model) => newModelSelection.set(model.id, model));
          this.set({ [namesOfSlice.modelSelection]: newModelSelection });
        }
      },
      [namesOfSlice.setPageOfModel]: async function (this: SetGet<any>, page: number, options?: FetchPolicy) {
        const currentState = this.get() as { [key: string]: any };
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const pageOfModel = currentState[namesOfSlice.pageOfModel] as number;
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (pageOfModel === page) return;
        this.set({ [namesOfSlice.modelMapLoading]: true });
        const modelList = await (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
          ...queryArgsOfModel,
          (page - 1) * limitOfModel,
          limitOfModel,
          sortOfModel,
          options
        );
        const modelMap = new Map();
        modelList.forEach((item) => modelMap.set(item.id, item));
        this.set({
          [namesOfSlice.modelMap]: modelMap,
          [namesOfSlice.pageOfModel]: page,
          [namesOfSlice.modelMapLoading]: false,
        });
      },
      [namesOfSlice.addPageOfModel]: async function (this: SetGet<any>, page: number, options?: FetchPolicy) {
        const currentState = this.get() as { [key: string]: any };
        const modelMap = currentState[namesOfSlice.modelMap] as Map<string, Light>;
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const pageOfModel = currentState[namesOfSlice.pageOfModel] as number;
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (pageOfModel === page) return;
        const addFront = page < pageOfModel;
        const modelList = await (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
          ...queryArgsOfModel,
          (page - 1) * limitOfModel,
          limitOfModel,
          sortOfModel,
          options
        );
        const newModelMap = new Map();
        (addFront ? [...modelList, ...modelMap.values()] : [...modelMap.values(), ...modelList]).forEach((model) =>
          newModelMap.set(model.id, model)
        );
        this.set({ [namesOfSlice.modelMap]: newModelMap, [namesOfSlice.pageOfModel]: page });
      },
      [namesOfSlice.setLimitOfModel]: async function (this: SetGet<any>, limit: number, options?: FetchPolicy) {
        const currentState = this.get() as { [key: string]: any };
        const modelInsight = currentState[namesOfSlice.modelInsight] as Insight & { count: number };
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const pageOfModel = currentState[namesOfSlice.pageOfModel] as number;
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (limitOfModel === limit) return;
        const skip = (pageOfModel - 1) * limitOfModel;
        const page = Math.max(Math.floor((skip - 1) / limit) + 1, 1);
        const modelList = await (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
          ...queryArgsOfModel,
          (page - 1) * limit,
          limit,
          sortOfModel,
          options
        );
        const modelMap = new Map();
        modelList.forEach((model) => modelMap.set(model.id, model));
        this.set({
          [namesOfSlice.modelMap]: modelMap,
          [namesOfSlice.lastPageOfModel]: Math.max(Math.floor((modelInsight.count - 1) / limit) + 1, 1),
          [namesOfSlice.limitOfModel]: limit,
          [namesOfSlice.pageOfModel]: page,
        });
      },
      [namesOfSlice.setQueryArgsOfModel]: async function (
        this: SetGet<any>,
        ...args: [...queryArgs: any, options?: FetchPolicy]
      ) {
        const queryArgs = new Array(argLength).fill(null).map((_, i) => args[i] as object);
        const options = args[argLength] as FetchPolicy | undefined;
        const currentState = this.get() as { [key: string]: any };
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (isQueryEqual(queryArgsOfModel, queryArgs)) {
          Logger.trace(`${namesOfSlice.queryArgsOfModel} store-level cache hit`);
          return; // store-level cache hit
        }
        this.set({ [namesOfSlice.modelMapLoading]: true });
        const [modelList, modelInsight] = await Promise.all([
          (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
            ...queryArgs,
            0,
            limitOfModel,
            sortOfModel,
            options
          ),
          (gql[namesOfSlice.modelInsight] as (...args) => Promise<Insight & { count: number }>)(...queryArgs, options),
        ]);
        const modelMap = new Map();
        modelList.forEach((model) => modelMap.set(model.id, model));
        this.set({
          [namesOfSlice.queryArgsOfModel]: queryArgs,
          [namesOfSlice.modelMap]: modelMap,
          [namesOfSlice.modelInsight]: modelInsight,
          [namesOfSlice.lastPageOfModel]: Math.max(Math.floor((modelInsight.count - 1) / limitOfModel) + 1, 1),
          [namesOfSlice.pageOfModel]: 1,
          [namesOfSlice.modelSelection]: new Map(),
          [namesOfSlice.modelMapLoading]: false,
        });
      },
      [namesOfSlice.setSortOfModel]: async function (this: SetGet<any>, sort: Sort, options?: FetchPolicy) {
        const currentState = this.get() as { [key: string]: any };
        const queryArgsOfModel = currentState[namesOfSlice.queryArgsOfModel] as object[];
        const limitOfModel = currentState[namesOfSlice.limitOfModel] as number;
        const sortOfModel = currentState[namesOfSlice.sortOfModel] as Sort;
        if (sortOfModel === sort) return; // store-level cache hit
        this.set({ [namesOfSlice.modelMapLoading]: true });
        const modelList = await (gql[namesOfSlice.modelList] as (...args) => Promise<Light[]>)(
          ...queryArgsOfModel,
          0,
          limitOfModel,
          sort,
          options
        );
        const modelMap = new Map();
        modelList.forEach((model) => modelMap.set(model.id, model));
        this.set({
          [namesOfSlice.modelMap]: modelMap,
          [namesOfSlice.sortOfModel]: sort,
          [namesOfSlice.pageOfModel]: 1,
          [namesOfSlice.modelMapLoading]: false,
        });
      },
    };
    return Object.assign(acc, singleSliceAction);
  }, {});
  return { ...baseAction, ...sliceAction } as unknown as DefaultActions<T, Input, Full, Light, Filter, Fetch, Signal>;
};

export const stateOf = <
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Insight,
  Filter extends FilterType,
  Fetch,
  Signal,
  State extends { [key: string]: any },
>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>,
  state: State
) => {
  type ApplyState = State & DefaultState<T, Full, Light, Insight, Filter, Signal>;
  type ApplyAction = DefaultActions<T, Input, Full, Light, Filter, Fetch, Signal>;
  type SliceInfo = {
    [K in keyof Fetch as K extends `${T}List${infer Suffix}`
      ? `__SLICE__${T}${Suffix}`
      : never]: K extends `${T}List${infer Suffix}`
      ? Fetch[K] extends (
          ...args: [
            ...args: infer QueryArgs,
            skip: null | undefined,
            limit: null | undefined,
            sort: null | undefined,
            option?: FetchPolicy,
          ]
        ) => Promise<Light[]>
        ? StoreOf<
            T,
            RemoveSuffix<
              SliceState<T, Full, Light, QueryArgs, Insight, Filter, Suffix> &
                SliceAction<T, Input, Full, Light, QueryArgs, Filter, Suffix>,
              Suffix
            >
          >
        : never
      : never;
  };
  const applyState = Object.assign(createState(gql), state);
  const applyAction = createActions(gql);
  setStoreMeta(gql.refName, {
    refName: gql.refName,
    useKeys: Object.keys(applyState),
    doKeys: Object.keys(applyAction),
    slices: gql.slices,
  });
  const applyStore = { ...applyState, ...applyAction };

  class StateStore {
    readonly get: () => ApplyState;
    readonly set: (state: Partial<MakeState<ApplyState>> | ((state: MakeState<ApplyState>) => any)) => void;
    readonly pick: PickState<GetState<Mutate<StoreApi<MakeState<ApplyState>>, []>, "getState">>;
  }
  Object.keys(applyStore).forEach((key) =>
    Object.defineProperty(StateStore.prototype, key, { value: applyStore[key] as object })
  );
  return StateStore as Type<StateStore & ApplyState & ApplyAction & SliceInfo>;
};
export const scalarStateOf = <T extends string, State extends { [key: string]: any }>(
  refName: string,
  state: State
) => {
  const applyState = state;
  setStoreMeta(refName, { refName, useKeys: Object.keys(applyState), doKeys: [], slices: [] });
  class StateStore {
    readonly get: () => State;
    readonly set: (state: Partial<MakeState<State>> | ((state: MakeState<State>) => any)) => void;
    readonly pick: PickState<GetState<Mutate<StoreApi<MakeState<State>>, []>, "getState">>;
  }
  Object.keys(applyState).forEach((key) =>
    Object.defineProperty(StateStore.prototype, key, { value: applyState[key] as object })
  );
  return StateStore as Type<StateStore & State>;
};

interface StoreDecoratorInput {
  name: string;
}
export const Store = (returnsOrObj: (() => Type) | StoreDecoratorInput) => {
  const refName =
    typeof returnsOrObj === "object" ? returnsOrObj.name : lowerlize(getClassMeta(returnsOrObj()).refName);
  const storeMeta = getStoreMeta(refName);
  return function (target: Type) {
    const customDoKeys = Object.getOwnPropertyNames(target.prototype).filter((key) => key !== "constructor");
    setStoreMeta(refName, { ...storeMeta, doKeys: [...storeMeta.doKeys, ...customDoKeys] });
  };
};

type SetKey<T extends string> = `set${Capitalize<T>}`;

type WithSelectors<SA> = {
  sub: {
    (listener: (selectedState: SA, previousSelectedState: SA) => void): () => void;
    <U>(
      selector: (state: SA) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      }
    ): () => void;
  };
} & {
  ref: <U>(selector: (state: SA) => U) => MutableRefObject<U>;
} & {
  sel: <U>(selector: (state: SA) => U, equals?: (a: U, b: U) => boolean) => U;
} & {
  use: {
    [K in keyof SA as SA[K] extends (...args: any) => any ? never : K]: () => SA[K];
  };
} & {
  do: {
    [K in keyof SA as SA[K] extends (...args: any) => any ? K : never]: SA[K];
  } & {
    [K in keyof SA as SA[K] extends (...args: any) => any ? never : SetKey<K & string>]: (
      value: FieldState<SA[K]>
    ) => void;
  };
} & { get: () => SA } & { set: (state: Partial<SA> | ((state: SA) => any)) => void } & {
  slice: { [K in keyof SA as K extends `__SLICE__${infer S}` ? S : never]: SA[K] };
};

const createSelectors = <SA = { [key: string]: any }>(
  _store: ((...args) => object) & {
    subscribe: (listener: (selectedState: SA, previousSelectedState: SA) => void) => () => void;
    getState: () => SA;
    setState: ((state: Partial<SA>) => void) | ((setter: (state: SA) => void) => void);
  },
  store = {} as unknown as WithSelectors<SA>
) => {
  store.get = _store.getState as () => SA;
  store.set = (s) => {
    typeof s === "function"
      ? (_store.setState as (setter: (state: SA) => void) => void)((st) => {
          s(st);
        })
      : (_store.setState as (state: Partial<SA>) => void)(s);
  };
  store.sel = <U>(selectFn: any, equals?: any) => _store(selectFn, equals) as U;
  const state = store.get();
  store.sub = _store.subscribe;
  const useReference = <U>(selectFn: (state: SA) => U): MutableRefObject<U> => {
    const ref = useRef(selectFn(store.get()));
    useEffect(() => {
      return store.sub(selectFn, (val) => (ref.current = val));
    }, []);
    return ref as unknown as MutableRefObject<U>;
  };
  store.ref = useReference;
  const existingUse = store.use as unknown as
    | { [K in keyof SA as SA[K] extends (...args: any) => any ? never : K]: () => SA[K] }
    | undefined;
  const existingDo = store.do as unknown as
    | { [K in keyof SA as SA[K] extends (...args: any) => any ? K : never]: SA[K] }
    | undefined;
  const existingSlice = store.slice as unknown as
    | { [K in keyof SA as K extends `__SLICE__${infer S}` ? S : never]: SA[K] }
    | undefined;
  if (!existingUse) Object.assign(store, { use: {} });
  if (!existingDo) Object.assign(store, { do: {} });
  if (!existingSlice) Object.assign(store, { slice: {} });
  for (const k of Object.keys(state as object)) {
    if (typeof state[k] !== "function") {
      store.use[k] = () => store.sel((s) => s[k] as object);
      const setKey = `set${capitalize(k)}`;
      if (!state[setKey])
        store.do[setKey] = (value: object) => {
          store.set({ [k]: value } as object);
        };
    } else {
      store.do[k] = async (...args: object[]) => {
        Logger.verbose(`${k} action loading...`);
        const start = Date.now();
        await (state[k] as (...args) => Promise<void>)(...args);
        const end = Date.now();
        Logger.verbose(`=> ${k} action dispatched (${end - start}ms)`);
      };
    }
  }

  const storeNames = getStoreNames();
  for (const storeName of storeNames) {
    const [fieldName, className] = [lowerlize(storeName), capitalize(storeName)];
    const names: { [key in SliceStateKey | SliceActionKey | "model" | "Model"]: string } = {
      model: fieldName,
      Model: className,
      defaultModel: `default${className}`,
      modelInsight: `${fieldName}Insight`,
      modelMap: `${fieldName}Map`,
      modelMapLoading: `${fieldName}MapLoading`,
      modelInitMap: `${fieldName}InitMap`,
      modelInitAt: `${fieldName}InitAt`,
      pageOfModel: `pageOf${className}`,
      limitOfModel: `limitOf${className}`,
      queryArgsOfModel: `queryArgsOf${className}`,
      sortOfModel: `sortOf${className}`,
      modelSelection: `${fieldName}Selection`,
      initModel: `init${className}`,
      refreshModel: `refresh${className}`,
      selectModel: `select${className}`,
      setPageOfModel: `setPageOf${className}`,
      addPageOfModel: `addPageOf${className}`,
      setLimitOfModel: `setLimitOf${className}`,
      setQueryArgsOfModel: `setQueryArgsOf${className}`,
      setSortOfModel: `setSortOf${className}`,
      lastPageOfModel: `lastPageOf${className}`,
    };
    const storeMeta = getStoreMeta(storeName);
    storeMeta.slices.forEach(({ sliceName, argLength, refName }) => {
      const SliceName = capitalize(sliceName);
      const namesOfSliceState: { [key in SliceStateKey]: string } = {
        defaultModel: SliceName.replace(names.Model, names.defaultModel),
        modelInitMap: SliceName.replace(names.Model, names.modelInitMap),
        modelInsight: sliceName.replace(names.model, names.modelInsight),
        modelMap: sliceName.replace(names.model, names.modelMap),
        modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
        modelInitAt: SliceName.replace(names.Model, names.modelInitAt),
        lastPageOfModel: SliceName.replace(names.Model, names.lastPageOfModel),
        pageOfModel: SliceName.replace(names.Model, names.pageOfModel),
        limitOfModel: SliceName.replace(names.Model, names.limitOfModel),
        queryArgsOfModel: SliceName.replace(names.Model, names.queryArgsOfModel),
        sortOfModel: SliceName.replace(names.Model, names.sortOfModel),
        modelSelection: SliceName.replace(names.Model, names.modelSelection),
      };
      const namesOfSliceAction: { [key in SliceActionKey]: string } = {
        initModel: SliceName.replace(names.Model, names.initModel),
        refreshModel: SliceName.replace(names.Model, names.refreshModel),
        selectModel: SliceName.replace(names.Model, names.selectModel),
        setPageOfModel: SliceName.replace(names.Model, names.setPageOfModel),
        addPageOfModel: SliceName.replace(names.Model, names.addPageOfModel),
        setLimitOfModel: SliceName.replace(names.Model, names.setLimitOfModel),
        setQueryArgsOfModel: SliceName.replace(names.Model, names.setQueryArgsOfModel),
        setSortOfModel: SliceName.replace(names.Model, names.setSortOfModel),
      };
      store.slice[sliceName] = { do: {}, use: {} };
      const targetSlice = store.slice[sliceName] as {
        do: { [key: string]: (...args) => void };
        use: { [key: string]: () => object };
        sliceName: string;
        refName: string;
        argLength: number;
      };
      Object.keys(namesOfSliceAction).forEach((key) => {
        targetSlice.do[names[key] as string] = store.do[namesOfSliceAction[key] as string] as (...args: any) => void;
      });
      Object.keys(namesOfSliceState).map((key) => {
        targetSlice.use[names[key] as string] = store.use[namesOfSliceState[key] as string] as () => object;
        targetSlice.do[`set${capitalize(names[key] as string)}`] = store.do[
          `set${capitalize(namesOfSliceState[key] as string)}`
        ] as (value: object) => void;
      });
      targetSlice.sliceName = sliceName;
      targetSlice.refName = refName;
      targetSlice.argLength = argLength;
    });
  }
  return store;
};

const makePicker =
  (set: (state: { [key: string]: object }) => void, get: () => { [key: string]: any }) =>
  (...fields: string[]) => {
    const state = get();
    const ret = {} as { [key: string]: { id: string } | string };
    for (const field of fields) {
      const val = state[field] as { id: string } | string | undefined;
      if (!val) throw new Error(`Field ${field} is not ready`);
      if (typeof val === "string" && val.length === 0) throw new Error(`Field is empty string (${field})`);
      else if (["self", "myKeyring", "me"].includes(field) && !(state[field] as { id?: string }).id?.length)
        throw new Error("Self, Keyring or Me Id is not defined");
      ret[field] = val;
    }
    return ret;
  };

interface MakeStoreOption {
  library?: boolean;
}
export const makeStore = <SA extends { [key: string]: any }>(
  st: WithSelectors<any>,
  storeRef: Type<SA>,
  { library }: MakeStoreOption = {}
): WithSelectors<SA> => {
  if (library) return st as WithSelectors<SA>;
  const zustandStore = create(
    devtools(
      subscribeWithSelector(
        immer((set, get: () => object) => {
          const store = {};
          const pick = makePicker(set, get);
          Object.getOwnPropertyNames(storeRef.prototype).forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(storeRef.prototype, key);
            if (descriptor) store[key] = descriptor.value as object;
          });
          Object.assign(store, { set, get, pick });
          return store;
        })
      ),
      { name: "root", anonymousActionType: "root", type: "root" }
    )
  );
  return createSelectors(zustandStore, st) as WithSelectors<SA>;
};

export type StoreOf<T extends string, State> = SliceMeta & {
  use: {
    [K in keyof State as State[K] extends (...args: any) => any ? never : K]: () => State[K];
  };
} & {
  do: {
    [K in keyof State as State[K] extends (...args: any) => any ? K : never]: State[K];
  };
} & {
  do: {
    [K in keyof State as State[K] extends (...args: any) => any ? never : `set${Capitalize<K & string>}`]: (
      value: FieldState<State[K]>
    ) => void;
  };
};

type RemoveSuffix<State, Suffix extends string> = {
  [K in keyof State as K extends `${infer Prefix}${Suffix}` ? Prefix : never]: State[K];
};

export const storeOf = <
  T extends string,
  Input,
  Full extends { id: string },
  Light,
  Insight,
  Filter extends FilterType,
  Fetch,
  Signal,
  State,
  Actions,
>(
  gql: DbGraphQL<T, Input, Full, Light, Insight, Filter, Fetch, Signal>,
  state: (...args: any) => State,
  actions: (...args: any) => Actions
): ((setget: SetGet<any>) => State &
  Actions & {
    [K in keyof Fetch as K extends `${T}List${infer Suffix}`
      ? `__SLICE__${T}${Suffix}`
      : never]: K extends `${T}List${infer Suffix}`
      ? Fetch[K] extends (
          ...args: [
            ...args: infer QueryArgs,
            skip: null | undefined,
            limit: null | undefined,
            sort: null | undefined,
            option?: FetchPolicy,
          ]
        ) => Promise<Light[]>
        ? StoreOf<
            T,
            RemoveSuffix<
              SliceState<T, Full, Light, QueryArgs, Insight, Filter, Suffix> &
                SliceAction<T, Input, Full, Light, QueryArgs, Filter, Suffix>,
              Suffix
            >
          >
        : never
      : never;
  }) => {
  const st = ({ set, get, pick }: SetGet<any>) => {
    const store = {
      ...state({ set, get, pick }),
      ...actions({ set, get, pick }),
    };
    const useKeys: string[] = [];
    const doKeys: string[] = [];
    Object.entries(store as { [key: string]: any }).forEach(([key, value]) =>
      typeof value === "function" ? doKeys.push(key) : useKeys.push(key)
    );
    setStoreMeta(gql.refName, { refName: gql.refName, useKeys, doKeys, slices: gql.slices });
    return store;
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return st as any;
};

export type Store<State> = WithSelectors<State>;

type OmitGetSetPick<T> = Omit<T, "get" | "set" | "pick">;
export const MixStore = <
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
  S16,
  S17,
  S18,
  S19,
  S20,
  S21,
  S22,
  S23,
  S24,
  S25,
  S26,
  S27,
  S28,
  S29,
  S30,
>(
  s1: Type<S1>,
  s2?: Type<S2>,
  s3?: Type<S3>,
  s4?: Type<S4>,
  s5?: Type<S5>,
  s6?: Type<S6>,
  s7?: Type<S7>,
  s8?: Type<S8>,
  s9?: Type<S9>,
  s10?: Type<S10>,
  s11?: Type<S11>,
  s12?: Type<S12>,
  s13?: Type<S13>,
  s14?: Type<S14>,
  s15?: Type<S15>,
  s16?: Type<S16>,
  s17?: Type<S17>,
  s18?: Type<S18>,
  s19?: Type<S19>,
  s20?: Type<S20>,
  s21?: Type<S21>,
  s22?: Type<S22>,
  s23?: Type<S23>,
  s24?: Type<S24>,
  s25?: Type<S25>,
  s26?: Type<S26>,
  s27?: Type<S27>,
  s28?: Type<S28>,
  s29?: Type<S29>,
  s30?: Type<S30>
) => {
  type AllStateActions = OmitGetSetPick<S1> &
    OmitGetSetPick<S2> &
    OmitGetSetPick<S3> &
    OmitGetSetPick<S4> &
    OmitGetSetPick<S5> &
    OmitGetSetPick<S6> &
    OmitGetSetPick<S7> &
    OmitGetSetPick<S8> &
    OmitGetSetPick<S9> &
    OmitGetSetPick<S10> &
    OmitGetSetPick<S11> &
    OmitGetSetPick<S12> &
    OmitGetSetPick<S13> &
    OmitGetSetPick<S14> &
    OmitGetSetPick<S15> &
    OmitGetSetPick<S16> &
    OmitGetSetPick<S17> &
    OmitGetSetPick<S18> &
    OmitGetSetPick<S19> &
    OmitGetSetPick<S20> &
    OmitGetSetPick<S21> &
    OmitGetSetPick<S22> &
    OmitGetSetPick<S23> &
    OmitGetSetPick<S24> &
    OmitGetSetPick<S25> &
    OmitGetSetPick<S26> &
    OmitGetSetPick<S27> &
    OmitGetSetPick<S28> &
    OmitGetSetPick<S29> &
    OmitGetSetPick<S30>;
  type MixedStore = Type<AllStateActions & SetGet<AllStateActions>>;
  const stores = [
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
    s8,
    s9,
    s10,
    s11,
    s12,
    s13,
    s14,
    s15,
    s16,
    s17,
    s18,
    s19,
    s20,
    s21,
    s22,
    s23,
    s24,
    s25,
    s26,
    s27,
    s28,
    s29,
    s30,
  ].filter((s) => !!s);
  class Mix {}
  applyMixins(Mix, stores);
  return Mix as unknown as MixedStore;
};

export const rootStoreOf = <Store>(store: Type<Store>): Type<Store> => {
  return Object.getPrototypeOf(store) as Type<Store>;
};

interface ToastProps {
  duration?: number;
}
export const Toast = ({ duration = 3 }: ToastProps = {}) => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value as (...args) => Promise<void>;
    descriptor.value = async function (...args) {
      try {
        msg.loading(`${key}-loading`, { key, duration });
        const result = (await originMethod.apply(this, args)) as object;
        msg.success(`${key}-success`, { key, duration });
        return result;
      } catch (err) {
        const errKey = typeof err === "string" ? err : (err as Error).message;
        msg.error(errKey, { key, duration });
        Logger.error(`${key} action error return: ${err}`);
      }
    };
  };
};

export const Try = () => {
  return function (target, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value as (...args) => Promise<void>;
    descriptor.value = async function (...args) {
      try {
        const result = (await originMethod.apply(this, args)) as object;
        return result;
      } catch (err) {
        Logger.error(`${key} action error return: ${err}`);
      }
    };
  };
};
