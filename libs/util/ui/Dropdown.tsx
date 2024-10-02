"use client";
import { ReactNode, useState } from "react";
import { clsx } from "@core/client";

interface DropdownProps {
  value: ReactNode;
  content: ReactNode;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export const Dropdown = ({ value, content, className, buttonClassName, dropdownClassName }: DropdownProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <div className={clsx("dropdown dropdown-end", className)}>
      <label
        tabIndex={0}
        className={clsx("btn flex", buttonClassName)}
        onClick={() => {
          setOpened(true);
        }}
      >
        {value}
      </label>
      <ul
        tabIndex={0}
        onClick={() => {
          if (opened) setOpened(false);
        }}
        className={clsx(
          "md:scrollbar-thin md:scrollbar-thumb-rounded-md md:scrollbar-thumb-gray-300 md:scrollbar-track-transparent  bg-base-100 z-40 grid max-h-52 gap-2 overflow-auto whitespace-nowrap rounded-md pr-3 shadow",
          opened ? "dropdown-content size-fit p-1" : "size-0 overflow-hidden",
          dropdownClassName
        )}
      >
        {content}
      </ul>
    </div>
  );
};
