"use client";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { clsx } from "@core/client";
import { usePage } from "@util/client";
import React, { ButtonHTMLAttributes, useState } from "react";

type ButtonProps<Result> = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    { onError }: { onError: (error: string) => void }
  ) => Promise<Result>;
  onSuccess?: (result: Result) => void;
};

export const Button = <Result = any,>({ className, children, onClick, onSuccess, ...rest }: ButtonProps<Result>) => {
  const { l } = usePage();
  const [state, setState] = useState<{
    mode: "idle" | "loading" | "success" | "error";
    error: string | null;
    times: number;
  }>({
    mode: "idle",
    error: null,
    times: 0,
  });
  return (
    <>
      <button
        className={clsx("btn", className)}
        {...rest}
        disabled={!!rest.disabled || ["loading", "success"].includes(state.mode)}
        onClick={(e) => {
          setState({ mode: "loading", error: null, times: state.times + 1 });
          void (async () => {
            const result = await onClick(e, {
              onError: (error) => {
                setState({ mode: "error", error, times: state.times + 1 });
              },
            });
            setState({ mode: "success", error: null, times: state.times + 1 });
            setTimeout(() => {
              setState({ mode: "idle", error: null, times: state.times + 1 });
              onSuccess?.(result);
            }, 300);
          })();
        }}
      >
        {state.mode === "loading" ? (
          <>
            <span className="loading loading-bars loading-md" /> {l("util.processing")}
          </>
        ) : state.mode === "success" ? (
          <>
            <AiOutlineCheckCircle /> {l("util.processed")}
          </>
        ) : (
          children
        )}
      </button>
      <div className="text-error h-10 w-full p-2 text-center text-sm">
        {state.error ? l(state.error as `${string}.${string}`) : "  "}
      </div>
    </>
  );
};
