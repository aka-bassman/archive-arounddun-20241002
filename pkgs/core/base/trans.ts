import {
  type ConstantFieldMeta,
  type ConstantModel,
  type DefaultSignal,
  type GetActionObject,
  type GetStateObject,
  type Type,
  getFilterSortMap,
} from ".";
import { Logger } from "../common/Logger";
import { capitalize } from "../common/capitalize";
import { getArgMetas, getGqlMetas, getSigMeta } from "./signalDecorators";
import { getClassMeta, getFieldMetaMap } from "./scalar";
import { lowerlize } from "../common/lowerlize";

type TranslationSingle = readonly [string, string] | readonly [string, string, string, string];
type TranslationWithParam = readonly [string, string, { [key: string]: string | number }];
export type Translation = TranslationSingle | TranslationWithParam;

export type Translate<Checker> = { [K in keyof GetStateObject<Checker>]: Translation } & {
  [key: string]: Translation;
} & { modelName: Translation };

export type ExtendModelDictionary<Model, Insight = unknown, Sort = unknown> = {
  [K in keyof GetStateObject<Model & Insight> as K extends string ? K | `desc-${K}` : never]: Translation;
} & {
  [key: string]: Translation;
};

export type ModelDictionary<Model, Insight = unknown, Filter = unknown> = {
  [K in keyof GetStateObject<Model & Insight & Filter> as K extends string ? K | `desc-${K}` : never]: Translation;
} & {
  [key: string]: Translation;
} & { modelName: Translation; modelDesc: Translation };

export type SummaryDictionary<Summary> = {
  [K in keyof GetStateObject<Summary> as K extends string ? K | `desc-${K}` : never]: Translation;
};

export type SignalDictionary<Checker, Model = unknown> = {
  [K in keyof GetActionObject<Checker> as K extends string
    ? K extends keyof Model
      ? never
      : Checker[K] extends (...args: any) => Promise<{ __Returns__: "Done" }>
        ? never
        : `apidesc-${K}` | `api-${K}`
    : never]: Translation;
} & { [key: string]: Translation };

export type GetKeys<O> = O extends infer U ? (U extends object ? keyof U : never) : never;

export type TransMessage<Locale extends Record<string, any>> = Locale extends infer U
  ? U extends object
    ? {
        [K in keyof U]-?: `${K & string}${U[K] extends Record<string, any> ? `.${GetKeys<U[K]>}` : never}`;
      }[keyof U]
    : never
  : never;

export const baseTrans = {
  id: ["Id", "아이디"],
  "desc-id": ["Unique ID value", "유니크한 아이디값"],

  createdAt: ["CreatedAt", "생성일"],
  "desc-createdAt": ["Data created time", "데이터 생성 시각"],

  updatedAt: ["UpdatedAt", "수정일"],
  "desc-updatedAt": ["Data updated time", "데이터 마지막 수정 시각"],

  removedAt: ["RemovedAt", "삭제일"],
  "desc-removedAt": ["Data removed time", "데이터 삭제 시각"],

  status: ["Status", "상태"],
  "desc-status": ["Data status", "데이터 상태"],

  count: ["Count", "개수"],
  "desc-count": ["Data count", "데이터 개수"],

  latest: ["latest", "최신순"],
  "desc-latest": ["latest", "최신순"],

  oldest: ["oldest", "오래된순"],
  "desc-oldest": ["oldest", "오래된순"],
} as const;

type BaseSignalTrans<T extends string> = {
  [K in keyof DefaultSignal<T, any, any, any, any, any> as K extends string
    ? `apidesc-${K}` | `api-${K}`
    : never]: Translation;
};

