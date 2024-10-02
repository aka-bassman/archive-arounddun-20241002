"use client";
import { Portal } from "@util/ui";
import { baseClientEnv } from "@core/base";
import { clsx, usePathCtx } from "@core/client";
import { st } from "@util/client";
import { useEffect, useState } from "react";

interface BottomInsetProps {
  className?: string;
  children: any;
  keyboardSticky?: boolean;
}

export const BottomInset = ({ className, children, keyboardSticky }: BottomInsetProps) => {
  const [render, setRender] = useState(false);
  const { location } = usePathCtx();
  const suffix = baseClientEnv.renderMode === "csr" ? `-${location.pathRoute.path}` : "";
  const keyboardHeight = st.use.keyboardHeight();

  useEffect(() => {
    setRender(true);
  }, []);

  if (!render) return null;
  return (
    <Portal id={`bottomInsetContent${suffix}`}>
      <div
        className={clsx(className, `size-full transition-all ease-out`, {
          "duration-[285ms]": keyboardHeight,
          "duration-0": !keyboardHeight,
          absolute: keyboardSticky && keyboardHeight,
        })}
        style={{
          bottom: keyboardSticky && keyboardHeight ? keyboardHeight - location.pathRoute.pageState.bottomSafeArea : 0,
        }}
      >
        {children}
      </div>
    </Portal>
  );
};
