'use client';
import { lazy } from '@core/next';
export const Google = lazy(() => import('./Google'), { ssr: false });
export const Marker = lazy(() => import('./Marker'), { ssr: false });
export const Polyline = lazy(() => import('./Polyline'), { ssr: false });