export const getBaseSignalTrans = <T extends string>(modelName: T): BaseSignalTrans<T> => {
  const className = capitalize(modelName) as Capitalize<T>;
  return {
    // * ==================== Endpoint ==================== * //
    [`api-light${className}`]: [`Get light version of ${modelName}`, `${modelName} 경량화 버전 조회`],
    [`apidesc-light${className}`]: [`Get light version of ${modelName}`, `${modelName} 경량화 버전 조회`],
    [`arg-light${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    [`argdesc-light${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],

    [`api-${modelName}`]: [`Get ${modelName}`, `${modelName} 조회`],
    [`apidesc-${modelName}`]: [`Get ${modelName}`, `${modelName} 조회`],
    [`arg-${modelName}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    [`argdesc-${modelName}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],

    [`api-${modelName}List`]: [`Get ${modelName} list`, `${modelName} 리스트 조회`],
    [`apidesc-${modelName}List`]: [`Get ${modelName} list`, `${modelName} 리스트 조회`],
    [`arg-${modelName}List-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],
    [`argdesc-${modelName}List-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],
    [`arg-${modelName}List-skip`]: [`Skip of ${modelName}`, `${modelName} 스킵`],
    [`argdesc-${modelName}List-skip`]: [`Skip of ${modelName}`, `${modelName} 스킵`],
    [`arg-${modelName}List-limit`]: [`Limit of ${modelName}`, `${modelName} 제한`],
    [`argdesc-${modelName}List-limit`]: [`Limit of ${modelName}`, `${modelName} 제한`],
    [`arg-${modelName}List-sort`]: [`Sort of ${modelName}`, `${modelName} 정렬`],
    [`argdesc-${modelName}List-sort`]: [`Sort of ${modelName}`, `${modelName} 정렬`],

    [`api-${modelName}Insight`]: [`Get ${modelName} insight`, `${modelName} 인사이트 조회`],
    [`apidesc-${modelName}Insight`]: [`Get ${modelName} insight`, `${modelName} 인사이트 조회`],
    [`arg-${modelName}Insight-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],
    [`argdesc-${modelName}Insight-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],

    [`api-${modelName}Exists`]: [`Check ${modelName} exists`, `${modelName} 존재 여부 확인`],
    [`apidesc-${modelName}Exists`]: [`Check ${modelName} exists`, `${modelName} 존재 여부 확인`],
    [`arg-${modelName}Exists-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],
    [`argdesc-${modelName}Exists-query`]: [`Query of ${modelName}`, `${modelName} 쿼리`],

    [`api-create${className}`]: [`Create ${modelName}`, `${modelName} 생성`],
    [`apidesc-create${className}`]: [`Create ${modelName}`, `${modelName} 생성`],
    [`arg-create${className}-data`]: [`Data of ${modelName}`, `${modelName} 데이터`],
    [`argdesc-create${className}-data`]: [`Data of ${modelName}`, `${modelName} 데이터`],

    [`api-update${className}`]: [`Update ${modelName}`, `${modelName} 수정`],
    [`apidesc-update${className}`]: [`Update ${modelName}`, `${modelName} 수정`],
    [`arg-update${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    [`argdesc-update${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    [`arg-update${className}-data`]: [`Data of ${modelName}`, `${modelName} 데이터`],
    [`argdesc-update${className}-data`]: [`Data of ${modelName}`, `${modelName} 데이터`],

    [`api-remove${className}`]: [`Remove ${modelName}`, `${modelName} 삭제`],
    [`apidesc-remove${className}`]: [`Remove ${modelName}`, `${modelName} 삭제`],
    [`arg-remove${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    [`argdesc-remove${className}-${modelName}Id`]: [`Id of ${modelName}`, `${modelName} 아이디`],
    // * ==================== Endpoint ==================== * //
  } as unknown as BaseSignalTrans<T>;
};

const needCheckDict = process.env.NEXT_PUBLIC_ENV === "debug" && process.env.NODE_ENV !== "test";
const checkModelDictCoverage = <Dictionary extends { [key: string]: Translation }>(
  modelName: string,
  dictionary: Dictionary,
  fieldMetaMap: Map<string, ConstantFieldMeta>,
  fieldKeySet: Set<string>
): void => {
  // * 1. Check necessary model translations
  [...fieldMetaMap.values()].forEach((fieldMeta) => {
    if (!fieldMeta.enum) return;
    fieldMeta.enum.forEach((value) => {
      const enumDict = dictionary[`enum-${fieldMeta.key}-${value}`] as Translation | undefined;
      const modelDict = rootDictionary[modelName] as unknown as { [key: string]: Translation | undefined } | undefined;
      const rootEnumDict = modelDict?.[`enum-${fieldMeta.key}-${value}`];
      if (!enumDict && !rootEnumDict)
        Logger.warn(`Missing enum translation: ${modelName}.enum-${fieldMeta.key}-${value}`);

      const enumDescDict = dictionary[`enumdesc-${fieldMeta.key}-${value}`] as Translation | undefined;
      const rootEnumDescDict = modelDict?.[`enumdesc-${fieldMeta.key}-${value}`];
      if (!enumDescDict && !rootEnumDescDict)
        Logger.warn(`Missing enum description: ${modelName}.enumdesc-${fieldMeta.key}-${value}`);
    });
  });
  // * 2. Check unused model translations
  Object.keys(dictionary)
    .filter((key) => key.startsWith("enum-"))
    .forEach((key) => {
      const [, fieldKey, ...values] = key.split("-");
      const value = values.join("-");
      if (!fieldMetaMap.get(fieldKey)?.enum?.includes(value))
        Logger.error(
          `Unused enum translation, need to delete: ${modelName}.enum-${fieldKey}-${value} & ${modelName}.enumdesc-${fieldKey}-${value}`
        );
    });
  Object.keys(dictionary)
    .filter((key) => key.startsWith("desc-"))
    .forEach((key) => {
      const [, fieldKey] = key.split("-");
      if (!fieldKeySet.has(fieldKey))
        Logger.error(
          `Unused description translation, need to delete: ${modelName}.${fieldKey} & ${modelName}.desc-${fieldKey}`
        );
    });
};
const checkSignalDictCoverage = <Dictionary extends { [key: string]: Translation }>(
  modelName: string,
  sigRef: Type,
  dictionary: Dictionary
): void => {
  const gqlMetas = getGqlMetas(sigRef);
  const argKeyMap = new Map<string, Set<string>>();
  // * 1. Check necessary args translations
  gqlMetas
    .filter((gqlMeta) => gqlMeta.type !== "Process")
    .forEach((gqlMeta) => {
      const [argMetas] = getArgMetas(sigRef, gqlMeta.key);
      argKeyMap.set(gqlMeta.key, new Set(argMetas.map((argMeta) => argMeta.name)));
      argMetas.forEach((argMeta) => {
        const argDict = dictionary[`arg-${gqlMeta.key}-${argMeta.name}`] as Translation | undefined;
        if (!argDict) Logger.warn(`Missing arg translation: ${modelName}.arg-${gqlMeta.key}-${argMeta.name}`);

        const argDescDict = dictionary[`argdesc-${gqlMeta.key}-${argMeta.name}`] as Translation | undefined;
        if (!argDescDict) Logger.warn(`Missing arg description: ${modelName}.argdesc-${gqlMeta.key}-${argMeta.name}`);
      });
    });
  // * 2. Check unused args translations
  Object.keys(dictionary)
    .filter((key) => key.startsWith("arg-"))
    .forEach((key) => {
      const [, gqlKey, argKey] = key.split("-");
      if (!argKeyMap.get(gqlKey)?.has(argKey))
        Logger.error(
          `Unused arg translation, need to delete: ${modelName}.arg-${gqlKey}-${argKey} & ${modelName}.argdesc-${gqlKey}-${argKey}`
        );
    });
};

export const scalarDictionaryOf = <Dictionary extends { [key: string]: Translation }>(
  modelRef: Type,
  dictionary: Dictionary,
  sigRef?: Type
): Dictionary => {
  if (!needCheckDict) return dictionary;
  const classMeta = getClassMeta(modelRef);
  const modelName = lowerlize(classMeta.refName);
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const fieldKeySet = new Set([...fieldMetaMap.keys()]);
  checkModelDictCoverage(modelName, dictionary, fieldMetaMap, fieldKeySet);
  if (sigRef) checkSignalDictCoverage(modelName, sigRef, dictionary);
  return dictionary;
};
export const signalDictionaryOf = <Dictionary extends { [key: string]: Translation }>(
  sigRef: Type,
  dictionary: Dictionary
): Dictionary => {
  if (!needCheckDict) return dictionary;
  const sigMeta = getSigMeta(sigRef);
  const modelName = lowerlize(sigMeta.refName);
  checkSignalDictCoverage(modelName, sigRef, dictionary);
  return dictionary;
};

export const dictionaryOf = <Dictionary extends { [key: string]: Translation }>(
  dictionary: Dictionary,
  constant: ConstantModel<any, any, any, any, any, any>,
  sigRef: Type
): Dictionary => {
  if (!needCheckDict) return dictionary;
  const cnstSort = getFilterSortMap(constant.Filter);
  // * 1. Check model translations
  const classMeta = getClassMeta(constant.Full);
  const modelName = lowerlize(classMeta.refName);
  const modelMetaMap = getFieldMetaMap(constant.Full);
  const insightMetaMap = getFieldMetaMap(constant.Insight);
  const fieldKeySet = new Set([...modelMetaMap.keys(), ...insightMetaMap.keys(), ...Object.keys(cnstSort)]);
  checkModelDictCoverage(modelName, dictionary, modelMetaMap, fieldKeySet);
  checkSignalDictCoverage(modelName, sigRef, dictionary);
  return dictionary;
};

type MergeDoubleDepths<T, U> = U extends undefined
  ? T
  : {
      [K in keyof T | keyof U]: K extends keyof T
        ? K extends keyof U
          ? T[K] & U[K]
          : T[K]
        : K extends keyof U
          ? U[K]
          : never;
    };
export const rootDictionary = {} as { [key: string]: { [key: string]: Translation } };
export const makeDictionary = <
  RootDict extends { [key: string]: { [key: string]: Translation } },
  Dict1 extends { [key: string]: { [key: string]: Translation } },
  Dict2 = unknown,
  Dict3 = unknown,
  Dict4 = unknown,
  Dict5 = unknown,
>(
  rootDict: RootDict,
  dict1: Dict1,
  dict2?: Dict2,
  dict3?: Dict3,
  dict4?: Dict4,
  dict5?: Dict5
): MergeDoubleDepths<
  MergeDoubleDepths<MergeDoubleDepths<MergeDoubleDepths<MergeDoubleDepths<RootDict, Dict1>, Dict2>, Dict3>, Dict4>,
  Dict5
> => {
  const dicts = [dict1, dict2, dict3, dict4, dict5].filter((d) => !!d) as {
    [key: string]: { [key: string]: Translation };
  }[];
  dicts.forEach((dict) => {
    Object.entries(dict).forEach(([key, value]) => {
      const rootValue = rootDict[key] as { [key: string]: Translation } | undefined;
      if (!rootValue) Object.assign(rootDict, { [key]: value });
      else Object.assign(rootDict[key], value);
    });
  });
  return rootDict as MergeDoubleDepths<
    MergeDoubleDepths<MergeDoubleDepths<MergeDoubleDepths<MergeDoubleDepths<RootDict, Dict1>, Dict2>, Dict3>, Dict4>,
    Dict5
  >;
};

//! Temp fix for translation
const languages =
  process.env.NEXT_PUBLIC_APP_NAME === "syrs"
    ? (["ko", "en", "ja", "th"] as const)
    : (["ko", "en", "zhChs", "zhCht"] as const);

type Language = (typeof languages)[number];
export const msg = {
  info: () => null,
  success: () => null,
  error: () => null,
  warning: () => null,
  loading: () => null,
} as {
  info: (key: TransMessage<any>, option?: { key?: string; duration?: number; data?: { [key: string]: any } }) => void;
  success: (
    key: TransMessage<any>,
    option?: { key?: string; duration?: number; data?: { [key: string]: any } }
  ) => void;
  error: (key: TransMessage<any>, option?: { key?: string; duration?: number; data?: { [key: string]: any } }) => void;
  warning: (
    key: TransMessage<any>,
    option?: { key?: string; duration?: number; data?: { [key: string]: any } }
  ) => void;
  loading: (
    key: TransMessage<any>,
    option?: { key?: string; duration?: number; data?: { [key: string]: any } }
  ) => void;
};
export const makeTrans = <Locale extends { [key: string]: { [key: string]: Translation } }>(locale: Locale) => {
  const revert = (key: TransMessage<Locale>, data?: any): never => {
    throw new Error(key);
  };
  class Revert extends Error {
    constructor(key: TransMessage<Locale>, data?: any) {
      super(key);
    }
  }
  const translate = (lang: Language, key: TransMessage<Locale>, data?: any) => {
    const langIdx = (languages as unknown as Language[]).indexOf(lang);
    const [modelName, msgKey] = key.split(".");
    const model = locale[modelName];
    const message = model[msgKey][langIdx];
    if (!message) throw new Error("Invalid message");
    return message;
  };
  return {
    revert,
    Revert,
    translate,
    msg: msg as {
      info: (
        key: TransMessage<Locale>,
        option?: { key?: string; duration?: number; data?: { [key: string]: any } }
      ) => void;
      success: (
        key: TransMessage<Locale>,
        option?: { key?: string; duration?: number; data?: { [key: string]: any } }
      ) => void;
      error: (
        key: TransMessage<Locale>,
        option?: { key?: string; duration?: number; data?: { [key: string]: any } }
      ) => void;
      warning: (
        key: TransMessage<Locale>,
        option?: { key?: string; duration?: number; data?: { [key: string]: any } }
      ) => void;
      loading: (
        key: TransMessage<Locale>,
        option?: { key?: string; duration?: number; data?: { [key: string]: any } }
      ) => void;
    },
  };
};
