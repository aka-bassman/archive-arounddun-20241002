/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger } from "../common/Logger";
import { baseClientEnv } from "@core/base";
import { notFound, redirect } from "next/navigation";

export interface RouterInstance {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  refresh: () => void;
}
interface InternalRouterInstance {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  refresh: () => void;
}
interface RouterOptions {
  prefix?: string;
  lang?: string;
}
interface NextServerRouterOption extends RouterOptions {
  type: "next";
  side: "server";
}
interface NextClientRouterOption extends RouterOptions {
  type: "next";
  side: "client";
  router: RouterInstance;
}
interface CSRClientRouterOption extends RouterOptions {
  type: "csr";
  router: RouterInstance;
}
export const getPathInfo = (href: string, lang: string, prefix: string) => {
  const langLength = lang.length + 1;
  const path = href === `/${lang}` ? "/" : href.startsWith(`/${lang}/`) ? href.slice(langLength) : href;
  const subRoute = prefix ? `/${prefix}` : "";
  const pathname = path === "/" ? `/${lang}${subRoute}` : `/${lang}${subRoute}${path}`;
  return { path, pathname };
};
class Router {
  isInitialized = false;
  #prefix = "";
  #lang = "en";
  #instance: InternalRouterInstance = {
    push: (href: string) => {
      const { pathname } = this.#getPathInfo(href);
      Logger.log(`push to:${pathname}`);
      if (baseClientEnv.side === "server") redirect(pathname);
    },
    replace: (href: string) => {
      const { pathname } = this.#getPathInfo(href);
      Logger.log(`replace to:${pathname}`);
      if (baseClientEnv.side === "server") redirect(pathname);
    },
    back: () => {
      throw new Error("back is only available in client");
    },
    refresh: () => {
      throw new Error("refresh is only available in client");
    },
  };
  init(options: NextClientRouterOption | NextServerRouterOption | CSRClientRouterOption) {
    // if (this.isInitialized) throw new Error("Router is already initialized");
    this.#prefix = options.prefix ?? "";
    this.#lang = options.lang ?? "en";
    if (options.type === "csr") this.#initCSRClientRouter(options);
    else if (options.side === "server") this.#initNextServerRouter(options);
    else this.#initNextClientRouter(options);
    this.isInitialized = true;
    Logger.log("Router initialized");
  }
  #initNextServerRouter(options: NextServerRouterOption) {
    // already initialized in next server
  }
  #initNextClientRouter(options: NextClientRouterOption) {
    this.#instance = {
      push: (href: string) => {
        const { path, pathname } = this.#getPathInfo(href);
        this.#postPathChange({ path, pathname });
        options.router.push(pathname);
      },
      replace: (href: string) => {
        const { path, pathname } = this.#getPathInfo(href);
        this.#postPathChange({ path, pathname });
        options.router.replace(pathname);
      },
      back: () => {
        const { path, pathname } = this.#getPathInfo(document.referrer);
        this.#postPathChange({ path, pathname });
        options.router.back();
      },
      refresh: () => {
        const { path, pathname } = this.#getPathInfo(location.pathname);
        this.#postPathChange({ path, pathname });
        options.router.refresh();
      },
    };
  }
  #initCSRClientRouter(options: CSRClientRouterOption) {
    this.#instance = {
      push: (href: string) => {
        const { path, pathname } = this.#getPathInfo(href);
        if (location.pathname === pathname) return;
        this.#postPathChange({ path, pathname });
        options.router.push(pathname);
      },
      replace: (href: string) => {
        const { path, pathname } = this.#getPathInfo(href);
        if (location.pathname === pathname) return;
        this.#postPathChange({ path, pathname });
        options.router.replace(pathname);
      },
      back: () => {
        const { path, pathname } = this.#getPathInfo(document.referrer);
        if (location.pathname === pathname) return;
        this.#postPathChange({ path, pathname });
        options.router.back();
      },
      refresh: () => {
        const { path, pathname } = this.#getPathInfo(location.pathname);
        this.#postPathChange({ path, pathname });
        options.router.refresh();
      },
    };
  }
  #checkInitialized() {
    if (!this.isInitialized) throw new Error("Router is not initialized");
  }
  #getIsInitialized() {
    return this.isInitialized;
  }

  #getPathInfo(href: string, prefix = this.#prefix) {
    const langLength = this.#lang.length + 1;
    const path = href === `/${this.#lang}` ? "/" : href.startsWith(`/${this.#lang}/`) ? href.slice(langLength) : href;
    const subRoute = prefix ? `/${prefix}` : "";
    const pathname = path === "/" ? `/${this.#lang}${subRoute}` : `/${this.#lang}${subRoute}${path}`;
    return { path, pathname };
  }
  #postPathChange({ path, pathname }: { path: string; pathname: string }) {
    Logger.log(`pathChange-start:${path}`);
    window.parent.postMessage({ type: "pathChange", path, pathname }, "*");
  }
  push(href: string) {
    this.#checkInitialized();
    this.#instance.push(href);
    return undefined as never;
  }
  replace(href: string) {
    this.#checkInitialized();
    this.#instance.replace(href);
    return undefined as never;
  }
  back() {
    if (baseClientEnv.side === "server") throw new Error("back is only available in client side");
    this.#checkInitialized();
    this.#instance.back();
    return undefined as never;
  }
  refresh() {
    if (baseClientEnv.side === "server") throw new Error("refresh is only available in client side");
    this.#checkInitialized();
    this.#instance.refresh();
    return undefined as never;
  }
  redirect(href: string) {
    const nextHeaders = require("next/headers") as { headers?: () => Map<string, string> };
    const headers = nextHeaders.headers?.() ?? new Map();
    const lang = (headers.get("x-locale") ?? this.#lang) as string;
    const basePath = headers.get("x-base-path") as string | undefined;
    const { pathname } = getPathInfo(href, lang, basePath ?? "");
    if (baseClientEnv.side === "server") {
      Logger.log(`redirect to:${pathname}`);
      redirect(pathname);
    } else this.#instance.replace(pathname);
    return undefined as never;
  }
  notFound(): never {
    this.#checkInitialized();
    if (baseClientEnv.side === "server") {
      Logger.log(`redirect to:/404`);
      notFound();
    } else this.#instance.replace("/404");
    return undefined as never;
  }
  setLang(lang: string) {
    if (baseClientEnv.side === "server") throw new Error("setLang is only available in client side");
    this.#checkInitialized();
    const { path } = getPathInfo(window.location.pathname, this.#lang, this.#prefix);
    this.#lang = lang;
    this.#instance.replace(`/${lang}${path}`);
    return undefined as never;
  }
}
export const router = new Router();
