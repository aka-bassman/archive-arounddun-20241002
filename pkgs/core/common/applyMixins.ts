import type { Type } from "@core/base";

const getAllPropertyDescriptors = (objRef: Type): { [key: string]: PropertyDescriptor } => {
  const descriptors: { [key: string]: any } = {};
  let current = objRef.prototype as object | null;
  while (current) {
    Object.getOwnPropertyNames(current).forEach((name) => {
      if (!descriptors[name]) {
        descriptors[name] = Object.getOwnPropertyDescriptor(current, name);
      }
    });
    current = Object.getPrototypeOf(current) as Type | object;
  }
  return descriptors;
};

export const applyMixins = (derivedCtor: Type, constructors: (Type | undefined)[]) => {
  constructors.forEach((baseCtor: Type) => {
    Object.entries(getAllPropertyDescriptors(baseCtor)).forEach(([name, descriptor]) => {
      if (name === "constructor") return;
      Object.defineProperty(derivedCtor.prototype, name, { ...descriptor, configurable: true });
    });
  });
};
