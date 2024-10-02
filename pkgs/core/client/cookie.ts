import { type Account, type Me, type MyKeyring, type Self, type Signature, dayjs, defaultAccount } from "../base";
import { CapacitorCookies } from "@capacitor/core";
import { Logger } from "../common/Logger";
import { baseClientEnv, baseEnv } from "../base/baseEnv";
import { client } from "../common/client";
import { jwtDecode } from "jwt-decode";
import { router } from "./router";
import { storage } from "./storage";
import Cookies from "js-cookie";

/* eslint-disable @typescript-eslint/no-var-requires */
export const cookies: <T = any>() => Map<string, { name: string; value: T }> =
  baseClientEnv.side === "server"
    ? (require("next/headers") as { cookies: () => Map<string, { name: string; value: any }> }).cookies
    : () => {
        const cookie = Cookies.get();
        return new Map(
          Object.entries(cookie).map(([key, value]) => [
            key,
            {
              name: key,
              value:
                typeof value === "string" && value.startsWith("j:") ? (JSON.parse(value.slice(2)) as string) : value,
            },
          ])
        );
      };

export const setCookie = (
  key: string,
  value: string,
  options: Cookies.CookieAttributes = { path: "/", sameSite: "none", secure: true }
) => {
  if (baseClientEnv.side === "server") return;
  else void CapacitorCookies.setCookie({ key, value });
};

export const getCookie = <T>(key: string): T => {
  if (baseClientEnv.side === "server") return cookies().get(key)?.value as unknown as T;
  //capacitor 문서에서 document.cookie로 가져오라고 되어었음.
  else
    return document.cookie
      .split(";")
      .find((c) => c.trim().startsWith(`${key}=`))
      ?.split("=")[1] as unknown as T;
};

export const removeCookie = (key: string, options: { path: string } = { path: "/" }) => {
  if (baseClientEnv.side === "server") return;
  else void CapacitorCookies.deleteCookie({ key });
};

export const getAccount = (): Account => {
  const jwt = getCookie<string>("jwt");
  if (!jwt) return defaultAccount;
  const account: Account = jwtDecode<Account>(jwt);
  if (account.appName !== baseEnv.appName || account.environment !== baseEnv.environment) return defaultAccount;
  return account;
};
export interface GetOption {
  unauthorize: string;
}

export function getMe<O extends GetOption | undefined>(option?: O): O extends GetOption ? Me : Me | undefined {
  const me = getAccount().me;
  if (!me && option) option.unauthorize === "notFound" ? router.notFound() : router.redirect(option.unauthorize);
  return me as unknown as Me;
}

export function getMyKeyring<O extends GetOption | undefined>(
  option?: O
): O extends GetOption ? MyKeyring : MyKeyring | undefined {
  const myKeyring = getAccount().myKeyring;
  if (!myKeyring && option)
    return option.unauthorize === "notFound" ? router.notFound() : router.redirect(option.unauthorize);
  return myKeyring as unknown as MyKeyring;
}

export function getSelf<O extends GetOption | undefined>(option?: O): O extends GetOption ? Self : Self | undefined {
  const self = getAccount().self;
  if (!self && option)
    return option.unauthorize === "notFound" ? router.notFound() : router.redirect(option.unauthorize);
  return self as unknown as Self;
}

export function getSignature<O extends GetOption | undefined>(
  option?: O
): O extends GetOption ? Signature : Signature | undefined {
  const signature = getAccount().signature;
  if (!signature && option)
    return option.unauthorize === "notFound" ? router.notFound() : router.redirect(option.unauthorize);
  return (
    signature
      ? dayjs(signature.expireAt).isAfter(dayjs())
        ? { ...signature, expireAt: dayjs(signature.expireAt) }
        : undefined
      : undefined
  ) as Signature;
}

interface SetAuthOption {
  jwt: string;
}
export const setAuth = ({ jwt }: SetAuthOption) => {
  client.setJwt(jwt);
  setCookie("jwt", jwt);
  void storage.setItem("jwt", jwt);
};

interface InitAuthOption {
  jwt?: string;
}
export const initAuth = ({ jwt }: InitAuthOption = {}) => {
  const token = jwt ?? (cookies().get("jwt")?.value as string);
  if (token) setAuth({ jwt: token });
  client.init();
  Logger.verbose(`JWT set from cookie: ${token}`);
};

export const resetAuth = () => {
  client.reset();
  removeCookie("jwt");
  void storage.removeItem("jwt");
};
