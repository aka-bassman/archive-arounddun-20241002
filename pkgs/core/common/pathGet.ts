export const pathGet = <T = any>(path: string | (string | number)[], obj: any, separator = "."): T | undefined => {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev: Record<string, any> | any[], curr) => prev[curr] as unknown, obj) as T | undefined;
};
