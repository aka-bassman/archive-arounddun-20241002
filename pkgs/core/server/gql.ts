import * as Nest from "@nestjs/graphql";
import {
  BaseObject,
  ConstantFieldMeta,
  Dayjs,
  DocumentModel,
  Float,
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
} from "../base";
import { Doc } from "./dbDecorators";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { default as GraphQLJSON } from "graphql-type-json";
import { Kind, ValueNode } from "graphql";
import { isDayjs } from "dayjs";

@Nest.Scalar("Date", () => Date)
export class DateScalar implements Nest.CustomScalar<Date, Dayjs> {
  description = "Date custom scalar type";
  parseValue(value: number) {
    return dayjs(value); // value from the client
  }
  serialize(value: Dayjs): Date {
    if (isDayjs(value))
      return value.toDate(); // value sent to the client
    else return new Date(value);
  }
  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.INT) return dayjs(ast.value);
    else if (ast.kind === Kind.STRING) return dayjs(ast.value);
    else return null as unknown as Dayjs;
  }
}

class ObjectGqlStorage {}
class InputGqlStorage {}

const getPredefinedInqutGql = (refName: string) => {
  const inputGql = Reflect.getMetadata(refName, InputGqlStorage.prototype) as Type | undefined;
  return inputGql;
};
const setPredefinedInqutGql = (refName: string, inputGql: Type) => {
  Reflect.defineMetadata(refName, inputGql, InputGqlStorage.prototype);
};
const getPredefinedObjectGql = (refName: string) => {
  const objectGql = Reflect.getMetadata(refName, ObjectGqlStorage.prototype) as Type | undefined;
  return objectGql;
};
const setPredefinedObjectGql = (refName: string, objectGql: Type) => {
  Reflect.defineMetadata(refName, objectGql, ObjectGqlStorage.prototype);
};

const gqlNestFieldMap = new Map<any, any>([
  [ID, Nest.ID],
  [Int, Nest.Int],
  [Float, Nest.Float],
  [JSON, GraphQLJSON],
  [Map, GraphQLJSON],
]);
export const applyNestField = (model: Type, fieldMeta: ConstantFieldMeta, type: "object" | "input" = "object") => {
  if (fieldMeta.fieldType === "hidden" && type === "object") return;
  const modelRef = (
    fieldMeta.isClass
      ? type === "object"
        ? generateGql(fieldMeta.modelRef)
        : fieldMeta.isScalar
          ? generateGqlInput(fieldMeta.modelRef)
          : Nest.ID
      : (gqlNestFieldMap.get(fieldMeta.modelRef) ?? fieldMeta.modelRef)
  ) as Type;
  Field(() => arraiedModel(modelRef, fieldMeta.arrDepth), { nullable: fieldMeta.nullable })(
    model.prototype as object,
    fieldMeta.key
  );
};
export const generateGqlInput = <InputModel>(inputRef: Type<InputModel>): Type<DocumentModel<InputModel>> => {
  const classMeta = getClassMeta(inputRef);
  const predefinedInputGql = getPredefinedInqutGql(classMeta.refName);
  if (predefinedInputGql) return predefinedInputGql;
  const fieldMetas = getFieldMetas(inputRef);
  class InputGql {}
  const inputGql = classMeta.type === "scalar" ? InputGql : getInputModelRef(classMeta.refName);
  fieldMetas.forEach((fieldMeta) => {
    applyNestField(inputGql, fieldMeta, "input");
  });
  InputType(classMeta.refName + (classMeta.type === "scalar" ? "Input" : ""))(inputGql);
  setPredefinedInqutGql(classMeta.refName, inputGql);
  return inputGql;
};

export const generateGql = <ObjectModel>(
  objectRef: Type<ObjectModel>
): Type<ObjectModel extends BaseObject ? Doc<ObjectModel> : DocumentModel<ObjectModel>> => {
  const classMeta = getClassMeta(objectRef);
  if (classMeta.type === "light") {
    const fullModelRefName = classMeta.refName.slice(5);
    const fullModelRef = getFullModelRef(fullModelRefName);
    return generateGql(fullModelRef);
  }
  const predefinedObjectGql = getPredefinedObjectGql(classMeta.refName);
  if (predefinedObjectGql) return predefinedObjectGql;
  const fieldMetas = getFieldMetas(objectRef);
  class ObjectGql {}
  const objectGql = classMeta.type === "scalar" ? ObjectGql : getFullModelRef(classMeta.refName);
  fieldMetas.forEach((fieldMeta) => {
    applyNestField(objectGql, fieldMeta);
  });
  ObjectType(classMeta.refName)(objectGql);
  setPredefinedObjectGql(classMeta.refName, objectGql);
  return objectGql;
};
