"use client";
import { createContext } from "react";

interface TabContextType {
  menu: string | null;
  setMenu: (value: string | null) => void;
}

export const TabContext = createContext<TabContextType>({
  menu: null,
  setMenu: (value: string | null) => null,
});
