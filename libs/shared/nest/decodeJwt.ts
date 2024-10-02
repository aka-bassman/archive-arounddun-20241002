import { decode } from "jsonwebtoken";

export const decodeJwt = <T = { [key: string]: any }>(token: string) => {
  return decode(token) as T;
};
