"use client";
import "./styles.css";
import { Client, ClientPathWrapper } from "./Client";
import { Common, type InitAuthFetchType, type ProviderProps } from "./Common";
import { FontFace } from "@util/ui";
import { PathRoute, type ReactFont, clsx, device, router, useCsr } from "@core/client";
import { a } from "@react-spring/web";
import { createPortal } from "react-dom";
import { st } from "@shared/client";
import { useEffect } from "react";
import { usePushNoti } from "@core/next";

export const CSR = ({ children }) => {
  return <div></div>;
};

export type CSRProviderProps = ProviderProps & {
  fonts: ReactFont[];
};

const CSRProvider = ({
  className,
  appName,
  lang,
  head,
  env,
  theme,
  prefix,
  usePage,
  fetch,
  children,
  gaTrackingId,
  fonts,
}: CSRProviderProps) => {
  return (
    <>
      <Client.Wrapper theme={theme}>
        <CSRWrapper className={className} appName={appName} lang={lang} head={head} fonts={fonts} prefix={prefix}>
          {children}
          <Client.Inner />
          <CSRInner />
        </CSRWrapper>
      </Client.Wrapper>
      <Common.Wrapper
        fetch={fetch as InitAuthFetchType}
        environment={env.environment}
        render={({ mePromise, myKeyringPromise, selfPromise }) => (
          <>
            <Client.Bridge
              lang={lang}
              env={env}
              mePromise={mePromise}
              myKeyringPromise={myKeyringPromise}
              selfPromise={selfPromise}
              theme={theme}
              prefix={prefix}
              gaTrackingId={gaTrackingId}
            />
            <CSRBridge lang={lang} prefix={prefix} />
          </>
        )}
      />
    </>
  );
};
CSR.Provider = CSRProvider;

interface CSRWrapperProps {
  className?: string;
  appName: string;
  lang: "en" | "ko";
  head?: JSX.Element;
  fonts?: ReactFont[];
  children: any;
  prefix?: string;
}
const CSRWrapper = ({ children, lang, head, fonts = [], appName, className, prefix }: CSRWrapperProps) => {
  const {
    frameRootRef,
    topSafeAreaRef,
    bottomSafeAreaRef,
    topInset,
    topLeftAction,
    bottomInset,
    topSafeArea,
    bottomSafeArea,
    pathRoutes,
  } = useCsr();
  const csrLoaded = st.use.csrLoaded();
  useEffect(() => {
    st.do.setCsrLoaded(true);
  }, []);
  return (
    <>
      {fonts.map((font, idx) => (
        <FontFace key={idx} font={font} />
      ))}
      <div id="frameRoot" className={clsx(className, "h-screen w-full overflow-hidden")} ref={frameRootRef}>
        <div id="pageContainers" className="isolate"></div>
        {csrLoaded
          ? pathRoutes.map((pathRoute) => (
              <CSRPageContainer key={pathRoute.path} pathRoute={pathRoute} prefix={prefix} />
            ))
          : null}
        <a.div
          id="topSafeArea"
          className="bg-base-100 fixed inset-x-0 top-0"
          ref={topSafeAreaRef}
          style={topSafeArea?.containerStyle}
        />
        <a.div
          id="topInsetContainer"
          className="bg-base-100 fixed inset-x-0 isolate"
          style={topInset?.containerStyle}
        />
        <a.div
          id="topLeftActionContainer"
          className="aspect-1 absolute left-0 top-0 isolate flex items-center justify-center"
          style={topLeftAction?.containerStyle}
        />
        <a.div id="bottomInsetContainer" className="fixed inset-x-0 isolate" style={bottomInset?.containerStyle} />
        <a.div
          id="bottomSafeArea"
          className="bg-base-100 fixed inset-x-0"
          ref={bottomSafeAreaRef}
          style={bottomSafeArea?.containerStyle}
        />
      </div>
    </>
  );
};

CSR.Wrapper = CSRWrapper;

const CSRInner = () => {
  return <></>;
};
CSR.Inner = CSRInner;

interface CSRBridgeProps {
  lang: string;
  prefix?: string;
}
const CSRBridge = ({ lang, prefix }: CSRBridgeProps) => {
  const pushNoti = usePushNoti();
  const { location, pageContentRef } = useCsr();
  const { router: reactRouter } = useCsr();
  useEffect(() => {
    st.do.set({
      params: location.params as unknown as { [key: string]: string },
      searchParams: location.searchParams as unknown as { [key: string]: string },
      pageState: location.pathRoute.pageState,
    });
  }, [location]);
  useEffect(() => {
    router.init({ type: "csr", lang, prefix, router: reactRouter });
    device.listenKeyboardChanged(st.do.setKeyboardHeight);
    device.setPageContentRef(pageContentRef);
    if (device.info.platform === "web") return;
    void (async () => {
      await pushNoti.init();
      const token = await pushNoti.getToken();
      if (!token) return;
      st.do.setDeviceToken(token);
    })();
    return () => {
      device.unlistenKeyboardChanged();
    };
  }, []);
  return null;
};
CSR.Bridge = CSRBridge;

