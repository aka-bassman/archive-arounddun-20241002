/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type BaseMiddleware, ObjectId, applyNestField } from ".";
import {
  ConstantFieldMeta,
  Dayjs,
  Float,
  type GqlScalar,
  ID,
  Int,
  JSON,
  Type,
  arraiedModel,
  dayjs,
  getClassMeta,
  getFieldMetas,
  getFullModelRef,
  getInputModelRef,
  makeDefault,
} from "../base";
import { FilterQuery, PipelineStage, Schema, Types, isValidObjectId } from "mongoose";
import { isDayjs } from "../common/isDayjs";
import { isValidDate } from "../common/isValidDate";

class ScalarSchemaStorage {}
class SchemaStorage {}

export const getDefaultSchemaOptions = <TSchema, TDocument>() => ({
  toJSON: { getters: false, virtuals: true },
  toObject: { getters: false, virtuals: true },
  _id: true,
  id: true,
  timestamps: true,
  methods: {
    refresh: async function () {
      Object.assign(this, await this.constructor.findById(this._id));
      return this;
    },
  },
  statics: {
    pickOne: async function (query: FilterQuery<TSchema>): Promise<TDocument> {
      const doc = await this.findOne(query);
      if (!doc) throw new Error("No Document");
      return doc;
    },
    pickById: async function (docId: string | undefined): Promise<TDocument> {
      if (!docId) throw new Error("No Document ID");
      const doc = await this.findById(docId);
      if (!doc) throw new Error("No Document");
      return doc;
    },
    sample: async function (
      query: FilterQuery<TSchema>,
      size = 1,
      aggregations: PipelineStage[] = []
    ): Promise<TDocument[]> {
      const objs = await this.aggregate([
        { $match: convertAggregateMatch(query) },
        { $sample: { size } },
        ...aggregations,
      ]);
      return objs.map((obj) => new this(obj) as TDocument);
    },
    sampleOne: async function (
      query: FilterQuery<TSchema>,
      aggregations: PipelineStage[] = []
    ): Promise<TDocument | null> {
      const obj = await this.aggregate([
        { $match: convertAggregateMatch(query) },
        { $sample: { size: 1 } },
        ...aggregations,
      ]);
      return obj.length ? new this(obj[0]) : null;
    },
    addSummary: async function (prefix = "total", num = 1): Promise<void> {
      const update = Array.isArray(prefix)
        ? {
            $inc: {
              ...prefix.reduce((acc, cur) => ({ ...acc, [`${cur}${this.modelName}`]: num }), {}),
            },
          }
        : { $inc: { [`${prefix}${this.modelName}`]: num } };
      await this.db.collection("summaries").updateOne({ status: "active" }, update);
    },
    moveSummary: async function (prev: string, next: string, num = 1): Promise<void> {
      await this.db.collection("summaries").updateOne(
        { status: "active" },
        {
          $inc: {
            [`${prev}${this.modelName}`]: -num,
            [`${next}${this.modelName}`]: num,
          },
        }
      );
    },
    subSummary: async function (prefix = "total", num = 1): Promise<void> {
      const update = Array.isArray(prefix)
        ? {
            $inc: {
              ...prefix.reduce((acc, cur) => ({ ...acc, [`${cur}${this.modelName}`]: -num }), {}),
            },
          }
        : { $inc: { [`${prefix}${this.modelName}`]: -num } };
      await this.db.collection("summaries").updateOne({ status: "active" }, update);
    },
  },
});

