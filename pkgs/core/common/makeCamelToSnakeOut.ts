import {
  type Dayjs,
  Float,
  type GqlScalar,
  ID,
  Int,
  JSON,
  type Type,
  applyFnToArrayObjects,
  getFieldMetas,
} from "@core/base";
import type { SnakeMsg } from "./types";

const camelToSnake = (key: string) => key.replace(/([A-Z])/g, (g) => `_${g.toLowerCase()}`);

const scalarParseOutMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Dayjs) => value.toDate()],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [JSON, (value: any) => value as object],
]);
const getScalarParser = (scalar: GqlScalar) => {
  const parser = scalarParseOutMap.get(scalar);
  if (!parser) return (value: object) => value;
  return parser;
};
const getPredefinedCamelToSnakeOut = (modelRef: Type) => {
  const existingParser = Reflect.getMetadata("makeCamelToSnakeOut", modelRef.prototype as object) as
    | ((msg: any) => any)
    | undefined;
  return existingParser;
};
const setPredefinedCamelToSnakeOut = (modelRef: Type, parser: (msg: any) => any) => {
  Reflect.defineMetadata("makeCamelToSnakeOut", parser, modelRef.prototype as object);
};
export const makeCamelToSnakeOut = <Msg>(modelRef: Type<Msg>, serialize = true): ((msg: Msg) => SnakeMsg<Msg>) => {
  const predefinedParser = getPredefinedCamelToSnakeOut(modelRef);
  if (predefinedParser) return predefinedParser;
  const fieldMetas = getFieldMetas(modelRef);
  const replaceInfos: { key: string; newKey: string; parser: (data: any) => any }[] = fieldMetas.map((fieldMeta) => ({
    key: fieldMeta.key,
    newKey: camelToSnake(fieldMeta.key),
    parser: fieldMeta.isClass
      ? makeCamelToSnakeOut(fieldMeta.modelRef)
      : serialize
        ? getScalarParser(fieldMeta.modelRef)
        : (v) => v as object,
  }));
  const parseRawMsg = (msg: Msg): SnakeMsg<Msg> => {
    if (Array.isArray(msg)) return msg.map((item) => parseRawMsg(item as Msg)) as SnakeMsg<Msg>;
    const rawMsg = Object.fromEntries(
      replaceInfos.map(({ key, newKey, parser }) => {
        return [newKey, applyFnToArrayObjects(msg[key], parser)];
      })
    );
    return rawMsg as SnakeMsg<Msg>;
  };
  setPredefinedCamelToSnakeOut(modelRef, parseRawMsg);
  return parseRawMsg;
};
