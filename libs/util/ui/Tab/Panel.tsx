"use client";
import { TabContext } from "./context";
import { clsx } from "@core/client";
import { useContext } from "react";

interface PanelProps {
  className?: string;
  menu: string;
  children?: any;
}
export const Panel = ({ className, menu, children }: PanelProps) => {
  const { menu: currentMenu } = useContext(TabContext);
  return <div className={clsx(className, { hidden: currentMenu !== menu })}>{children}</div>;
};
