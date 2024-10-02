"use client";
import { Loading } from "./Loading";
import { lazy } from "@core/next";
export type { ChartData, ChartType } from "chart.js";
export const Bar = lazy(() => import("./Bar"), { ssr: false, loading: () => <Loading /> });
export const Line = lazy(() => import("./Line"), { ssr: false, loading: () => <Loading /> });
export const Doughnut = lazy(() => import("./Doughnut"), { ssr: false, loading: () => <Loading /> });
export const Pie = lazy(() => import("./Pie"), { ssr: false, loading: () => <Loading /> });
