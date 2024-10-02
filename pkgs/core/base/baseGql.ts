import { BaseObject, ConstantFieldMeta, ID, Type, getClassMeta, getFieldMetaMap, setFieldMetaMap } from "./scalar";
import { Model } from "./classMeta";
import { applyMixins } from "../common/applyMixins";

const defaultFieldMeta: Omit<ConstantFieldMeta, "key" | "name" | "modelRef"> = {
  fieldType: "property",
  immutable: false,
  select: true,
  isClass: false,
  isScalar: true,
  nullable: false,
  isArray: false,
  arrDepth: 0,
  optArrDepth: 0,
  default: null,
  isMap: false,
};
const idFieldMeta: ConstantFieldMeta = { ...defaultFieldMeta, key: "id", name: "ID", modelRef: ID };
const createdAtFieldMeta: ConstantFieldMeta = { ...defaultFieldMeta, key: "createdAt", name: "Date", modelRef: Date };
const updatedAtFieldMeta: ConstantFieldMeta = { ...defaultFieldMeta, key: "updatedAt", name: "Date", modelRef: Date };
const removedAtFieldMeta: ConstantFieldMeta = {
  ...defaultFieldMeta,
  key: "removedAt",
  name: "Date",
  modelRef: Date,
  nullable: true,
  default: null,
};

export function ExtendModel<T>(modelRef: Type<T>): Type<T> {
  class BaseModel {}
  const metadataMap = getFieldMetaMap(modelRef);
  setFieldMetaMap(BaseModel, metadataMap);
  return BaseModel as unknown as Type<T>;
}
export function BaseModel<T>(modelRef: Type<T>): Type<T & BaseObject> {
  class BaseModel {
    __ModelType__ = "full" as const;
  }
  const metadataMap = getFieldMetaMap(modelRef);
  metadataMap.set("id", idFieldMeta);
  metadataMap.set("createdAt", createdAtFieldMeta);
  metadataMap.set("updatedAt", updatedAtFieldMeta);
  metadataMap.set("removedAt", removedAtFieldMeta);
  Reflect.defineMetadata("fields", metadataMap, BaseModel.prototype);
  return BaseModel as unknown as Type<T & BaseObject & BaseModel>;
}

export function AddModel<
  A,
  T1,
  T2 = unknown,
  T3 = unknown,
  T4 = unknown,
  T5 = unknown,
  T6 = unknown,
  T7 = unknown,
  T8 = unknown,
  T9 = unknown,
  T10 = unknown,
>(
  modelRef: Type<A>,
  t1: Type<T1>,
  t2?: Type<T2>,
  t3?: Type<T3>,
  t4?: Type<T4>,
  t5?: Type<T5>,
  t6?: Type<T6>,
  t7?: Type<T7>,
  t8?: Type<T8>,
  t9?: Type<T9>,
  t10?: Type<T10>
): Type<A & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10> {
  const classMeta = getClassMeta(modelRef);
  const modelMetadataMap = getFieldMetaMap(modelRef);
  const metadataMap = new Map<string, ConstantFieldMeta>(
    [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10]
      .filter((t) => !!t)
      .reduce((acc: any, writeRef: Type) => {
        const writeMetadataMap: Map<string, ConstantFieldMeta> = getFieldMetaMap(writeRef);
        applyMixins(modelRef, [writeRef]);
        return new Map<string, ConstantFieldMeta>([...(acc as Map<string, ConstantFieldMeta>), ...writeMetadataMap]);
      }, modelMetadataMap) as Map<string, ConstantFieldMeta>
  );
  setFieldMetaMap(modelRef, metadataMap);
  Model.Object(classMeta.refName)(modelRef);
  return modelRef as Type<A & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>;
}
export function MixModels<
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
  class Mix {}
  const metadataMap = new Map(
    [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20]
      .filter((t) => !!t)
      .reduce((acc, modelRef: Type) => {
        const modelMetadataMap = getFieldMetaMap(modelRef);
        applyMixins(Mix, [modelRef]);
        return [...acc, ...modelMetadataMap];
      }, [])
  );
  setFieldMetaMap(Mix, metadataMap);
  return Mix as Type<
    T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20
  >;
}
type NonFunctionalKeys<T> = keyof T extends (...any) => any ? never : keyof T;

export function Light<T, F extends NonFunctionalKeys<Omit<T, "id" | "createdAt" | "updatedAt" | "removedAt">>>(
  objectRef: Type<T>,
  fields: readonly F[]
): Type<{ [K in F]: T[K] } & BaseObject> {
  const map = new Map();
  const metadataMap = getFieldMetaMap(objectRef);
  class BaseGql {
    __ModelType__ = "light" as const;
  }
  ["id", ...fields, "createdAt", "updatedAt", "removedAt"].forEach((key: string) => map.set(key, metadataMap.get(key)));
  Reflect.defineMetadata("fields", map, BaseGql.prototype);
  return BaseGql as unknown as Type<{ [K in F]: T[K] } & BaseObject>;
}

export function Full<A, B = undefined>(
  modelRef: Type<A>,
  lightRef: Type<B>,
  overwriteRef?: Type,
  overwriteLightRef?: Type
): Type<Omit<A, keyof B> & B> {
  const modelFieldMetaMap = getFieldMetaMap(modelRef);
  const lightFieldMetaMap = getFieldMetaMap(lightRef);
  applyMixins(modelRef, [lightRef]);
  if (overwriteRef) {
    applyMixins(overwriteRef, [modelRef]);
    setFieldMetaMap(overwriteRef, modelFieldMetaMap);
  }
  if (overwriteLightRef) {
    applyMixins(overwriteLightRef, [lightRef]);
    setFieldMetaMap(overwriteLightRef, lightFieldMetaMap);
  }
  setFieldMetaMap(modelRef, new Map([...modelFieldMetaMap, ...lightFieldMetaMap]));
  return modelRef as Type<Omit<A, keyof B> & B>;
}
