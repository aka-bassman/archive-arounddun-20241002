import { ArgMeta, SignalType, getArgMetas, getGqlMeta } from "./signalDecorators";
import {
  JSON as GqlJSON,
  type Type,
  arraiedModel,
  getFieldMetas,
  getNonArrayModel,
  getScalarExample,
  isGqlScalar,
} from "./scalar";

class ResponseExampleStorage {}

const getPredefinedRequestExample = (modelRef: Type) => {
  return Reflect.getMetadata(modelRef, ResponseExampleStorage.prototype) as { [key: string]: any } | undefined;
};
const getPredefinedResponseExample = (modelRef: Type) => {
  return Reflect.getMetadata(modelRef, ResponseExampleStorage.prototype) as { [key: string]: any } | undefined;
};

const getResponseExample = (ref: Type) => {
  const [modelRef, arrDepth] = getNonArrayModel<Type>(ref);
  const existing = getPredefinedRequestExample(modelRef);
  if (existing) return existing;
  const isScalar = isGqlScalar(modelRef);
  if (isScalar) return arraiedModel(getScalarExample(modelRef), arrDepth);
  const fieldMetas = getFieldMetas(modelRef);
  const example: { [key: string]: any } = {};
  fieldMetas.forEach((fieldMeta) => {
    if (fieldMeta.example) example[fieldMeta.key] = fieldMeta.example;
    else if (fieldMeta.enum)
      example[fieldMeta.key] = arraiedModel<string>(fieldMeta.enum[0] as string, fieldMeta.arrDepth);
    else example[fieldMeta.key] = getResponseExample(fieldMeta.modelRef);
  });
  const result = arraiedModel(example, arrDepth);
  Reflect.defineMetadata(ref, result, ResponseExampleStorage.prototype);
  return result;
};

class RequestExampleStorage {}

const getRequestExample = (ref: Type) => {
  const existing = getPredefinedRequestExample(ref);
  if (existing) return existing;
  const fieldMetas = getFieldMetas(ref);
  const example = {};
  const isScalar = isGqlScalar(ref);
  if (isScalar) return getScalarExample(ref);
  else {
    fieldMetas.forEach((fieldMeta) => {
      if (!fieldMeta.isScalar && fieldMeta.isClass) example[fieldMeta.key] = "ObjectID";
      else
        example[fieldMeta.key] =
          fieldMeta.example ?? fieldMeta.enum
            ? arraiedModel(fieldMeta.example ?? (fieldMeta.enum as string[])[0], fieldMeta.optArrDepth)
            : arraiedModel(getRequestExample(fieldMeta.modelRef), fieldMeta.arrDepth);
    });
  }

  Reflect.defineMetadata(ref, example, RequestExampleStorage.prototype);
  return example;
};

export const makeRequestExample = (sigRef: Type, key: string) => {
  const [argMetas] = getArgMetas(sigRef, key);
  return getExampleData(argMetas);
};
export const getExampleData = (argMetas: ArgMeta[], signalType: SignalType = "graphql"): { [key: string]: any } =>
  Object.fromEntries(
    argMetas
      .filter((argMeta) => argMeta.type !== "Upload")
      .map((argMeta) => {
        const [argRef, argArrDepth] = getNonArrayModel<Type>(argMeta.returns() as Type);
        const example = argMeta.argsOption.example ?? getRequestExample(argRef);
        return [
          argMeta.name,
          arraiedModel(
            signalType === "restapi" && argRef.prototype === GqlJSON.prototype
              ? JSON.stringify(example, null, 2)
              : example,
            argArrDepth
          ),
        ];
      })
  );

export const makeResponseExample = (sigRef: Type, key: string) => {
  const gqlMeta = getGqlMeta(sigRef, key);
  const example = getResponseExample(gqlMeta.returns());
  return example;
};