const scalarMongoTypeMap = new Map<GqlScalar, any>([
  [ID, ObjectId],
  [Int, Number],
  [Float, Number],
  [JSON, Schema.Types.Mixed],
  [Map, Map],
  [String, String],
  [Boolean, Boolean],
  [Date, Date],
]);
const applyMongoProp = (schemaProps: any, fieldMeta: ConstantFieldMeta) => {
  if (["id", "createdAt", "updatedAt"].includes(fieldMeta.key) || fieldMeta.fieldType === "resolve") return;
  const type = fieldMeta.isClass
    ? fieldMeta.isScalar
      ? createSchema(fieldMeta.modelRef)
      : ObjectId
    : (scalarMongoTypeMap.get(fieldMeta.modelRef) ?? fieldMeta.modelRef);
  let prop: any = {};
  if (fieldMeta.optArrDepth) {
    prop.type = type;
    prop.required = true;
    if (fieldMeta.isClass && !fieldMeta.refPath) prop.ref = getClassMeta(fieldMeta.modelRef).refName;
    if (fieldMeta.refPath) prop.refPath = fieldMeta.refPath;
    if (typeof fieldMeta.min === "number") prop.min = fieldMeta.min;
    if (typeof fieldMeta.max === "number") prop.max = fieldMeta.max;
    if (fieldMeta.enum) prop.enum = [...fieldMeta.enum, ...(fieldMeta.nullable ? [null] : [])];
    if (typeof fieldMeta.minlength === "number") prop.minlength = fieldMeta.minlength;
    if (typeof fieldMeta.maxlength === "number") prop.maxlength = fieldMeta.maxlength;
    if (fieldMeta.validate) {
      prop.validate = function (value: any) {
        return fieldMeta.validate?.(fieldMeta.name === "Date" && !!value ? dayjs() : value, this) ?? true;
      };
    }
    prop = { type: arraiedModel(prop, fieldMeta.optArrDepth), default: [], required: true };
    if (fieldMeta.modelRef.prototype === Date.prototype) {
      prop.get = (dates: Date[]) => dates.map((date) => dayjs(date));
      prop.set = (days: Dayjs[]) => days.map((day) => day.toDate());
    }
    if ((fieldMeta.isClass && !fieldMeta.isScalar) || fieldMeta.modelRef.prototype === ID.prototype) {
      prop.get = (ids: Types.ObjectId[]) => ids.map((id) => id.toString());
      prop.set = (ids: string[]) => ids.map((id) => new Types.ObjectId(id));
    }
  } else {
    prop.type = arraiedModel(type, fieldMeta.arrDepth);
    prop.required = !fieldMeta.nullable;
    if (fieldMeta.isMap) {
      prop.of = scalarMongoTypeMap.get(fieldMeta.of as Type) ?? createSchema(fieldMeta.of as Type);
      if (!fieldMeta.default) prop.default = new Map();
    }
    if (fieldMeta.default !== null) {
      if (typeof fieldMeta.default === "function")
        prop.default = function () {
          const def = fieldMeta.default(this);
          return isDayjs(def) ? def.toDate() : def;
        };
      else prop.default = isDayjs(fieldMeta.default) ? fieldMeta.default.toDate() : fieldMeta.default;
    }
    if (typeof fieldMeta.immutable !== "undefined") prop.immutable = fieldMeta.immutable;
    if (fieldMeta.isClass && !fieldMeta.refPath) prop.ref = getClassMeta(fieldMeta.modelRef).refName;
    if (fieldMeta.refPath) prop.refPath = fieldMeta.refPath;
    if (typeof fieldMeta.min === "number") prop.min = fieldMeta.min;
    if (typeof fieldMeta.max === "number") prop.max = fieldMeta.max;
    if (fieldMeta.enum) prop.enum = [...fieldMeta.enum, ...(fieldMeta.nullable ? [null] : [])];
    if (typeof fieldMeta.select === "boolean") prop.select = fieldMeta.select;
    if (typeof fieldMeta.minlength === "number") prop.minlength = fieldMeta.minlength;
    if (typeof fieldMeta.maxlength === "number") prop.maxlength = fieldMeta.maxlength;
    if (fieldMeta.nullable) {
      prop.get = (v) => (v === undefined ? undefined : v);
      prop.set = (v) => (v === null ? undefined : v);
    }
    if (fieldMeta.modelRef.prototype === Date.prototype) {
      prop.get = (date: Date | null) => (date ? dayjs(date) : undefined);
      prop.set = (day: Dayjs | null) => (day ? dayjs(day).toDate() : undefined);
    }
    if ((fieldMeta.isClass && !fieldMeta.isScalar) || fieldMeta.modelRef.prototype === ID.prototype) {
      prop.get = (id: Types.ObjectId | null) => (id ? id.toString() : undefined);
      prop.set = (id: string | null) => (id ? new Types.ObjectId(id) : undefined);
    }

    if (fieldMeta.isClass && fieldMeta.isScalar && fieldMeta.default === null && !fieldMeta.nullable) {
      prop.default = makeDefault(fieldMeta.modelRef);
    }
    if (fieldMeta.validate) {
      prop.validate = function (value: any) {
        return fieldMeta.validate?.(fieldMeta.name === "Date" && !!value ? dayjs() : value, this) ?? true;
      };
    }
  }
  schemaProps[fieldMeta.key] = prop;
};
const createSchema = <Mdl, DocMtds, QryHelps, MdlStats>(
  modelRef: Type
): Schema<null, Mdl, DocMtds, QryHelps, null, MdlStats> => {
  const classMeta = getClassMeta(modelRef);
  const schemaMeta = Reflect.getMetadata(classMeta.refName, ScalarSchemaStorage.prototype);
  if (schemaMeta) return schemaMeta;
  const fieldMetas = getFieldMetas(modelRef);
  const schemaProps = {};
  fieldMetas.forEach((fieldMeta) => {
    applyMongoProp(schemaProps, fieldMeta);
  });
  const schema = new Schema(schemaProps);
  Reflect.defineMetadata(classMeta.refName, schema, ScalarSchemaStorage.prototype);
  return schema as any;
};

