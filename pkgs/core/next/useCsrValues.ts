"use client";
import { App } from "@capacitor/app";
import {
  type CsrContextType,
  type CsrTransitionStyles,
  type History,
  type Location,
  LocationState,
  PathRoute,
  type RouteGuide,
  type RouteState,
  type RouterInstance,
  type TransitionType,
  type UseCsrTransition,
  defaultPageState,
  device,
  router,
} from "../client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpringValue } from "@react-spring/web";

const useNoneTrans = ({ clientHeight, location, prevLocation }: RouteState): UseCsrTransition => {
  const transDirection = "none";
  const transUnit = useSpringValue(0, { config: { clamp: true } });
  const transUnitRange = useMemo(() => [0, 0], []);
  const transProgress = transUnit.to((unit) => 1);
  const transPercent = transUnit.to((unit) => 100);
  const pageState = location.pathRoute.pageState;
  const prevPageState = prevLocation?.pathRoute.pageState ?? defaultPageState;
  const csrTranstionStyles: CsrTransitionStyles = {
    topSafeArea: {
      containerStyle: {
        height: pageState.topSafeArea,
      },
    },
    bottomSafeArea: {
      containerStyle: {
        top: clientHeight - pageState.bottomSafeArea,
        height: pageState.bottomSafeArea,
      },
    },
    page: {
      containerStyle: {},
      contentStyle: {
        paddingTop: pageState.topSafeArea + pageState.topInset,
        paddingBottom: pageState.bottomInset + pageState.bottomSafeArea,
        height: clientHeight,
      },
    },
    prevPage: {
      containerStyle: {
        paddingTop: prevPageState.topSafeArea + prevPageState.topInset,
      },
      contentStyle: { opacity: 0 },
    },
    topInset: {
      containerStyle: {
        top: pageState.topSafeArea,
        height: pageState.topInset,
      },
      contentStyle: { opacity: 1 },
      prevContentStyle: { opacity: 0 },
    },
    topLeftAction: {
      containerStyle: {
        top: pageState.topSafeArea,
        height: pageState.topInset,
      },
      contentStyle: { opacity: 1 },
      prevContentStyle: { opacity: 0 },
    },
    bottomInset: {
      containerStyle: {
        height: pageState.bottomInset,
        top: clientHeight - pageState.bottomInset - pageState.bottomSafeArea,
      },
      contentStyle: { opacity: 1 },
      prevContentStyle: { opacity: 0 },
    },
  };

  const useCsrTransition: UseCsrTransition = {
    ...csrTranstionStyles,
    pageBind: () => ({}),
    pageClassName: "touch-pan-y",
    transDirection,
    transUnitRange,
    transUnit,
    transPercent,
    transProgress,
  };
  return useCsrTransition;
};

const useFadeTrans = ({ clientHeight, location, prevLocation, onBack, history }: RouteState): UseCsrTransition => {
  const transDirection = "none";
  const transUnit = useSpringValue(1, { config: { clamp: true } });
  const transUnitRange = useMemo(() => [0, 1], []);
  const transProgress = transUnit.to((unit) => unit);
  const transPercent = transUnit.to([0, 1], [0, 100], "clamp");
  const pageState = location.pathRoute.pageState;
  const prevPageState = prevLocation?.pathRoute.pageState ?? defaultPageState;

  useEffect(() => {
    onBack.current.fade = async () => {
      await transUnit.start(transUnitRange[0]);
    };
  }, []);
  useEffect(() => {
    if (history.current.type === "forward") {
      void transUnit.start(transUnitRange[0], { immediate: true });
      void transUnit.start(transUnitRange[1], { config: { duration: 150 } });
    } else {
      void transUnit.start(transUnitRange[1], { immediate: true });
      return;
    }
  }, [location.pathname]);

  const csrTranstionStyles: CsrTransitionStyles = {
    topSafeArea: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
      },
    },
    bottomSafeArea: {
      containerStyle: {
        top: transProgress.to(
          [0, 1],
          [clientHeight - prevPageState.bottomSafeArea, clientHeight - pageState.bottomSafeArea]
        ),
        height: transProgress.to([0, 1], [prevPageState.bottomSafeArea, pageState.bottomSafeArea]),
      },
    },
    page: {
      containerStyle: {},
      contentStyle: {
        paddingTop: pageState.topSafeArea + pageState.topInset,
        paddingBottom: pageState.bottomInset + pageState.bottomSafeArea,
        opacity: transUnit,
        height: clientHeight,
      },
    },
    prevPage: {
      containerStyle: {
        paddingTop: prevPageState.topSafeArea + prevPageState.topInset,
        opacity: transProgress.to((progress) => 1 - progress),
      },
      contentStyle: {},
    },
    topInset: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress,
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
    topLeftAction: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
    bottomInset: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.bottomInset, pageState.bottomInset]),
        top: transProgress.to(
          [0, 1],
          [
            clientHeight - prevPageState.bottomInset - prevPageState.bottomSafeArea,
            clientHeight - pageState.bottomInset - pageState.bottomSafeArea,
          ]
        ),
      },
      contentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
  };

  const useCsrTransition: UseCsrTransition = {
    ...csrTranstionStyles,
    pageBind: () => ({}),
    pageClassName: "",
    transDirection,
    transUnitRange,
    transUnit,
    transPercent,
    transProgress,
  };
  return useCsrTransition;
};

