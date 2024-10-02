import {
  BaseObject,
  type ConstantModel,
  type DocumentModel,
  type FilterType,
  Type,
  getClassMeta,
  getFieldMetaMap,
  setFieldMetaMap,
} from "@core/base";
import type { DatabaseModel } from "./database";
import type { FilterQuery, HydratedDocument, Model as MongooseModel, PipelineStage, Schema } from "mongoose";
export type { FilterQuery as QueryOf };

interface DefaultDocMtds<TDocument> {
  refresh(): Promise<this>;
  set(data: Partial<TDocument>): this;
  save(): Promise<this>;
}
type HydratedDocumentWithId<TDocument> = Omit<
  HydratedDocument<TDocument, DefaultDocMtds<TDocument>>,
  "id" | "set" | "save"
> & { id: string } & DefaultDocMtds<TDocument>;
export type Doc<M> = HydratedDocumentWithId<DocumentModel<M>>;

interface DefaultMdlStats<TDocument, TSchema> {
  pickOneAndWrite: (query: FilterQuery<TSchema>, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickAndWrite: (docId: string, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickOne: (query: FilterQuery<TSchema>) => Promise<TDocument>;
  pickById: (docId: string | undefined) => Promise<TDocument>;
  addSummary: (prefix?: string | string[], num?: number) => Promise<void>;
  moveSummary: (prev: string, next: string, num?: number) => Promise<void>;
  subSummary: (prefix?: string | string[], num?: number) => Promise<void>;
  sample: (query: FilterQuery<TSchema>, size?: number, aggregations?: PipelineStage[]) => Promise<TDocument[]>;
  sampleOne: (query: FilterQuery<TSchema>, aggregations?: PipelineStage[]) => Promise<TDocument | null>;
}
export type Mdl<Doc extends HydratedDocument<any>, Raw> = MongooseModel<Raw, unknown, unknown, unknown, Doc> &
  DefaultMdlStats<Doc, DocumentModel<Raw>>;
export type SchemaOf<Mdl, Doc> = Schema<null, Mdl, Doc, undefined, null, Mdl>;
export interface BaseMiddleware {
  onSchema: (schema: SchemaOf<any, any>) => void;
}

export interface Database<
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
> {
  refName: T;
  Input: Type<Input>;
  Doc: Type<Doc>;
  Model: Type<Model>;
  Middleware: Type<Middleware>;
  Obj: Type<Obj>;
  Insight: Type<Insight>;
  Filter: Type<Filter>;
  Summary?: Type<Summary>;
}
export const dbOf = <
  T extends string,
  Input,
  Doc extends HydratedDocument<any>,
  Model extends DatabaseModel<T, Input, any, Obj, Insight, Filter>,
  Middleware extends BaseMiddleware,
  Obj,
  Insight,
  Filter extends FilterType,
  Summary,
>(
  refName: T,
  Input: Type<Input>,
  Doc: Type<Doc>,
  Model: Type<Model>,
  Middleware: Type<Middleware>,
  Obj: Type<Obj>,
  Insight: Type<Insight>,
  Filter: Type<Filter>,
  Summary?: Type<Summary>
): Database<T, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary> => {
  return { refName, Input, Doc, Model, Middleware, Obj, Insight, Filter, Summary };
};

export class InputDatabaseStorage {}
export class DocumentDatabaseStorage {}
export class ModelDatabaseStorage {}
export class MiddlewareDatabaseStorage {}

export const getAllDatabaseModelNames = () => {
  const modelNames = (Reflect.getMetadataKeys(ModelDatabaseStorage.prototype) as string[] | undefined) ?? [];
  return modelNames;
};

export const Database = {
  Input: (returns: () => Type) => {
    return function (target: any) {
      const modelRef = returns();
      const classMeta = getClassMeta(modelRef);
      Reflect.defineMetadata(classMeta.refName, target, InputDatabaseStorage.prototype);
    };
  },
  Document: (returns: () => Type) => {
    return function (target: any) {
      const modelRef = returns();
      const classMeta = getClassMeta(modelRef);
      Reflect.defineMetadata(classMeta.refName, target, DocumentDatabaseStorage.prototype);
    };
  },
  Model: (returns: () => Type) => {
    return function (target: any) {
      const modelRef = returns();
      const classMeta = getClassMeta(modelRef);
      Reflect.defineMetadata(classMeta.refName, target, ModelDatabaseStorage.prototype);
    };
  },
  Middleware: (returns: () => Type) => {
    return function (target: any) {
      const modelRef = returns();
      const classMeta = getClassMeta(modelRef);
      Reflect.defineMetadata(classMeta.refName, target, MiddlewareDatabaseStorage.prototype);
    };
  },
};

export const Model = <Doc, T extends string, Input, Full, Light, Insight, Summary, Filter extends FilterType>(
  docRef: Type<Doc>,
  cnst: ConstantModel<T, Input, Full, Light, Insight, Filter, Summary>
): Type<DatabaseModel<T, DocumentModel<Input>, Doc, Full, Insight, Filter, Summary>> => {
  class DefaultModel {}
  return DefaultModel as unknown as Type<DatabaseModel<T, DocumentModel<Input>, Doc, Full, Insight, Filter, Summary>>;
};

export const AddModel = <Doc, T extends string, Input, Full, Light, Insight, Filter extends FilterType, Summary>(
  modelRef: Type,
  cnst: ConstantModel<T, Input, Full, Light, Insight, Filter, Summary>
): Type<DatabaseModel<T, DocumentModel<Input>, Doc, Full, Insight, Filter, Summary>> => {
  return modelRef as unknown as Type<DatabaseModel<T, DocumentModel<Input>, Doc, Full, Insight, Filter, Summary>>;
};

export const Input = <InputModel>(inputRef: Type<InputModel>): Type<DocumentModel<InputModel>> => {
  return inputRef as unknown as Type<DocumentModel<InputModel>>;
};
export const AddInput = <A, B>(modelRef: Type<A>, addRef: Type<B>): Type<A & DocumentModel<B>> => {
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const addFieldMetas = getFieldMetaMap(addRef);
  setFieldMetaMap(modelRef, new Map([...fieldMetaMap, ...addFieldMetas]));
  return modelRef as unknown as Type<A & DocumentModel<B>>;
};

export const Document = <ObjectModel>(
  objectRef: Type<ObjectModel>
): Type<ObjectModel extends BaseObject ? Doc<ObjectModel> : DocumentModel<ObjectModel>> => {
  return objectRef as unknown as Type<ObjectModel extends BaseObject ? Doc<ObjectModel> : DocumentModel<ObjectModel>>;
};
export const AddDocument = <A, B>(modelRef: Type<A>, addRef: Type<B>): Type<A & Doc<B>> => {
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const addFieldMetas = getFieldMetaMap(addRef);
  setFieldMetaMap(modelRef, new Map([...fieldMetaMap, ...addFieldMetas]));
  return modelRef as unknown as Type<A & Doc<B>>;
};

export const Middleware = <DbModel, Doc>(model: Type<DbModel>, doc: Type<Doc>) => {
  return class Middleware {
    onSchema(schema: SchemaOf<DbModel, Doc>) {
      //
    }
  };
};
