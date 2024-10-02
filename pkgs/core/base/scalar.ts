import { Dayjs, type QueryOf, type SortType, dayjs } from "./types";
import type { AccumulatorOperator } from "mongoose";
import type { default as GraphQLJSON } from "graphql-type-json";
import type { GraphQLUpload } from "graphql-upload";
import type { ReadStream } from "fs";
import type { Readable } from "stream";

export class BaseObject {
  id: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  removedAt: Dayjs | null;
}
export type Type<T = any> = new (...args: any[]) => T;
export class Int {
  __Scalar__: "int";
}
export class Upload {
  __Scalar__: "upload";
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream | Readable;
}

export class Float {
  __Scalar__: "float";
}
export class ID {
  __Scalar__: "id";
}
export class JSON {
  __Scalar__: "json";
}
export type SingleFieldType =
  | Int
  | Float
  | StringConstructor
  | BooleanConstructor
  | ID
  | DateConstructor
  | JSON
  | Type
  | typeof GraphQLJSON
  | typeof GraphQLUpload;

export const getNonArrayModel = <T = Type>(arraiedModel: T | T[]): [T, number] => {
  let arrDepth = 0;
  let target: T | T[] = arraiedModel;
  while (Array.isArray(target)) {
    target = target[0];
    arrDepth++;
  }
  return [target, arrDepth];
};
export const arraiedModel = <T = any>(modelRef: T, arrDepth = 0) => {
  let target: T | T[] | T[][] | T[][][] = modelRef;
  for (let i = 0; i < arrDepth; i++) target = [target as T];
  return target;
};
export const applyFnToArrayObjects = (arraiedData: any, fn: (arg: any) => any): any[] => {
  if (Array.isArray(arraiedData)) return arraiedData.map((data) => applyFnToArrayObjects(data, fn) as unknown);
  return fn(arraiedData) as unknown as any[];
};

export interface ConstantClassMeta {
  refName: string;
  modelRef: any;
  type: "input" | "full" | "light" | "scalar";
  hasTextField: boolean;
}

export interface ConstantFilterMeta {
  refName: string;
  sort: SortType;
}
export interface FilterKeyProps {
  type?: "mongo" | "meili";
}
export interface FilterKeyMeta extends FilterKeyProps {
  key: string;
  descriptor: PropertyDescriptor;
}
export interface FilterArgProps {
  nullable?: boolean;
  ref?: string;
  default?: string | number | boolean | object | null | (() => string | number | boolean | object | null);
  renderOption?: (value: any) => string;
  enum?: (string | number)[] | readonly (string | number)[];
}
export interface FilterArgMeta extends FilterArgProps {
  name: string;
  modelRef: Type;
  arrDepth: number;
  isArray: boolean;
  optArrDepth: number;
}

export const fieldTypes = ["email", "password", "url"] as const;
export type FieldType = (typeof fieldTypes)[number];

