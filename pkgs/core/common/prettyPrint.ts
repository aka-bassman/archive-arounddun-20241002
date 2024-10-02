/* eslint-disable @typescript-eslint/restrict-plus-operands */
export const prettyPrint = (data: any): string => {
  if (Array.isArray(data))
    return data.length ? (data.reduce((acc, cur) => `${acc}, ${prettyPrint(cur)}`, "") as string) : "empty";
  else if (typeof data === "object") return JSON.stringify(data, null, 2);
  else return data as string;
};
