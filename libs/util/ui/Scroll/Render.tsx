"use client";
import { clsx } from "@core/client";
import { useEffect, useRef, useState } from "react";

interface RenderProps {
  id?: string;
  children: any;
  className?: string;
  preClassName?: string;
  postClassName?: string;
  once?: boolean;
  onRendered?: () => void;
}
export const Render = ({
  id,
  children,
  className,
  preClassName = "",
  postClassName = "",
  once,
  onRendered,
}: RenderProps) => {
  const [rendered, setRendered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!(once && rendered)) {
        setRendered(entry.isIntersecting);
        if (entry.isIntersecting) onRendered?.();
      }
    });
    observer.observe(wrapperRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id={id}
      ref={wrapperRef}
      data-rendered={rendered}
      className={clsx(className, "group/scroll transition-all duration-150", {
        [preClassName]: !rendered,
        [postClassName]: rendered,
      })}
    >
      {children}
    </div>
  );
};
