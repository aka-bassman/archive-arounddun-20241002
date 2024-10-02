/* eslint-disable @next/next/no-head-element */
import "./styles.css";
import { ClientBridge, ClientInner, ClientNextBridge, ClientPathWrapper, ClientWrapper } from "./Client";
import { Common, type InitAuthFetchType, type ProviderProps } from "./Common";
import { Suspense } from "react";
import { router } from "@core/client";

export const SSR = () => {
  return <></>;
};

export type SSRProviderProps = ProviderProps & {
  fonts?: NextFont[];
};

const SSRProvider = ({
  className,
  appName,
  lang,
  head,
  env,
  gaTrackingId,
  fetch,
  children,
  theme,
  prefix,
  fonts,
}: SSRProviderProps) => {
  if (!router.isInitialized) router.init({ type: "next", side: "server", lang, prefix });
  return (
    <>
      <Common.Wrapper
        fetch={fetch as InitAuthFetchType}
        environment={env.environment}
        render={({ mePromise, myKeyringPromise, selfPromise }) => (
          <SSRWrapper className={className} appName={appName} lang={lang} head={head} fonts={fonts} prefix={prefix}>
            <ClientWrapper theme={theme}>
              {children}
              <Suspense fallback={null}>
                <ClientInner />
              </Suspense>
              <Suspense fallback={null}>
                <ClientBridge
                  env={env}
                  mePromise={mePromise}
                  myKeyringPromise={myKeyringPromise}
                  selfPromise={selfPromise}
                  theme={theme}
                  prefix={prefix}
                  gaTrackingId={gaTrackingId}
                />
                <ClientNextBridge lang={lang} prefix={prefix} />
              </Suspense>
            </ClientWrapper>
          </SSRWrapper>
        )}
      />
    </>
  );
};
SSR.Provider = SSRProvider;

export interface NextFont {
  className: string;
  variable: string;
}

interface SSRWrapperProps {
  className?: string;
  appName: string;
  lang: "en" | "ko";
  head?: JSX.Element;
  fonts?: NextFont[];
  children: any;
  prefix?: string;
}

const SSRWrapper = ({ children, lang, head, fonts = [], appName, className, prefix }: SSRWrapperProps) => (
  <html lang={lang} className={`${fonts.map((font) => font.variable).join(" ")} ${className}`} suppressHydrationWarning>
    <head>{head}</head>
    <body className="app">
      <div id="frameRoot" className="w-full overflow-hidden">
        <ClientPathWrapper prefix={prefix}>
          <div id="topSafeArea" className="bg-base-100 fixed inset-x-0 top-0" />
          <div id="pageContainers" className="isolate">
            <div id="pageContainer">
              <div id="pageContent" className="bg-base-100 relative isolate w-screen shadow-inner">
                {children}
              </div>
            </div>
          </div>
          <div id="topInsetContainer" className="bg-base-100 fixed inset-x-0 top-0 isolate">
            <div id="topInsetContent" className="isolate size-full" />
          </div>
          <div
            id="topLeftActionContainer"
            className="aspect-1 absolute left-0 top-0 isolate flex items-center justify-center"
          />
          <div id="bottomInsetContainer" className="fixed inset-x-0 bottom-0 isolate">
            <div id="bottomInsetContent" className="isolate size-full" />
          </div>
          <div id="bottomSafeArea" className="bg-base-100 fixed inset-x-0" />
        </ClientPathWrapper>
      </div>
    </body>
  </html>
);
SSR.Wrapper = SSRWrapper;

export default SSRProvider;
