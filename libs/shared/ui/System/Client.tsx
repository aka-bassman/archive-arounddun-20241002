"use client";
import { AnimatedComponent, a } from "@react-spring/web";
import { ExoticComponent, HTMLAttributes, MutableRefObject, useEffect, useState } from "react";
import { Gtag } from "./Gtag";
import {
  type Location,
  type PathRoute,
  defaultPageState,
  device,
  getPathInfo,
  initAuth,
  pathContext,
  router,
  setCookie,
  storage,
} from "@core/client";
import { Logger } from "@core/common";
import { Messages } from "./Messages";
import { ThemeProvider, useTheme } from "next-themes";
import { cnst, fetch, st } from "@shared/client";
import { dayjs } from "@core/base";
import { useFetch } from "@core/next";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BaseClientEnv } from "@core/base";

export const Client = () => {
  return <></>;
};
interface ClientWrapperProps {
  children: any;
  theme?: string;
}
export const ClientWrapper = ({ children, theme }: ClientWrapperProps) => {
  return <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>;
};
Client.Wrapper = ClientWrapper;

interface ClientPathWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  bind?: () => any;
  wrapperRef?: MutableRefObject<HTMLDivElement | null> | null;
  pageType?: "current" | "prev" | "cached";
  location?: Location;
  style?: NonNullable<AnimatedComponent<ExoticComponent>["defaultProps"]>["style"];
  prefix?: string;
  children?: any;
}
export const ClientPathWrapper = ({
  bind,
  wrapperRef,
  pageType = "current",
  location,
  prefix = "",
  children,
  ...props
}: ClientPathWrapperProps) => {
  const pathname = location?.pathname ?? usePathname();
  const params = location?.params ?? (useParams() as unknown as Record<string, string>);
  const searchParams = location?.searchParams ?? Object.fromEntries(useSearchParams());
  const search = location?.search ?? (typeof window !== "undefined" ? window.location.search : "");
  const lang = params.lang;
  const firstPath = pathname.split("/")[2];
  const pathRoute: PathRoute = location?.pathRoute ?? {
    path: "/" + pathname.split("/").slice(2).join("/"),
    pathSegments: pathname.split("/").slice(2),
    Page: () => <></>,
    pageState: defaultPageState,
    RootLayouts: [],
    Layouts: [],
  };
  const [gestureEnabled, setGestureEnabled] = useState(true);

  return (
    <pathContext.Provider
      value={{
        pageType,
        location: { pathname, params, searchParams, search, pathRoute },
        gestureEnabled,
        setGestureEnabled,
      }}
    >
      <a.div
        {...(bind && pathRoute.pageState.gesture && gestureEnabled ? bind() : {})}
        className="group/path size-full"
        ref={wrapperRef}
        {...props}
        data-lang={lang}
        data-basepath={prefix}
        data-firstpath={firstPath}
      >
        {children}
      </a.div>
    </pathContext.Provider>
  );
};

interface ClientBridgeProps {
  env: BaseClientEnv;
  lang?: string;
  mePromise?: Promise<cnst.Admin | null>;
  myKeyringPromise?: Promise<cnst.Keyring | null>;
  selfPromise?: Promise<cnst.User | null>;
  theme?: string;
  prefix?: string;
  gaTrackingId?: string;
}

export const ClientBridge = ({
  env,
  lang,
  mePromise,
  myKeyringPromise,
  selfPromise,
  theme,
  prefix,
  gaTrackingId,
}: ClientBridgeProps) => {
  const uiOperation = st.use.uiOperation();
  const pathname = st.use.pathname();
  const params = st.use.params();
  const searchParams = st.use.searchParams();
  const { fulfilled: meFullfilled, value: me } = useFetch(mePromise);
  const { fulfilled: myKeyringFullfilled, value: myKeyring } = useFetch(myKeyringPromise);
  const { fulfilled: selfFullfilled, value: self } = useFetch(selfPromise);
  const language = (params.lang as string | undefined) ?? lang;
  const path = "/" + pathname.split("/").slice(2).join("/");
  const { setTheme, themes } = useTheme();

  useEffect(() => {
    if (uiOperation !== "sleep") return;
    if (!meFullfilled || !myKeyringFullfilled || !selfFullfilled) return;
    const initTheme = async () => {
      if (theme) {
        setTheme(theme);
        return;
      }
      const localTheme = await storage.getItem("theme");
      if (typeof localTheme === "string" && themes.includes(localTheme)) {
        setTheme(localTheme);
        return;
      } else setTheme("system");
    };
    void initTheme();
    setCookie("siteurl", window.location.origin);
    dayjs.locale(language);
    initAuth({ jwt: searchParams.jwt });
    st.set({
      prefix,
      uiOperation: "loading",
      ...(me ? { me: fetch.crystalizeAdmin(me) } : {}),
      ...(myKeyring ? { myKeyring: fetch.crystalizeKeyring(myKeyring) } : {}),
      ...(self ? { self: fetch.crystalizeUser(self) } : {}),
    });
    //!이것때매 서버 함 끊길때마다 jwt 날려버리고 있는데 필요한 거 맞는지?
    // if (!me && !myKeyring && !self) resetAuth();
    setTimeout(() => {
      st.set({ uiOperation: "idle" });
    }, 2000);
  }, [meFullfilled, myKeyringFullfilled, selfFullfilled]);

  useEffect(() => {
    if (uiOperation !== "sleep") return;
    const handleResize = () => {
      st.do.setWindowSize();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCookie("path", path);
    Logger.log(`pathChange-finished:${path}`);
  }, [pathname]);
  return gaTrackingId && <Gtag trackingId={gaTrackingId} />;
};
Client.Bridge = ClientBridge;

export const ClientInner = () => {
  const uiOperation = st.use.uiOperation();
  return (
    <>
      <div id="modal-root" />
      {uiOperation === "idle" ? <Messages /> : null}
    </>
  );
};
Client.Inner = ClientInner;

interface ClientNextBridgeProps {
  lang: string;
  prefix?: string;
}
export const ClientNextBridge = ({ lang, prefix = "" }: ClientNextBridgeProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams() as unknown as Record<string, string>;
  const nextRouter = useRouter();
  useEffect(() => {
    router.init({ type: "next", side: "client", router: nextRouter, lang, prefix });
    void device.init({ lang });
  }, []);
  useEffect(() => {
    const { path } = getPathInfo(pathname, lang, prefix);
    st.set({ pathname, path });
  }, [pathname]);
  useEffect(() => {
    st.set({ params });
  }, [params]);
  useEffect(() => {
    st.set({ searchParams: Object.fromEntries(searchParams) });
  }, [searchParams]);
  return null;
};
Client.NextBridge = ClientNextBridge;
