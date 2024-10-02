"use client";
import { ScrollContext } from "./context";
import { clsx } from "@core/client";
import { useContext } from "react";

export const Navigator = () => {
  const { slide, slideIds } = useContext(ScrollContext);
  return (
    <div className="fixed inset-x-0 bottom-3 z-20 m-auto flex size-fit flex-row gap-2 md:inset-y-0 md:left-4 md:right-auto md:flex-col">
      {slideIds.map((slideId) => (
        <a
          key={slideId}
          href={`#${slideId}`}
          className={clsx("hover:text-primary mb-2 size-3 cursor-pointer rounded-full", {
            "bg-primary": slide === slideId,
            "bg-slate-400": slide !== slideId,
          })}
        />
      ))}
    </div>
  );
};
