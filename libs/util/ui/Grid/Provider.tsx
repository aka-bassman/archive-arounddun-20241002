"use client";
import { GridContext } from "./context";
import { type RefObject, useState } from "react";
import { clsx } from "@core/client";

export interface ProviderProps {
  className?: string;
  children?: any;
}
export const Provider = ({ className, children }: ProviderProps) => {
  const [viewRef, setViewRef] = useState<RefObject<HTMLDivElement> | null>(null);
  return (
    <GridContext.Provider value={{ viewRef, setViewRef }}>
      <div className={clsx("group/grid relative isolate overflow-hidden", className)}>{children}</div>
    </GridContext.Provider>
  );
};
