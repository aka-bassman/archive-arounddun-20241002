"use client";
import { ReactNode } from "react";
import { cnst, st } from "@shared/client";

interface ShowProps {
  children: ReactNode | ReactNode[];
  show?: boolean | cnst.util.Responsive[];
}
export const Show = ({ children, show = false }: ShowProps) => {
  const responsive = st.use.responsive();
  if (typeof show === "boolean") return show ? <>{children}</> : null;
  else return show.includes(responsive) ? <>{children}</> : null;
};
