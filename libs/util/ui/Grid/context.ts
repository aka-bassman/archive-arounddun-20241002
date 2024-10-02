"use client";
import { type RefObject, createContext } from "react";

interface GridContextType {
  viewRef: RefObject<HTMLDivElement> | null;
  setViewRef: (value: RefObject<HTMLDivElement> | null) => void;
}

export const GridContext = createContext<GridContextType>({
  viewRef: null,
  setViewRef: () => {
    //
  },
});

interface GridUnitContextType {
  open: boolean;
}

export const GridUnitContext = createContext<GridUnitContextType>({
  open: false,
});
