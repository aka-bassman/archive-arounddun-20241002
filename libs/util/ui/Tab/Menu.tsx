"use client";
import { TabContext } from "./context";
import { clsx } from "@core/client";
import { useContext } from "react";

interface MenuProps {
  className?: string;
  menu: string;
  children: any;
  scrollToTop?: boolean;
}
export const Menu = ({ className, menu, children, scrollToTop }: MenuProps) => {
  const { menu: currentMenu, setMenu } = useContext(TabContext);
  return (
    <a
      className={clsx(className, { "cursor-pointer": menu !== currentMenu })}
      onClick={() => {
        setMenu(menu);
        if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
};