const useStackTrans = ({
  clientWidth,
  clientHeight,
  location,
  prevLocation,
  history,
  onBack,
}: RouteState): UseCsrTransition => {
  const transDirection = "horizontal";
  const transUnit = useSpringValue(0, { config: { clamp: true } });
  const transUnitRange = useMemo(() => [clientWidth, 0], []);
  const transUnitReversed = transUnit.to((unit) => transUnitRange[0] - unit);
  const transUnitRangeReversed = useMemo(() => [0, clientWidth], []);
  const transProgress = transUnitReversed.to(transUnitRangeReversed, [0, 1], "clamp");
  const transPercent = transUnitReversed.to(transUnitRangeReversed, [0, 100], "clamp");
  const initThreshold = useMemo(() => Math.floor(clientWidth), []);
  const threshold = useMemo(() => Math.floor(clientWidth / 3), []);
  const pageState = location.pathRoute.pageState;
  const prevPageState = prevLocation?.pathRoute.pageState ?? defaultPageState;
  const pageClassName = "touch-pan-y";
  useEffect(() => {
    onBack.current.stack = async () => {
      await transUnit.start(transUnitRange[0]);
    };
  }, []);
  useEffect(() => {
    if (history.current.type === "forward") {
      void transUnit.start(transUnitRange[0], { immediate: true });
      void transUnit.start(transUnitRange[1], { config: { duration: 150 } });
    } else {
      void transUnit.start(transUnitRange[1], { immediate: true });
      return;
    }
  }, [location.pathname]);

  const pageBind = useDrag(
    ({ first, down, last, movement: [mx], initial: [ix], cancel }) => {
      if (first) void device.hideKeyboard();
      if (ix > initThreshold) {
        cancel();
        return;
      }
      if (mx < transUnitRange[1]) void transUnit.start(transUnitRange[1], { immediate: true });
      else if (mx > transUnitRange[0]) void transUnit.start(transUnitRange[0], { immediate: true });
      else if (!last) void transUnit.start(mx, { immediate: true });
      else if (mx < threshold) void transUnit.start(transUnitRange[1]);
      if (last && mx > threshold) router.back();
    },
    { axis: "x", filterTaps: true }
  );

  const csrTranstionStyles: CsrTransitionStyles = {
    topSafeArea: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
      },
    },
    bottomSafeArea: {
      containerStyle: {
        top: transProgress.to(
          [0, 1],
          [clientHeight - prevPageState.bottomSafeArea, clientHeight - pageState.bottomSafeArea]
        ),
        height: transProgress.to([0, 1], [prevPageState.bottomSafeArea, pageState.bottomSafeArea]),
      },
    },
    page: {
      containerStyle: {},
      contentStyle: {
        paddingTop: pageState.topSafeArea + pageState.topInset,
        paddingBottom: pageState.bottomInset + pageState.bottomSafeArea,
        translateX: transUnit,
        height: clientHeight,
      },
    },
    prevPage: {
      containerStyle: {
        paddingTop: prevPageState.topSafeArea + prevPageState.topInset,
        translateX: transUnit.to((unit) => (unit - clientWidth) / 5),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => 1 - progress / 2),
      },
    },
    topInset: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => progress),
        translateX: transProgress.to([0, 1], [clientWidth / 5, 0]),
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
        translateX: transProgress.to([0, 1], [0, -clientWidth / 5]),
      },
    },
    topLeftAction: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
        minWidth: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
    bottomInset: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.bottomInset, pageState.bottomInset]),
        top: transProgress.to(
          [0, 1],
          [
            clientHeight - prevPageState.bottomInset - prevPageState.bottomSafeArea,
            clientHeight - pageState.bottomInset - pageState.bottomSafeArea,
          ]
        ),
      },
      contentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
  };

  const useCsrTransition: UseCsrTransition = {
    ...csrTranstionStyles,
    pageBind,
    pageClassName,
    transDirection,
    transUnitRange,
    transUnit,
    transPercent,
    transProgress,
  };
  return useCsrTransition;
};