interface CSRPageContainerProps {
  pathRoute: PathRoute;
  prefix?: string;
}
const CSRPageContainer = ({ pathRoute, prefix }: CSRPageContainerProps) => {
  const {
    history,
    location: currentLocation,
    page: currentPage,
    pageContentRef: currentPageContentRef,
    pageClassName: currentPageClassName,
    pageBind: currentPageBind,
    prevLocation,
    prevPage,
    prevPageContentRef,
    topInset,
    bottomInset,
    topLeftAction,
  } = useCsr();
  const pageType: "current" | "prev" | "cached" | null =
    pathRoute === currentLocation.pathRoute
      ? "current"
      : pathRoute === prevLocation?.pathRoute
        ? "prev"
        : pathRoute.pageState.cache && history.current.cachedLocationMap.has(pathRoute.path)
          ? "cached"
          : null;
  if (!pageType) return null;
  const pageContainers = document.getElementById("pageContainers");
  const topInsetContainer = document.getElementById("topInsetContainer");
  const bottomInsetContainer = document.getElementById("bottomInsetContainer");
  const topLeftActionContainer = document.getElementById("topLeftActionContainer");
  if (!pageContainers || !topInsetContainer || !bottomInsetContainer || !topLeftActionContainer) return null;
  const {
    location,
    page,
    pageContentRef,
    pageClassName,
    pageBind,
    topInsetContentStyle,
    topLeftActionContentStyle,
    bottomInsetContentStyle,
    zIndex,
  } =
    pageType === "current"
      ? {
          location: currentLocation,
          page: currentPage,
          pageContentRef: currentPageContentRef,
          pageClassName: currentPageClassName,
          pageBind: currentPageBind,
          topInsetContentStyle: topInset?.contentStyle,
          topLeftActionContentStyle: topLeftAction?.contentStyle,
          bottomInsetContentStyle: bottomInset?.contentStyle,
          zIndex: history.current.idx,
        }
      : pageType === "prev"
        ? {
            location: prevLocation,
            page: prevPage,
            pageContentRef: prevPageContentRef,
            pageClassName: "",
            pageBind: () => ({}),
            topInsetContentStyle: topInset?.prevContentStyle,
            topLeftActionContentStyle: topLeftAction?.prevContentStyle,
            bottomInsetContentStyle: bottomInset?.prevContentStyle,
            zIndex: history.current.idxMap.get(prevLocation?.pathname ?? "") ?? 0,
          }
        : {
            location: history.current.cachedLocationMap.get(pathRoute.path),
            page: null,
            pageContentRef: null,
            pageClassName: "",
            pageBind: () => ({}),
            topInsetContentStyle: undefined,
            topLeftActionContentStyle: undefined,
            bottomInsetContentStyle: undefined,
            zIndex: 0,
          };
  if (!location) return null;
  return (
    <>
      {createPortal(
        <a.div
          id={`pageContainer-${pathRoute.path}`}
          style={{ ...(page?.containerStyle ?? {}), zIndex }}
          className={clsx({ absolute: pageType !== "current", hidden: pageType === "cached" })}
        >
          <ClientPathWrapper
            id="pageContent"
            wrapperRef={pageContentRef}
            bind={pageBind}
            className={clsx("bg-base-100 relative isolate overflow-x-hidden shadow-inner", {
              "bg-base-100 relative shadow-inner overflow-x-hidden isolate": pageType === "current",
              "overflow-hidden w-screen h-screen isolate": pageType === "prev",
              [pageClassName]: pathRoute.pageState.gesture,
            })}
            style={page?.contentStyle}
            pageType={pageType}
            location={location}
            prefix={prefix}
          >
            {pathRoute.Layouts.reduceRight(
              (children, Layout) => {
                return (
                  <Layout params={location.params} searchParams={location.searchParams}>
                    {children}
                  </Layout>
                );
              },
              <pathRoute.Page params={location.params} searchParams={location.searchParams} />
            )}
          </ClientPathWrapper>
        </a.div>,
        pageContainers
      )}
      {createPortal(
        <ClientPathWrapper
          id={`topInsetContent-${pathRoute.path}`}
          className={clsx("absolute left-0 top-0 isolate size-full", { hidden: pageType === "cached" })}
          style={{ ...topInsetContentStyle, zIndex }}
          pageType={pageType}
          location={location}
          prefix={prefix}
        />,
        topInsetContainer
      )}
      {createPortal(
        <ClientPathWrapper
          id={`topLeftActionContent-${pathRoute.path}`}
          className={clsx("absolute isolate flex h-full items-center justify-center", {
            hidden: pageType === "cached",
          })}
          style={{ ...topLeftActionContentStyle, zIndex }}
          pageType={pageType}
          location={location}
          prefix={prefix}
        />,
        topLeftActionContainer
      )}
      {createPortal(
        <ClientPathWrapper
          id={`bottomInsetContent-${pathRoute.path}`}
          className={clsx("bottom-0 isolate size-full", {
            hidden: pageType === "cached",
            absolute: pageType === "prev",
          })}
          style={{ ...bottomInsetContentStyle, zIndex }}
          pageType={pageType}
          location={location}
          prefix={prefix}
        />,
        bottomInsetContainer
      )}
    </>
  );
};

export default CSRProvider;
