"use client";
import { clsx } from "@core/client";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  className?: string;
  type?: "static" | "hide";
  children?: any;
}
export const Header = ({ className, type, children }: HeaderProps) => {
  const [visible, setVisible] = useState(true);
  const position = useRef(0);
  useEffect(() => {
    if (type === "static") return;
    const handleScroll = () => {
      const isVisible = window.scrollY < 64 ? true : position.current > window.scrollY;
      position.current = window.scrollY;
      setVisible(isVisible);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    // `hidden md:flex fixed top-0 z-[9] duration-300 ${
    <div
      className={clsx(
        `fixed top-0 z-[9] flex duration-300 ${
          !visible && "md:-translate-y-full"
        } bg-base-100 w-full shadow backdrop-blur-lg`,
        className
      )}
    >
      {children}
    </div>
  );
};