const useBottomUpTrans = ({
  clientWidth,
  clientHeight,
  history,
  location,
  prevLocation,
  onBack,
}: RouteState): UseCsrTransition => {
  const transDirection = "vertical";
  const transUnit = useSpringValue(0, { config: { clamp: true } });
  const transUnitRange = useMemo(() => [clientHeight, 0], []);
  const transUnitReversed = transUnit.to((unit) => transUnitRange[0] - unit);
  const transUnitRangeReversed = useMemo(() => [0, clientWidth], []);
  const transProgress = transUnitReversed.to(transUnitRangeReversed, [0, 1], "clamp");
  const transPercent = transUnitReversed.to(transUnitRangeReversed, [0, 100], "clamp");
  const initThreshold = useMemo(() => Math.floor(clientWidth / 3), []);
  const threshold = useMemo(() => Math.floor(clientWidth / 2), []);
  const pageState = location.pathRoute.pageState;
  const prevPageState = prevLocation?.pathRoute.pageState ?? defaultPageState;
  useEffect(() => {
    onBack.current.bottomUp = async () => {
      await transUnit.start(transUnitRange[0]);
    };
  }, []);
  useEffect(() => {
    if (history.current.type === "forward") {
      void transUnit.start(transUnitRange[0], { immediate: true });
      void transUnit.start(transUnitRange[1], { config: { duration: 150 } });
    } else {
      void transUnit.start(transUnitRange[1], { immediate: true });
      return;
    }
  }, [location.pathname]);

  const pageBind = useDrag(
    ({ first, last, movement: [, my], initial: [, iy], cancel }) => {
      if (first) void device.hideKeyboard();
      if (iy > initThreshold) {
        cancel();
        return;
      }
      if (my < transUnitRange[1]) void transUnit.start(transUnitRange[1], { immediate: true });
      else if (my > transUnitRange[0]) void transUnit.start(transUnitRange[0], { immediate: true });
      else if (!last) void transUnit.start(my, { immediate: true });
      else if (my < threshold) void transUnit.start(transUnitRange[1]);
      if (last && my > threshold) router.back();
    },
    { axis: "y", filterTaps: true, threshold: 10 }
  );

  const csrTranstionStyles: CsrTransitionStyles = {
    topSafeArea: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
      },
    },
    bottomSafeArea: {
      containerStyle: {
        top: transProgress.to(
          [0, 1],
          [clientHeight - prevPageState.bottomSafeArea, clientHeight - pageState.bottomSafeArea]
        ),
        height: transProgress.to([0, 1], [prevPageState.bottomSafeArea, pageState.bottomSafeArea]),
      },
    },
    page: {
      containerStyle: {},
      contentStyle: {
        paddingTop: pageState.topSafeArea + pageState.topInset,
        paddingBottom: pageState.bottomInset + pageState.bottomSafeArea,
        translateY: transUnit,
        height: clientHeight,
      },
    },
    prevPage: {
      containerStyle: {
        paddingTop: prevPageState.topSafeArea + prevPageState.topInset,
        translateY: 0,
      },
      contentStyle: {
        opacity: transProgress.to((progress) => 1 - progress / 2),
      },
    },
    topInset: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => progress),
        // translateX: transProgress.to([0, 1], [clientWidth / 5, 0]),
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
        // translateX: transProgress.to([0, 1], [0, -clientWidth / 5]),
      },
    },
    topLeftAction: {
      containerStyle: {
        top: transProgress.to([0, 1], [prevPageState.topSafeArea, pageState.topSafeArea]),
        height: transProgress.to([0, 1], [prevPageState.topInset, pageState.topInset]),
      },
      contentStyle: {
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
    bottomInset: {
      containerStyle: {
        height: transProgress.to([0, 1], [prevPageState.bottomInset, pageState.bottomInset]),
        top: transProgress.to(
          [0, 1],
          [
            clientHeight - prevPageState.bottomInset - prevPageState.bottomSafeArea,
            clientHeight - pageState.bottomInset - pageState.bottomSafeArea,
          ]
        ),
      },
      contentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => progress),
      },
      prevContentStyle: {
        top: transProgress.to([0, 1], [0, -(pageState.bottomInset - prevPageState.bottomInset) * 2]),
        opacity: transProgress.to((progress) => 1 - progress),
      },
    },
  };

  const useCsrTransition: UseCsrTransition = {
    ...csrTranstionStyles,
    pageBind,
    pageClassName: "touch-pan-x",
    transDirection,
    transUnitRange,
    transUnit,
    transPercent,
    transProgress,
  };
  return useCsrTransition;
};

