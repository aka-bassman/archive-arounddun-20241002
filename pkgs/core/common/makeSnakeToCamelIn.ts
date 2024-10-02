import {
  type Dayjs,
  Float,
  type GqlScalar,
  ID,
  Int,
  JSON,
  type Type,
  applyFnToArrayObjects,
  dayjs,
  getFieldMetas,
} from "@core/base";
import type { SnakeMsg } from "./types";

const camelToSnake = (key: string) => key.replace(/([A-Z])/g, (g) => `_${g.toLowerCase()}`);

const scalarParseInMap = new Map<GqlScalar, (value: any) => any>([
  [Date, (value: Date | Dayjs) => dayjs(value)],
  [String, (value: string) => value],
  [ID, (value: string) => value],
  [Boolean, (value: boolean) => value],
  [Int, (value: number) => value],
  [Float, (value: number) => value],
  [JSON, (value: any) => value as object],
]);
const getScalarParser = (scalar: GqlScalar) => {
  const parser = scalarParseInMap.get(scalar);
  if (!parser) return (value: object) => value;
  return parser;
};
const getPredefinedCamelToSnakeIn = (modelRef: Type) => {
  const existingParser = Reflect.getMetadata("makeSnakeToCamelIn", modelRef.prototype as object) as
    | ((msg: any) => any)
    | undefined;
  return existingParser;
};
const setPredefinedCamelToSnakeIn = (modelRef: Type, parser: (msg: any) => any) => {
  Reflect.defineMetadata("makeSnakeToCamelIn", parser, modelRef.prototype as object);
};

export const makeSnakeToCamelIn = <Msg>(modelRef: Type<Msg>): ((msg: SnakeMsg<Msg>) => Msg) => {
  const predefinedParser = getPredefinedCamelToSnakeIn(modelRef);
  if (predefinedParser) return predefinedParser;
  const fieldMetas = getFieldMetas(modelRef);
  const replaceInfos: { key: string; newKey: string; parser: (data: any) => any }[] = fieldMetas.map((fieldMeta) => ({
    key: camelToSnake(fieldMeta.key),
    newKey: fieldMeta.key,
    parser: fieldMeta.isClass
      ? makeSnakeToCamelIn(fieldMeta.modelRef)
      : scalarParseInMap.get(fieldMeta.modelRef) ?? ((v) => v as object),
  }));
  const parseRawMsg = (msg: SnakeMsg<Msg>): Msg => {
    if (Array.isArray(msg)) return msg.map((item) => parseRawMsg(item as SnakeMsg<Msg>)) as Msg;
    const camelMsg = Object.fromEntries(
      replaceInfos.map(({ key, newKey, parser }) => {
        return [newKey, applyFnToArrayObjects(msg[key], parser)];
      })
    );
    return camelMsg as Msg;
  };
  setPredefinedCamelToSnakeIn(modelRef, parseRawMsg);
  return parseRawMsg;
};
