"use client";
import { createContext } from "react";

interface ScrollContextType {
  slide: string;
  setSlide: (value: string) => void;
  slideIds: string[];
}

export const ScrollContext = createContext<ScrollContextType>({
  slide: "",
  setSlide: (value: string) => "",
  slideIds: [],
});
