// "use client";
import { AiOutlineBlock } from "react-icons/ai";
import { clsx } from "@core/client";
import { usePage } from "@util/client";
import React, { ReactNode } from "react";

interface UnauthorizedProps {
  className?: string;
  description?: ReactNode;
  children?: ReactNode;
  minHeight?: number;
}

export const Unauthorized = ({ className = "", description, children, minHeight = 300 }: UnauthorizedProps) => {
  const { l } = usePage();
  return (
    <div>
      <div
        className={clsx(
          `min-h-[ w-full${minHeight}px]  text-base-content/30 flex flex-col items-center justify-center gap-3 pb-3 pt-6`,
          className
        )}
      >
        <AiOutlineBlock className="scale-150 text-4xl" />
        <p>{description ?? l("util.unauthorized")}</p>
      </div>
      {children}
    </div>
  );
};
