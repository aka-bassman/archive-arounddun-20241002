"use client";
import { ReactNode } from "react";
import { st } from "@shared/client";

interface WebProps {
  children: ReactNode;
}

export const Web = ({ children }: WebProps) => {
  const innerWidth = st.use.innerWidth();
  return innerWidth > 768 ? children : null;
};
