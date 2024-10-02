"use client";
import { AiOutlineMeh } from "react-icons/ai";
import { type ReactNode, useMemo } from "react";

interface ViewProps<Full extends { id: string }> {
  className?: string;
  model: Full | null;
  modelLoading?: string | boolean;
  render: (model: Full) => JSX.Element | null;
  loadingWrapper?: null | ((props: { children?: any; className?: string }) => JSX.Element);
  empty?: null | (() => JSX.Element);
  loading?: null | (() => JSX.Element);
}
export default function View<Full extends { id: string }>({
  className,
  model,
  modelLoading = true,
  render,
  loadingWrapper,
  loading,
  empty,
}: ViewProps<Full>) {
  const RenderLoadingWrapper = useMemo(
    () =>
      loadingWrapper === null
        ? ({ children, className }) => children as ReactNode
        : loadingWrapper
          ? loadingWrapper
          : ({ children, className }) => (
              <>
                {children}
                {modelLoading ? <div className="absolute inset-0 animate-pulse" /> : null}
              </>
            ),
    [modelLoading]
  );
  const RenderModel = useMemo(
    () =>
      modelLoading
        ? loading === null
          ? () => null
          : loading
            ? loading
            : () => (
                <div className="flex size-full flex-col items-center justify-center gap-3 pb-3 pt-6">
                  <span className="loading loading-dots loading-lg" />
                  Loading
                </div>
              )
        : model
          ? () => render(model)
          : empty === null
            ? () => null
            : empty
              ? empty
              : () => (
                  <div className="flex w-full flex-col items-center justify-center gap-3 pb-3 pt-6">
                    <AiOutlineMeh className="scale-150 text-4xl" /> Empty
                  </div>
                ),
    [model, modelLoading]
  );
  return (
    <RenderLoadingWrapper className={className}>
      <RenderModel />
    </RenderLoadingWrapper>
  );
}
