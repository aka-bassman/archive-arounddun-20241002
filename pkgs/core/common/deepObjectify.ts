import { isDayjs } from "./isDayjs";

export const deepObjectify = <T = any>(obj: T | null | undefined, option: { serializable?: boolean } = {}): T => {
  if (isDayjs(obj) || obj?.constructor === Date) return (option.serializable && isDayjs(obj) ? obj.toDate() : obj) as T;
  else if (Array.isArray(obj)) {
    return obj.map((o: object) => deepObjectify(o, option)) as T;
  } else if (obj && typeof obj === "object") {
    const val = {} as { [key: string]: object };
    Object.keys(obj).forEach((key) => {
      const fieldValue = obj[key] as { __ModelType__: string } | null | undefined;
      if (fieldValue?.__ModelType__ && !option.serializable) val[key] = fieldValue;
      else if (typeof obj[key] !== "function") val[key] = deepObjectify(fieldValue, option);
    });
    return val as T;
  } else {
    return obj as unknown as T;
  }
};
