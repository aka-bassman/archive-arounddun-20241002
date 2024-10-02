"use client";
import { AiOutlineMenu } from "react-icons/ai";
import { BiX } from "react-icons/bi";
import { clsx } from "@core/client";

interface SiderProps {
  className?: string;
  bgClassName?: string;
  children?: any;
}
export const Sider = ({ className, bgClassName, children }: SiderProps) => {
  return (
    <>
      <div className="drawer-content">
        <label htmlFor="sider" className="btn btn-ghost">
          <AiOutlineMenu />
        </label>
      </div>
      <div className="drawer drawer-start fixed">
        <input id="sider" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label htmlFor="sider" className={clsx("drawer-overlay", bgClassName)}></label>
          <div className={clsx("bg-base-200 text-base-content h-full w-3/4 p-4 md:w-80", className)}>
            <button
              className="absolute left-4 top-4 text-lg"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("sider")?.click();
              }}
            >
              <BiX />
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
