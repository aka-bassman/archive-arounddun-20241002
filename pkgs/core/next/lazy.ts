//! next build를 위해서 lint 무시
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ComponentType } from "react";
import dynamic, { DynamicOptions } from "next/dynamic";

export const lazy = <T extends ComponentType<any>>(
  loader: (x?: string) => Promise<{ default: T } | T>,
  option?: DynamicOptions<T>
) => (dynamic as any)(loader, option ?? {}) as unknown as T;