export type ReturnType<T extends SingleFieldType = SingleFieldType> = (of?: any) => T | [T] | [[T]] | Map<string, any>;
export interface ConstantFieldProps {
  // Mongoose Props + GraphQL Field
  nullable?: boolean;
  ref?: string;
  refPath?: string;
  refType?: "child" | "parent" | "relation";
  default?: string | number | boolean | object | null;
  type?: FieldType;
  fieldType?: "property" | "hidden" | "resolve";
  immutable?: boolean;
  min?: number;
  max?: number;
  enum?: (string | number)[] | readonly (string | number)[];
  select?: boolean;
  minlength?: number;
  maxlength?: number;
  query?: QueryOf<any> | (() => QueryOf<any>);
  accumulate?: AccumulatorOperator;
  example?: string | number | boolean | Dayjs | string[] | number[] | boolean[] | Dayjs[];
  of?: GqlScalar; // for Map type fields
  validate?: (value: any, model: any) => boolean;
  text?: "search" | "filter";
}
export type ConstantFieldMeta = ConstantFieldProps & {
  nullable: boolean;
  default: any;
  fieldType: "property" | "hidden" | "resolve";
  immutable: boolean;
  select: boolean;
} & {
  key: string;
  name: string;
  isClass: boolean;
  isScalar: boolean;
  modelRef: Type;
  arrDepth: number;
  isArray: boolean;
  optArrDepth: number;
  isMap: boolean;
};
export const getClassMeta = (modelRef: Type) => {
  const [target] = getNonArrayModel(modelRef);
  const classMeta = Reflect.getMetadata("class", target.prototype as object) as ConstantClassMeta | undefined;
  if (!classMeta) throw new Error(`No ClassMeta for this target ${target.name}`);
  return classMeta;
};
export const getFieldMetas = (modelRef: Type): ConstantFieldMeta[] => {
  const [target] = getNonArrayModel(modelRef);
  const metadataMap =
    (Reflect.getMetadata("fields", target.prototype as object) as Map<string, ConstantFieldMeta> | undefined) ??
    new Map<string, ConstantFieldMeta>();
  const keySortMap = { id: -1, createdAt: 1, updatedAt: 2, removedAt: 3 };
  return [...metadataMap.values()].sort((a, b) => (keySortMap[a.key] ?? 0) - (keySortMap[b.key] ?? 0));
};
export const getFieldMetaMap = (modelRef: Type): Map<string, ConstantFieldMeta> => {
  const [target] = getNonArrayModel(modelRef);
  const metadataMap =
    (Reflect.getMetadata("fields", target.prototype as object) as Map<string, ConstantFieldMeta> | undefined) ??
    new Map<string, ConstantFieldMeta>();
  return new Map(metadataMap);
};
export const setFieldMetaMap = (modelRef: Type, metadataMap: Map<string, ConstantFieldMeta>) => {
  const [target] = getNonArrayModel(modelRef);
  Reflect.defineMetadata("fields", new Map(metadataMap), target.prototype as object);
};
export const getFieldMetaMapOnPrototype = (prototype: object): Map<string, ConstantFieldMeta> => {
  const metadataMap =
    (Reflect.getMetadata("fields", prototype) as Map<string, ConstantFieldMeta> | undefined) ??
    new Map<string, ConstantFieldMeta>();
  return new Map(metadataMap);
};
export const setFieldMetaMapOnPrototype = (prototype: object, metadataMap: Map<string, ConstantFieldMeta>) => {
  Reflect.defineMetadata("fields", new Map(metadataMap), prototype);
};

export const getQueryMap = (modelRef: Type): { [key: string]: QueryOf<any> | undefined | (() => QueryOf<any>) } => {
  const fieldMetas = getFieldMetas(modelRef);
  return Object.fromEntries(
    fieldMetas.filter((fieldMeta) => !!fieldMeta.query).map((fieldMeta) => [fieldMeta.key, fieldMeta.query])
  );
};

export const gqlScalars = [String, Boolean, Date, ID, Int, Float, Upload, JSON, Map] as const;
export type GqlScalar = (typeof gqlScalars)[number];
export const gqlScalarNames = ["ID", "Int", "Float", "String", "Boolean", "Date", "Upload", "JSON", "Map"] as const;
export type GqlScalarName = (typeof gqlScalarNames)[number];
export const scalarSet = new Set<GqlScalar>([String, Boolean, Date, ID, Int, Float, Upload, JSON, Map]);
export const scalarNameMap = new Map<GqlScalar, GqlScalarName>([
  [ID, "ID"],
  [Int, "Int"],
  [Float, "Float"],
  [String, "String"],
  [Boolean, "Boolean"],
  [Date, "Date"],
  [Upload, "Upload"],
  [JSON, "JSON"],
  [Map, "Map"],
]);
export const scalarExampleMap = new Map<GqlScalar, string | number | boolean | object>([
  [ID, "1234567890abcdef12345678"],
  [Int, 0],
  [Float, 0],
  [String, "String"],
  [Boolean, true],
  [Date, new Date().toISOString()],
  [Upload, "FileUpload"],
  [JSON, {}],
  [Map, {}],
]);
export const scalarArgMap = new Map<GqlScalar, any>([
  [ID, null],
  [String, ""],
  [Boolean, false],
  [Date, dayjs(new Date(-1))],
  [Int, 0],
  [Float, 0],
  [JSON, {}],
  [Map, {}],
]);
export const scalarDefaultMap = new Map<GqlScalar, any>([
  [ID, null],
  [String, ""],
  [Boolean, false],
  [Date, dayjs(new Date(-1))],
  [Int, 0],
  [Float, 0],
  [JSON, {}],
]);
export const isGqlClass = (modelRef: Type) => !scalarSet.has(modelRef);
export const isGqlScalar = (modelRef: Type) => scalarSet.has(modelRef);
export const getGqlTypeStr = (ref: GqlScalar): string => scalarNameMap.get(ref) ?? getClassMeta(ref).refName;
export const isGqlMap = (modelRef: any) => modelRef === Map;
export const getScalarExample = (ref: GqlScalar) => scalarExampleMap.get(ref) ?? null;
