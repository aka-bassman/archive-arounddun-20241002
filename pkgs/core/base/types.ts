import { type BaseObject } from "./scalar";
import dayjsLib, { Dayjs } from "dayjs";
import type { FilterQuery, HydratedDocument } from "mongoose";

export type { FilterQuery as QueryOf };

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type OptionalKeys<T> = T extends { [key: string]: any }
  ? {
      [K in keyof T]-?: null extends T[K] ? K : never;
    }[keyof T]
  : never;

type ObjectToId<O, D = Dayjs> = O extends BaseObject
  ? string
  : O extends BaseObject[]
    ? string[]
    : O extends Dayjs
      ? D
      : O extends { [key: string]: any }
        ? DocumentModel<O>
        : O;
export interface SortType {
  [key: string]: { [key: string]: number };
}
export type SortOf<Filter> = keyof GetStateObject<Filter>;
export type FilterType = Record<string, any>;
export interface ListQueryOption<Sort> {
  skip?: number | null;
  limit?: number | null;
  sort?: Sort | null;
  sample?: number;
}
export interface FindQueryOption<Sort> {
  skip?: number | null;
  sort?: Sort | null;
  sample?: boolean;
}
export type DocumentModel<T, D = Dayjs> = T extends (infer S)[]
  ? DocumentModel<S>[]
  : T extends string
    ? T
    : T extends number
      ? T
      : T extends boolean
        ? T
        : T extends Dayjs
          ? T
          : T extends Map<infer K, infer V>
            ? Map<K, DocumentModel<V, D>>
            : Optional<
                {
                  [K in keyof GetStateObject<T>]: T[K] extends infer S
                    ? S extends null
                      ? undefined
                      : ObjectToId<T[K], D>
                    : never;
                },
                OptionalKeys<GetStateObject<T>>
              >;

export interface ListOption {
  limit?: number;
  skip?: number;
  sort?: string;
}
export const defaultListOption: ListOption = {
  limit: 20,
  skip: 0,
  sort: "latest",
};

export { Dayjs };
export const dayjs = dayjsLib;
export type GetPlainObject<T, O extends string> = Omit<
  {
    [K in keyof T as T[K] extends (...args: any) => any
      ? never
      : K extends keyof HydratedDocument<any>
        ? never
        : K]: T[K];
  },
  O
>;
export type GetObject<T> = Omit<{ [K in keyof T]: T[K] }, "prototype">;
export type GetStateObject<T> = Omit<
  { [K in keyof T as T[K] extends (...args: any) => any ? never : K]: T[K] },
  "prototype"
>;
export type GetActionObject<T> = Omit<
  { [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K] },
  "prototype"
>;
export interface ProtoFile {
  id: string;
  filename: string;
  abstractData: string | null;
  imageSize: [number, number];
  progress: number | null;
  url: string;
  size: number;
  status: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  removedAt: Dayjs | null;
}

export interface ProtoAppInfo {
  appId: string | null;
  appName: string;
  deviceId: string | null;
  platform: "ios" | "android" | null;
  major: number;
  minor: number;
  patch: number;
  branch: "debug" | "develop" | "main";
  buildNum: string | null;
  versionOs: string | null;
  isEmulator: boolean | null;
}

export interface ProtoPatch {
  source: ProtoFile;
  build: ProtoFile;
  appBuild: ProtoFile | null;
  status: "active" | "expired";
  at: Dayjs;
}

export type OptionOf<Obj> = {
  [K in keyof Obj]?: Obj[K] | null;
};

export type UnType<T> = T extends new (...args: any) => infer U ? U : never;
export const DEFAULT_PAGE_SIZE = 20;
export interface TextDoc {
  [key: string]: string | TextDoc;
}