export const useCsrValues = (rootRouteGuide: RouteGuide, pathRoutes: PathRoute[]) => {
  const clientWidth = useRef(window.innerWidth);
  const clientHeight = useRef(window.innerHeight);
  const topSafeAreaRef = useRef<HTMLDivElement>(null);
  const bottomSafeAreaRef = useRef<HTMLDivElement>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  const prevPageContentRef = useRef<HTMLDivElement>(null);
  const onBack = useRef<{ [K in TransitionType]?: () => Promise<void> }>({});
  const frameRootRef = useRef<HTMLDivElement>(null);

  const getLocation = useCallback((href: string): Location => {
    const getPathSegments = (pathname: string) => {
      return [
        ...pathname
          .split("/")
          .filter((pathSegment) => !!pathSegment)
          .map((pathSegment) => `/${pathSegment}`),
      ];
    };
    const getPathRoute = (pathname: string): PathRoute => {
      const pathSegments = getPathSegments(pathname);
      const getTargetRouteGuide = (pathSegments: string[], routeGuide: RouteGuide): RouteGuide => {
        const pathSegment = pathSegments.shift();
        if (!pathSegment) return routeGuide;
        const childrenSegments = Object.keys(routeGuide.children);
        const paramSegment = childrenSegments.find((segment) => segment.startsWith("/:"));
        return getTargetRouteGuide(
          pathSegments,
          paramSegment ? routeGuide.children[paramSegment] : routeGuide.children[pathSegment]
        );
      };
      const pathRoute = getTargetRouteGuide(pathSegments, rootRouteGuide).pathRoute;
      if (!pathRoute) {
        window.location.assign("/404");
        throw new Error("404");
      }
      return pathRoute;
    };
    const getParams = (pathname: string, pathRoute: PathRoute) => {
      const pathSegments = getPathSegments(pathname);
      return pathRoute.pathSegments.reduce<{ [key: string]: string }>((params, pathSegment, idx) => {
        if (pathSegment.startsWith("/:")) params[pathSegment.slice(2)] = pathSegments[idx - 1].slice(1);
        return params;
      }, {});
    };
    const getSearchParams = (search: string) => {
      return [...new URLSearchParams(search).entries()].reduce<{ [key: string]: string | string[] }>(
        (params, [key, value]) => {
          params[key] = params[key]
            ? [...(Array.isArray(params[key]) ? params[key] : [params[key] as string]), value]
            : value;
          return params;
        },
        {}
      );
    };
    const [pathname, search] = href.split("?");
    const pathRoute = getPathRoute(pathname);
    const params = getParams(pathname, pathRoute);
    const searchParams = getSearchParams(search);
    return { pathname, search, params, searchParams, pathRoute };
  }, []);
  const history = useRef<History>({
    type: "initial",
    locations: [getLocation(window.location.pathname)],
    scrollMap: new Map([[window.location.pathname, 0]]),
    idxMap: new Map([[window.location.pathname, 0]]),
    cachedLocationMap: new Map(),
    idx: 0,
  });
  const [{ location, prevLocation }, setLocationState] = useState<LocationState>({
    location: history.current.locations[history.current.idx],
    prevLocation: null,
  });
  const getRouter = useCallback((): RouterInstance => {
    const router = {
      push: (href: string) => {
        const location = history.current.locations[history.current.idx];
        const scrollTop = pageContentRef.current?.scrollTop ?? 0;
        history.current.type = "forward";
        history.current.scrollMap.set(location.pathname, scrollTop);
        history.current.idxMap.set(location.pathname, history.current.idx);
        history.current.locations = [...history.current.locations.slice(0, history.current.idx + 1), getLocation(href)];
        if (location.pathRoute.pageState.cache)
          history.current.cachedLocationMap.set(location.pathRoute.path, location);
        history.current.idx++;
        setLocationState({ location: history.current.locations[history.current.idx], prevLocation: location });
        window.history.pushState({}, "", href);
      },
      replace: (href: string) => {
        const scrollTop = pageContentRef.current?.scrollTop ?? 0;
        history.current.type = "forward";
        history.current.scrollMap.set(location.pathname, scrollTop);
        history.current.idxMap.set(location.pathname, history.current.idx);
        history.current.locations = [...history.current.locations.slice(0, history.current.idx), getLocation(href)];
        if (location.pathRoute.pageState.cache)
          history.current.cachedLocationMap.set(location.pathRoute.path, location);
        setLocationState({ location: history.current.locations[history.current.idx], prevLocation });
        window.history.replaceState({}, "", href);
      },
      refresh: () => {
        window.location.reload();
      },
      back: async () => {
        const location = history.current.locations[history.current.idx];
        await onBack.current[location.pathRoute.pageState.transition]?.();
        const scrollTop = pageContentRef.current?.scrollTop ?? 0;
        history.current.type = "back";
        history.current.scrollMap.set(location.pathname, scrollTop);
        history.current.idxMap.set(location.pathname, history.current.idx);
        if (location.pathRoute.pageState.cache)
          history.current.cachedLocationMap.set(location.pathRoute.path, location);
        history.current.idx--;
        setLocationState({
          location: history.current.locations[history.current.idx],
          prevLocation: history.current.locations[history.current.idx - 1] ?? null,
        });
        window.history.back();
      },
    };
    window.onpopstate = async (ev: PopStateEvent) => {
      const routeType =
        window.location.pathname === history.current.locations[history.current.idx + 1]?.pathname
          ? "forward"
          : window.location.pathname === history.current.locations[history.current.idx - 1]?.pathname
            ? "back"
            : null;
      const scrollTop = pageContentRef.current?.scrollTop ?? 0;
      if (!routeType) return;
      if (routeType === "forward") {
        const location = history.current.locations[history.current.idx];
        history.current.type = "forward";
        history.current.scrollMap.set(location.pathname, scrollTop);
        history.current.idxMap.set(location.pathname, history.current.idx);
        if (location.pathRoute.pageState.cache)
          history.current.cachedLocationMap.set(location.pathRoute.path, location);
        history.current.idx++;
        setLocationState({ location: history.current.locations[history.current.idx], prevLocation: location });
      } else {
        // back
        const location = history.current.locations[history.current.idx];
        await onBack.current[location.pathRoute.pageState.transition]?.();
        history.current.type = "back";
        history.current.scrollMap.set(location.pathname, scrollTop);
        history.current.idxMap.set(location.pathname, history.current.idx);
        if (location.pathRoute.pageState.cache)
          history.current.cachedLocationMap.set(location.pathRoute.path, location);
        history.current.idx--;
        setLocationState({
          location: history.current.locations[history.current.idx],
          prevLocation: history.current.locations[history.current.idx - 1] ?? null,
        });
      }
    };
    return router;
  }, [location]);
  const router = getRouter();
  const routeState: RouteState = {
    clientWidth: clientWidth.current,
    clientHeight: clientHeight.current,
    location,
    prevLocation,
    history,
    topSafeAreaRef,
    bottomSafeAreaRef,
    prevPageContentRef,
    pageContentRef,
    frameRootRef,
    onBack,
    router,
    pathRoutes,
  };
  const useNonTransition = useNoneTrans(routeState);
  const useFadeTransition = useFadeTrans(routeState);
  const useStackTransition = useStackTrans(routeState);
  const useBottomUpTransition = useBottomUpTrans(routeState);
  const useCsrTransitionMap: { [key in TransitionType]: UseCsrTransition } = {
    none: useNonTransition,
    fade: useFadeTransition,
    stack: useStackTransition,
    bottomUp: useBottomUpTransition,
    scaleOut: useNonTransition,
  };

  useEffect(() => {
    if (pageContentRef.current)
      pageContentRef.current.scrollTop = history.current.scrollMap.get(location.pathname) ?? 0;
    if (prevPageContentRef.current)
      prevPageContentRef.current.scrollTop = prevLocation
        ? history.current.scrollMap.get(prevLocation.pathname) ?? 0
        : 0;
    void App.addListener("backButton", () => {
      router.back();
    });
    return () => {
      void App.removeAllListeners();
    };
  }, [location.pathname]);

  return {
    ...routeState,
    ...useCsrTransitionMap[location.pathRoute.pageState.transition],
  } satisfies CsrContextType;
};
