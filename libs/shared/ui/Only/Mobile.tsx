"use client";
import { ReactNode } from "react";
import { st } from "@shared/client";

interface MobileProps {
  children: ReactNode;
}

export const Mobile = ({ children }: MobileProps) => {
  const innerWidth = st.use.innerWidth();
  return innerWidth && innerWidth < 768 ? children : null;
};
