/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger } from "../common/Logger";
import { type TransMessage, type Translation, baseClientEnv } from "../base";
import { pathGet } from "../common/pathGet";
import type { ReactNode } from "react";

const getPageInfo = (): { locale: string; path: string } => {
  if (baseClientEnv.side !== "server") {
    // client side, has window object
    return {
      locale: window.location.pathname.split("/")[1] ?? "en",
      path: "/" + window.location.pathname.split("/").slice(2).join("/"),
    };
  }
  const nextHeaders = require("next/headers") as { headers: () => Record<string, string> } | undefined;
  if (!nextHeaders) throw new Error("next/headers is not available");
  const headers = nextHeaders.headers();
  return { locale: headers["x-locale"] ?? "en", path: headers["x-path"] ?? "/" };
};

//! Temporary solution for syrs translation
const langIdx: Record<string, number> =
  process.env.NEXT_PUBLIC_APP_NAME === "syrs" ? { en: 0, ko: 1, ja: 2, th: 3 } : { en: 0, ko: 1, zhChs: 2, zhCht: 3 };
const dictionary: { [key: string]: { [key: string]: string } } = {};
const translator = (lang: string, key: string, param?: Record<string, string | number>) => {
  const idx = langIdx[lang];
  const msg = pathGet<string>(key, dictionary)?.[idx];
  if (!msg) {
    Logger.error(`No translation for ${key}`);
    return key;
  }
  return param ? msg.replace(/{([^}]+)}/g, (_, key: string) => param[key] as string) : msg;
};
translator.rich = (lang: string, key: string, param?: Record<string, string>) => {
  const idx = langIdx[lang];
  const msg = pathGet<string>(key, dictionary)?.[idx];
  if (!msg) {
    Logger.error(`No translation for ${key}`);
    return key;
  }
  return param ? msg.replace(/{([^}]+)}/g, (_, key: string) => param[key]) : msg;
};

export const makePageProto = <Locale extends { [key: string]: { [key: string]: Translation } }>(locales: Locale[]) => {
  locales.forEach((locale) => {
    Object.keys(locale).forEach((key: string) => (dictionary[key] = Object.assign(dictionary[key] ?? {}, locale[key])));
  });
  return () => {
    const { locale, path } = getPageInfo();
    const l = (key: TransMessage<Locale>, param?: { [key: string]: string | number }) => translator(lang, key, param);
    l.rich = (key: TransMessage<Locale>, param?: { [key: string]: string | number }) =>
      (
        <span
          dangerouslySetInnerHTML={{
            __html: translator.rich(lang, key, {
              ...param,
              // strong: (chunks: string) => `<b>${chunks}</b>`,
              // "bg-primary": (chunks: string) => `<span className="bg-primary text-base-100">${chunks}</span>`,
              // primary: (chunks: string) => `<span className="bg-base-100 text-primary">${chunks}</span>`,
              br: `<br />`,
            }),
          }}
        />
      ) as ReactNode;
    l.field = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(model: ModelKey, field: Field) => {
      const key = `${model as string}.${field as string}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.desc = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(model: ModelKey, field: Field) => {
      const key = `${model as string}.desc-${field as string}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.enum = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey], Value extends string>(
      model: ModelKey,
      field: Field,
      value: Value
    ) => {
      const key = `${model as string}.enum-${field as string}-${value}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.enumdesc = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey], Value extends string>(
      model: ModelKey,
      field: Field,
      value: Value
    ) => {
      const key = `${model as string}.enumdesc-${field as string}-${value}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.api = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(model: ModelKey, endpoint: Field) => {
      const key = `${model as string}.api-${endpoint as string}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.apidesc = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(
      model: ModelKey,
      endpoint: Field
    ) => {
      const key = `${model as string}.apidesc-${endpoint as string}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.arg = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(
      model: ModelKey,
      endpoint: Field,
      arg: string
    ) => {
      const key = `${model as string}.arg-${endpoint as string}-${arg}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    l.argdesc = <ModelKey extends keyof Locale, Field extends keyof Locale[ModelKey]>(
      model: ModelKey,
      endpoint: Field,
      arg: string
    ) => {
      const key = `${model as string}.argdesc-${endpoint as string}-${arg}` as unknown as TransMessage<Locale>;
      return l(key);
    };
    const lang = locale;
    return { path, l, lang };
  };
};
