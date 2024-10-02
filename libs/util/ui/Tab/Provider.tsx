"use client";
import { TabContext } from "./context";
import { clsx } from "@core/client";
import { useState } from "react";

export interface ProviderProps {
  className?: string;
  defaultMenu?: string | null;
  children?: any;
}
export const Provider = ({ className, defaultMenu = null, children }: ProviderProps) => {
  const [menu, setMenu] = useState<string | null>(defaultMenu);
  return (
    <TabContext.Provider value={{ menu, setMenu }}>
      <div data-menu={menu} className={clsx(className, "group/tab")}>
        {children}
      </div>
    </TabContext.Provider>
  );
};
