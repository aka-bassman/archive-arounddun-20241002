import { ConstantClassMeta, type Type, getClassMeta, getFieldMetas } from "./scalar";
import { capitalize } from "../common/capitalize";
import { setFilterMeta } from "./filterMeta";
export class InputModelStorage {}
export class LightModelStorage {}
export class FullModelStorage {}
export class ScalarModelStorage {}
export class FilterModelStorage {}

export const getFullModelRef = (refName: string) => {
  const modelRef = Reflect.getMetadata(capitalize(refName), FullModelStorage.prototype) as Type | undefined;
  if (!modelRef) throw new Error(`FullModel not found - ${refName}`);
  return modelRef;
};
export const getInputModelRef = (refName: string) => {
  const modelRef = Reflect.getMetadata(capitalize(refName), InputModelStorage.prototype) as Type | undefined;
  if (!modelRef) throw new Error(`InputModel not found - ${refName}`);
  return modelRef;
};
export const getScalarModelRef = (refName: string) => {
  const modelRef = Reflect.getMetadata(capitalize(refName), ScalarModelStorage.prototype) as Type | undefined;
  if (!modelRef) throw new Error(`ScalarModel not found - ${refName}`);
  return modelRef;
};

export const getChildClassRefs = (target: Type): Type[] => {
  const metadatas = getFieldMetas(target);
  const refMap = new Map<string, Type>();
  const childRefs = metadatas
    .filter((metadata) => metadata.isClass)
    .reduce((acc: Type[], metadata) => {
      return [...acc, metadata.modelRef, ...getChildClassRefs(metadata.modelRef)];
    }, []);
  childRefs
    .filter((modelRef, idx) => childRefs.findIndex((ref) => ref.prototype === modelRef.prototype) === idx)
    .map((modelRef) => refMap.set(getClassMeta(modelRef).refName, modelRef)); // remove duplicates
  return [...refMap.values()];
};

export const hasTextField = (modelRef: Type): boolean => {
  const fieldMetas = getFieldMetas(modelRef);
  return fieldMetas.some(
    (fieldMeta) =>
      !!fieldMeta.text ||
      (fieldMeta.isScalar && fieldMeta.isClass && fieldMeta.select && hasTextField(fieldMeta.modelRef))
  );
};

export type ClassType = "light" | "full" | "input" | "scalar";
const applyClassMeta = (type: ClassType, storage: Type) => {
  return function (refName: string) {
    return function (target: Type) {
      const modelRef = target;
      const classMeta: ConstantClassMeta = { refName, type, modelRef, hasTextField: hasTextField(modelRef) };
      Reflect.defineMetadata("class", classMeta, modelRef.prototype as object);
      Reflect.defineMetadata(refName, modelRef, storage.prototype as object);
    };
  };
};
const applyFilterMeta = (storage: Type) => {
  return function (refName: string) {
    return function (target: Type) {
      const modelRef = target;
      setFilterMeta(modelRef, { refName, sort: {} });
      Reflect.defineMetadata(refName, modelRef, storage.prototype as object);
    };
  };
};

export const Model = {
  Light: applyClassMeta("light", LightModelStorage),
  Object: applyClassMeta("full", FullModelStorage),
  Full: applyClassMeta("full", FullModelStorage),
  Input: applyClassMeta("input", InputModelStorage),
  Scalar: applyClassMeta("scalar", ScalarModelStorage),
  Summary: applyClassMeta("scalar", ScalarModelStorage),
  Insight: applyClassMeta("scalar", ScalarModelStorage),
  Filter: applyFilterMeta(FilterModelStorage),
};

export const getLightModelRef = (modelRef: Type) => {
  const classMeta = getClassMeta(modelRef);
  if (classMeta.type !== "full") return modelRef;
  const lightModelRef = Reflect.getMetadata(`Light${classMeta.refName}`, LightModelStorage.prototype as object) as
    | Type
    | undefined;
  if (!lightModelRef) throw new Error(`LightModel not found - ${classMeta.refName}`);
  return lightModelRef;
};
