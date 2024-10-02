"use client";
import { BiX } from "react-icons/bi";
import { a, config, useSpring } from "react-spring";
import { clsx } from "@core/client";
import { st } from "@util/client";
import { useDrag } from "@use-gesture/react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface BottomSheetProps {
  open: boolean;
  onCancel: () => void;
  children: any;
  type: "full" | "half";
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ open, onCancel, type = "half", children }: BottomSheetProps, bottomSheetRef) => {
    const ref = useRef<HTMLDivElement>(null);
    const pageState = st.use.pageState();

    const [{ y, opacity }, api] = useSpring(() => ({ y: window.innerHeight, opacity: 0 }));

    const openModal = async () => {
      //rubber band
      await Promise.all(api.start({ y: 0, opacity: 100, immediate: false, config: config.default }));
    };
    const closeModal = async () => {
      await Promise.all(
        api.start({ y: window.innerHeight, opacity: 0, immediate: false, config: { ...config.stiff, velocity: 0 } })
      );
      onCancel();
    };

    const bind = useDrag(
      ({ down, velocity: [, vy], direction: [, dy], offset: [, oy], movement: [, my], xy, initial }) => {
        if (down) {
          if (my < 0) void api.start({ y: 0, immediate: true });
          else void api.start({ y: my, immediate: true });
        } else {
          if (my > window.innerHeight / 3) void closeModal();
          else void openModal();
        }
      }
    );

    useImperativeHandle(bottomSheetRef, () => ({
      open: openModal,
      close: closeModal,
    }));

    useEffect(() => {
      if (open) void openModal();
      else void closeModal();
    }, [open]);

    return (
      <>
        <a.div
          style={{
            opacity,
          }}
          onClick={() => void closeModal()}
          className={clsx("fixed left-0  top-0 size-full bg-gray-500/50 ", {
            "z-[100]": open,
            "-z-[1]": !open,
          })}
        />
        <a.div
          ref={ref}
          style={{ y, paddingTop: type === "full" ? pageState.topSafeArea : 0 }}
          className={clsx("bg-base-200 fixed  bottom-0 left-0 z-[101] w-full", {
            "rounded-t-3xl h-[90%]": type === "half",
            "h-[100vh] ": type === "full",
          })}
        >
          <div className="flex h-8 w-full items-start justify-center pt-2 ">
            {type === "half" ? (
              <a.div {...bind()} className="flex  h-8 w-full items-start justify-center pt-2">
                <div className="h-2 w-32 rounded-full bg-gray-300"></div>
              </a.div>
            ) : (
              <button
                onClick={() => void closeModal()}
                className="absolute right-2 top-2 text-4xl"
                style={{ paddingTop: pageState.topSafeArea }}
              >
                <BiX />
              </button>
            )}
          </div>

          <div className="relative  size-full pt-5">{children}</div>
        </a.div>
      </>
    );
  }
);