export const schemaOf = <Mdl, Doc, Middleware extends BaseMiddleware>(
  modelRef: Type<Mdl>,
  docRef: Type<Doc>,
  middleware: Type<Middleware>
): Schema<null, Mdl, Doc, undefined, null, Mdl> => {
  const classMeta = getClassMeta(docRef);
  const schemaMeta = Reflect.getMetadata(classMeta.refName, SchemaStorage.prototype);
  if (schemaMeta) return schemaMeta;
  const fieldMetas = getFieldMetas(docRef);
  const schemaProps = {
    createdAt: {
      type: Date,
      get: (date: Date | null) => (date ? dayjs(date) : date),
      set: (day: Dayjs | null) => (day ? dayjs(day).toDate() : day),
    },
    updatedAt: {
      type: Date,
      get: (date: Date | null) => (date ? dayjs(date) : date),
      set: (day: Dayjs | null) => (day ? dayjs(day).toDate() : day),
    },
  };
  fieldMetas.forEach((fieldMeta) => {
    applyMongoProp(schemaProps, fieldMeta);
  });
  const schema: any = new Schema(schemaProps, getDefaultSchemaOptions());
  schema.methods.refresh = async function (this: any) {
    Object.assign(this, await this.constructor.findById(this._id));
    return this;
  };
  Object.getOwnPropertyNames(docRef.prototype).forEach((name) => {
    if (name === "constructor") return;
    schema.methods[name] = Object.getOwnPropertyDescriptor(docRef.prototype, name)?.value;
  });

  schema.pre("save", async function (next) {
    const model = this.constructor;
    if (this.isNew) model.addSummary(["total", this.status]);
    else if (!!this.removedAt && this.isModified("removedAt")) model.subSummary(["total", this.status]);
    next();
  });

  const onSchema = Object.getOwnPropertyDescriptor(middleware.prototype, "onSchema")?.value;
  onSchema?.(schema);
  schema.index({ removedAt: -1 });
  Reflect.defineMetadata(classMeta.refName, schema, SchemaStorage.prototype);
  return schema;
};

export const addSchema = <Mdl, Doc, Input, Middleware extends BaseMiddleware>(
  modelRef: Type<Mdl>,
  docRef: Type<Doc>,
  inputRef: Type<Input>,
  middleware: Type<Middleware>
): Schema<null, Mdl, Doc, undefined, null, Mdl> => {
  const originDocClassMeta = getClassMeta(docRef);
  const originInputClassMeta = getClassMeta(inputRef);
  const originDoc = getFullModelRef(originDocClassMeta.refName);
  const originInput = getInputModelRef(originInputClassMeta.refName);
  const classMeta = getClassMeta(docRef);
  const modelSchema = Reflect.getMetadata(classMeta.refName, SchemaStorage.prototype);
  if (!modelSchema) throw new Error(`Schema of ${classMeta.refName} not found`);
  const fieldMetas = getFieldMetas(docRef);
  const schemaProps = {
    createdAt: {
      type: Date,
      get: (date: Date | null) => (date ? dayjs(date) : date),
      set: (day: Dayjs | null) => (day ? dayjs(day).toDate() : day),
    },
    updatedAt: {
      type: Date,
      get: (date: Date | null) => (date ? dayjs(date) : date),
      set: (day: Dayjs | null) => (day ? dayjs(day).toDate() : day),
    },
  };
  fieldMetas.forEach((fieldMeta) => {
    applyMongoProp(schemaProps, fieldMeta);
    applyNestField(originDoc, fieldMeta);
  });
  const inputFieldMetas = getFieldMetas(inputRef);
  inputFieldMetas.forEach((fieldMeta) => {
    applyNestField(originInput, fieldMeta, "input");
  });
  const schema = new Schema(schemaProps, getDefaultSchemaOptions());
  modelSchema.add(schema as any);

  Object.getOwnPropertyNames(docRef.prototype).forEach((name) => {
    if (name === "constructor") return;
    modelSchema.methods[name] = Object.getOwnPropertyDescriptor(docRef.prototype, name)?.value;
  });
  const onSchema = Object.getOwnPropertyDescriptor(middleware.prototype, "onSchema")?.value;
  onSchema?.(modelSchema);
  return modelSchema;
};

const convertOperatorValue = (value: any) => {
  if (Array.isArray(value)) return value.map((v) => convertOperatorValue(v));
  else if (!value) return value;
  else if (isValidObjectId(value)) return new Types.ObjectId(value as string);
  else if (isValidDate(value as Date)) return dayjs(value as Date).toDate();
  else if (value.constructor !== Object) return value;
  else if (typeof value !== "object") return value;
  else
    return Object.fromEntries(
      Object.entries(value as object).map(([key, value]) => [key, convertOperatorValue(value)])
    );
};
export const convertAggregateMatch = (query: any) => {
  return Object.fromEntries(
    Object.entries(query as object).map(([key, value]: [string, any]) => {
      return [key, convertOperatorValue(value)];
    })
  );
};
