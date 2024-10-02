import {
  type ConstantFilterMeta,
  type FilterArgMeta,
  type FilterArgProps,
  type FilterKeyMeta,
  type FilterKeyProps,
  type ReturnType,
  type Type,
  getFieldMetaMap,
  getNonArrayModel,
} from "./scalar";
import type { QueryOf, SortType } from "./types";

export const getFilterMeta = (filterRef: Type) => {
  const filterMeta = Reflect.getMetadata("filter", filterRef.prototype as object) as ConstantFilterMeta | undefined;
  if (!filterMeta) throw new Error("filterMeta is not defined");
  return filterMeta;
};
export const setFilterMeta = (filterRef: Type, filterMeta: ConstantFilterMeta) => {
  const existingFilterMeta = Reflect.getMetadata("filter", filterRef.prototype as object) as
    | ConstantFilterMeta
    | undefined;
  if (existingFilterMeta) Object.assign(filterMeta.sort, existingFilterMeta.sort);
  Reflect.defineMetadata("filter", filterMeta, filterRef.prototype as object);
};
export const getFilterKeyMetaMapOnPrototype = (prototype: object): Map<string, FilterKeyMeta> => {
  const metadataMap =
    (Reflect.getMetadata("filterKey", prototype) as Map<string, FilterKeyMeta> | undefined) ??
    new Map<string, FilterKeyMeta>();
  return new Map(metadataMap);
};
const setFilterKeyMetaMapOnPrototype = (prototype: object, metadataMap: Map<string, FilterKeyMeta>) => {
  Reflect.defineMetadata("filterKey", new Map(metadataMap), prototype);
};

const applyFilterKeyMeta = (option: FilterKeyProps) => {
  return (prototype: object, key: string, descriptor: PropertyDescriptor) => {
    const metadata: FilterKeyMeta = { key, ...option, descriptor };
    const metadataMap = getFilterKeyMetaMapOnPrototype(prototype);
    metadataMap.set(key, metadata);
    setFilterKeyMetaMapOnPrototype(prototype, metadataMap);
  };
};
const makeFilter = (customOption: Partial<FilterKeyProps>) => (fieldOption?: Omit<FilterKeyProps, "type">) => {
  return applyFilterKeyMeta({ ...customOption, ...fieldOption });
};

const getFilterArgMetasOnPrototype = (prototype: object, key: string): FilterArgMeta[] => {
  const filterArgMetas = (Reflect.getMetadata("filterArg", prototype, key) as FilterArgMeta[] | undefined) ?? [];
  return filterArgMetas;
};
const setFilterArgMetasOnPrototype = (prototype: object, key: string, filterArgMetas: FilterArgMeta[]) => {
  Reflect.defineMetadata("filterArg", filterArgMetas, prototype, key);
};
export const getFilterArgMetas = (filterRef: Type, key: string) => {
  const filterArgMetas = getFilterArgMetasOnPrototype(filterRef.prototype as object, key);
  return filterArgMetas;
};

const applyFilterArgMeta = (name: string, returns: ReturnType, argOption?: FilterArgProps | FilterArgProps[]) => {
  return (prototype: object, key: string, idx: number) => {
    const [modelRef, arrDepth] = getNonArrayModel<Type>(returns() as Type);
    const [opt, optArrDepth] = getNonArrayModel(argOption ?? {});
    const filterArgMeta: FilterArgMeta = { name, ...opt, modelRef, arrDepth, isArray: arrDepth > 0, optArrDepth };
    const filterArgMetas = getFilterArgMetasOnPrototype(prototype, key);
    filterArgMetas[idx] = filterArgMeta;
    setFilterArgMetasOnPrototype(prototype, key, filterArgMetas);
  };
};

export const getFilterQuery = (filterRef: Type, key: string) => {
  const filterKeyMetaMap = getFilterKeyMetaMapOnPrototype(filterRef.prototype as object);
  const filterKeyMeta = filterKeyMetaMap.get(key);
  if (!filterKeyMeta?.descriptor.value) throw new Error(`filterKeyMeta is not defined for key: ${key}`);
  return filterKeyMeta.descriptor.value as (...args: any[]) => QueryOf<any>;
};
export const getFilterQueryMap = (filterRef: Type) => {
  const filterKeyMetaMap = getFilterKeyMetaMapOnPrototype(filterRef.prototype as object);
  return filterKeyMetaMap;
};
export const getFilterSort = (filterRef: Type, key: string) => {
  const filterMeta = getFilterMeta(filterRef);
  const sort = filterMeta.sort[key];
  return sort;
};
export const getFilterSortMap = (filterRef: Type) => {
  const filterMeta = getFilterMeta(filterRef);
  return filterMeta.sort;
};

export const Filter = {
  Mongo: makeFilter({ type: "mongo" }),
  // Meili: makeFilter({ fieldType: "hidden", nullable: true }),
  Arg: applyFilterArgMeta,
};

export function BaseFilter<Sort extends SortType>(modelRef: Type, sort: Sort) {
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const statusFieldMeta = fieldMetaMap.get("status");
  if (!statusFieldMeta) throw new Error(`No status field meta fount in ${modelRef.name}`);

  class BaseFilter {
    latest = { createdAt: -1 };
    oldest = { createdAt: 1 };

    @Filter.Mongo()
    any() {
      return { removedAt: { $exists: false } };
    }
    @Filter.Mongo()
    byStatuses(
      @Filter.Arg("statuses", () => [String], { nullable: true, enum: statusFieldMeta?.enum }) statuses: string[] | null
    ) {
      return statuses?.length ? { status: { $in: statuses } } : {};
    }
  }
  Object.assign(BaseFilter.prototype, sort);
  setFilterMeta(BaseFilter, {
    refName: "BaseFilter",
    sort: Object.assign({ latest: { createdAt: -1 }, oldest: { createdAt: 1 } }, sort),
  });
  return BaseFilter as unknown as Type<BaseFilter & Sort>;
}
