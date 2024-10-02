/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import * as ReactDOM from "react-dom/client";
import {
  type CsrConfig,
  DEFAULT_BOTTOM_INSET,
  DEFAULT_TOP_INSET,
  type PageState,
  type PathRoute,
  type Route,
  type RouteGuide,
  csrContext,
  defaultPageState,
} from "../client/csrTypes";
import { Logger } from "@core/common";
import { device, initAuth, storage } from "../client";
import { useCsrValues } from "./useCsrValues";

const supportLanguages = ["en", "ko"] as const;

export const bootCsr = async (context: any, rootPath: string, entryPath = "/route") => {
  // 1. Collect Device Information
  const [, jwt] = await Promise.all([device.init({ supportLanguages }), storage.getItem("jwt")]);
  if (jwt) initAuth({ jwt });
  Logger.verbose(`Set default language: ${device.lang}`);

  // 2. Create Route Map
  const pages: { [key: string]: { default: { csrConfig?: CsrConfig } } } = {};
  context.keys().forEach((key) => (pages[key] = context(key)));
  const getPageState = (csrConfig?: CsrConfig) => {
    const { transition, safeArea, topInset, bottomInset, gesture, cache }: CsrConfig = csrConfig ?? {};
    const pageState: PageState = {
      transition: transition ?? "none",
      topSafeArea: safeArea === false || device.info.platform === "android" ? 0 : device.topSafeArea,
      bottomSafeArea: safeArea === false || device.info.platform === "android" ? 0 : device.bottomSafeArea,
      topInset: topInset === true ? DEFAULT_TOP_INSET : topInset === false ? 0 : topInset ?? 0,
      bottomInset: bottomInset === true ? DEFAULT_BOTTOM_INSET : bottomInset === false ? 0 : bottomInset ?? 0,
      gesture: gesture ?? true,
      cache: cache ?? false,
    };
    return pageState;
  };

  const routeMap = new Map<string, Route>();
  routeMap.set("/", { path: "/", children: new Map() });
  for (const filePath of Object.keys(pages)) {
    const fileName = filePath.match(/\.\/(.*)\.tsx$/)?.[1];
    if (!fileName) continue;
    const fileType: "page" | "layout" | null = fileName.endsWith("page")
      ? "page"
      : fileName.endsWith("layout")
        ? "layout"
        : null;
    if (!fileType) continue;
    const pathSegments = [
      "/",
      ...fileName
        .split("/")
        .slice(0, -1)
        .map((segment) => `/${segment.replace(/\[(.*?)\]/g, ":$1")}`),
    ];
    const targetRouteMap = pathSegments.slice(0, -1).reduce((rMap: Map<string, Route>, path: string) => {
      if (!rMap.has(path)) rMap.set(path, { path, children: new Map() });
      return rMap.get(path)?.children;
    }, routeMap);
    if (!targetRouteMap) continue;
    const targetPath = pathSegments[pathSegments.length - 1];

    targetRouteMap.set(targetPath, {
      // action: pages[path]?.action,
      // ErrorBoundary: pages[path]?.ErrorBoundary,
      ...(targetRouteMap.get(targetPath) ?? { path: targetPath, children: new Map<string, Route>() }),
      ...(fileType === "layout"
        ? { Layout: pages[filePath].default }
        : {
            Page: pages[filePath].default,
            pageState: getPageState(pages[filePath].default.csrConfig),
            csrConfig: pages[filePath].default.csrConfig,
          }),
    } as Route);
  }
  const pathname = window.location.pathname;
  const initialPath = device.lang + entryPath;
  window.document.body.style.overflow = "hidden";

  const getPathRoutes = (
    route: Route,
    parentRootLayouts: (
      | (({ children, params, searchParams }) => JSX.Element)
      | (({ children, params, searchParams }) => Promise<JSX.Element>)
    )[] = [],
    parentLayouts: (
      | (({ children, params, searchParams }) => JSX.Element)
      | (({ children, params, searchParams }) => Promise<JSX.Element>)
    )[] = [],
    parentPaths: string[] = []
  ): PathRoute[] => {
    const parentPath = parentPaths.filter((path) => path !== "/").join("");
    const currentPathSegment = /^\/\(.*\)$/.test(route.path) ? "" : route.path;
    const isRoot = ["/", "/:lang"].includes(currentPathSegment);
    const path = parentPath + currentPathSegment;
    const pathSegments = [...parentPaths, ...(currentPathSegment ? [currentPathSegment] : [])];
    const RootLayouts = [...parentRootLayouts, ...(isRoot && route.Layout ? [route.Layout] : [])];
    const Layouts = [...parentLayouts, ...(!isRoot && route.Layout ? [route.Layout] : [])];
    return [
      ...(route.Page
        ? [
            {
              path,
              pathSegments,
              Page: route.Page,
              RootLayouts,
              Layouts,
              pageState: route.pageState ?? defaultPageState,
            },
          ]
        : []),
      ...(route.children.size
        ? [...route.children.values()].flatMap((child) => getPathRoutes(child, RootLayouts, Layouts, pathSegments))
        : []),
    ];
  };
  const rootRoute = routeMap.get("/");
  if (!rootRoute) throw new Error("No root route");
  const pathRoutes = getPathRoutes(rootRoute);
  const routeGuide: RouteGuide = { pathSegment: "/", children: {} };
  pathRoutes.forEach((pathRoute) => {
    const pathSegments = pathRoute.pathSegments.slice(1);
    pathSegments.reduce((routeGuide, pathSegment, index) => {
      routeGuide.children[pathSegment] = {
        ...(routeGuide.children[pathSegment] ?? {}),
        pathSegment,
        ...(index === pathSegments.length - 1 ? { pathRoute } : {}),
        children: (routeGuide.children[pathSegment].children as { [key: string]: RouteGuide } | undefined) ?? {},
      } as RouteGuide;
      return routeGuide.children[pathSegment];
    }, routeGuide);
  });
  const RouterProvider = () => {
    const csrValues = useCsrValues(routeGuide, pathRoutes);
    const { location } = csrValues;
    return (
      <csrContext.Provider value={csrValues}>
        {location.pathRoute.RootLayouts.reduceRight(
          (children, Layout) => {
            return (
              <Layout params={location.params} searchParams={location.searchParams}>
                {children}
              </Layout>
            );
          },
          <></>
        )}
      </csrContext.Provider>
    );
  };

  if (pathname !== `/${initialPath}`) {
    window.location.replace(initialPath);
    return;
  } else {
    const el = document.getElementById("root");
    if (!el) throw new Error("No root element");
    const root = ReactDOM.createRoot(el);
    root.render(<RouterProvider />);
  }
};
