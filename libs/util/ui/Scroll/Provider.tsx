"use client";
import { ScrollContext } from "./context";
import { clsx } from "@core/client";
import React, { useState } from "react";

export interface ProviderProps {
  className?: string;
  children?: any;
}
export const Provider = ({ className, children }: ProviderProps) => {
  const slideIds = (children as { props: { id?: string } }[])
    .map((child) => child.props.id)
    .filter((id) => !!id) as string[];
  if (slideIds.length === 0) throw new Error("SlideProvider requires at least one Slide component");
  const [slide, setSlide] = useState<string>(slideIds[0]);
  return (
    <ScrollContext.Provider value={{ slide, setSlide, slideIds }}>
      <div data-slide={slide} className={clsx(className, "group/slide")}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
};
