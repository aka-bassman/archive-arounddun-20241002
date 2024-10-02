"use client";
import { AiOutlineLoading } from "react-icons/ai";
import { a, useSpring } from "react-spring";
import { clsx } from "@core/client";
import type { CSSProperties, ReactNode } from "react";

interface LoadingProps {
  className?: string;
  active?: boolean;
  style?: CSSProperties;
}

export const Loading = ({ className = "", active, style }: LoadingProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div className={clsx("w-full", activeClassName, className)} style={style}>
      <div className="flex flex-col justify-start space-y-3">
        <div className="h-4 w-2/5 rounded-md bg-gray-200 "></div>
        <div className="h-4 w-full rounded-md bg-gray-200 "></div>
        <div className="h-4 w-full rounded-md bg-gray-200 "></div>
        <div className="h-4 w-3/5 rounded-md bg-gray-200 "></div>
      </div>
    </div>
  );
};

const Button = ({ className = "", active, style }: LoadingProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div
      className={clsx("inline-block h-8 w-16 rounded-md bg-gray-200 align-bottom", activeClassName, className)}
      style={style}
    ></div>
  );
};
Loading.Button = Button;

const Input = ({ className = "", active, style }: LoadingProps) => {
  const activeClassName = active ? "animate-pulse" : "";
  return (
    <div
      className={clsx("inline-block h-8 w-44 rounded-md bg-gray-200 align-bottom", activeClassName, className)}
      style={style}
    />
  );
};
Loading.Input = Input;

interface SpinProps {
  indicator?: ReactNode;
  isCenter?: boolean;
}
const Spin = ({ indicator, isCenter }: SpinProps) => {
  return (
    <div className="inline-block py-1">
      <div className={isCenter ? "absolute inset-0 flex size-full flex-none items-center justify-center" : ""}>
        {indicator ? (
          <div className="[&>svg]:animate-spin">{indicator}</div>
        ) : (
          <AiOutlineLoading className="text-primary/60 animate-spin text-3xl" />
        )}
      </div>
    </div>
  );
};
Loading.Spin = Spin;

interface ProgressBarProps {
  className?: string;
  value: number;
  max: number;
}

const ProgressBar = ({ className, value, max }: ProgressBarProps) => {
  const progress = useSpring({ value: 0, to: { value: value } });
  return <a.progress className={clsx(" progress w-full", className)} value={progress.value} max={max} />;
};
Loading.ProgressBar = ProgressBar;

export const Area = () => {
  return (
    <div className="bg-base-300/30 absolute inset-0 grid size-full place-items-center">
      <div className="text-center">
        <span className="loading loading-sm loading-dots" />
        <div className="z-10 text-sm">Loading</div>
      </div>
    </div>
  );
};
Loading.Area = Area;
