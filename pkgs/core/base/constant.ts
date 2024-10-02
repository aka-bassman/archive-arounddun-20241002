import type { FilterType } from "./types";
import type { Type } from "./scalar";

class CnstStorage {}

const setCnstMeta = (refName: string, cnst: ConstantModel<any, any, any, any, any, any>) => {
  Reflect.defineMetadata(refName, cnst, CnstStorage.prototype);
};
export const getCnstMeta = (refName: string): ConstantModel<any, any, any, any, any, any> => {
  const cnst = Reflect.getMetadata(refName, CnstStorage.prototype) as
    | ConstantModel<any, any, any, any, any, any>
    | undefined;
  if (!cnst) throw new Error(`No cnst meta for ${refName}`);
  return cnst;
};

export interface ConstantModel<
  T extends string,
  Input,
  Full,
  Light,
  Insight,
  Filter extends FilterType,
  Summary = any,
> {
  refName: T;
  Input: Type<Input>;
  Full: Type<Full>;
  Light: Type<Light>;
  Insight: Type<Insight>;
  Filter: Type<Filter>;
  Summary?: Type<Summary>;
}
export const cnstOf = <T extends string, Input, Full, Light, Insight, Filter extends FilterType, Summary>(
  refName: T,
  Input: Type<Input>,
  Full: Type<Full>,
  Light: Type<Light>,
  Insight: Type<Insight>,
  Filter: Type<Filter>,
  Summary?: Type<Summary>
): ConstantModel<T, Input, Full, Light, Insight, Filter, Summary> => {
  const cnst = { refName, Input, Full, Light, Insight, Filter, Summary };
  setCnstMeta(refName, cnst);
  return cnst;
};
