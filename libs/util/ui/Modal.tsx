"use client";
import { BiX } from "react-icons/bi";
import { ReactNode, useEffect, useRef, useState } from "react";
import { a, config, useSpring } from "react-spring";
import { clsx } from "@core/client";
import { useDrag } from "@use-gesture/react";

import * as Dialog from "@radix-ui/react-dialog";
import { usePage } from "@util/client";

const MODAL_MARGIN = 0; // px
const OPACITY = { START: 0, END: 0.8 };

const interpolate = (o: number, i: number, t: number) => {
  return o + (i - o) * t;
};
interface ModalProps {
  className?: string;
  title?: string | JSX.Element;
  action?: JSX.Element;
  open: boolean;
  onCancel: () => void;
  bodyClassName?: string;
  children?: any;
  confirmClose?: boolean;
}

export const Modal = ({
  className,
  title,
  action,
  open,
  onCancel,
  bodyClassName,
  children,
  confirmClose = false,
}: ModalProps) => {
  const { l } = usePage();
  const ref = useRef<HTMLDivElement>(null);
  const modalCountRef = useRef(0);
  const [{ translate }, api] = useSpring(() => ({ translate: 1 }));
  const [showBackground, setShowBackground] = useState(false);
  const openModal = async ({ canceled }: { canceled?: boolean } = {}) => {
    setTimeout(() => {
      setShowBackground(true);
    }, 100);
    await Promise.all(api.start({ translate: 0, immediate: false, config: canceled ? config.wobbly : config.stiff }));
  };
  const closeModal = async ({ velocity = 0, confirmClose }: { velocity?: number; confirmClose?: boolean }) => {
    if (confirmClose && !window.confirm(l("util.confirmClose"))) {
      return;
    }

    setTimeout(() => {
      setShowBackground(false);
    }, 100);
    await Promise.all(api.start({ translate: 1, immediate: false, config: { ...config.stiff, velocity } }));
    onCancel();
  };
  const bind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [, oy],
      movement: [, my],
      target,
      cancel,
      canceled,
      first,
      metaKey,
      _pointerId,
    }) => {
      if (!ref.current) return;
      const height = (ref.current.clientHeight || MODAL_MARGIN) - MODAL_MARGIN;
      if (my > 70) cancel();
      if (last) {
        my > height * 0.5 || (vy > 0.5 && dy > 0)
          ? void closeModal({ velocity: vy / height, confirmClose: confirmClose })
          : void openModal({ canceled });
      } else void api.start({ translate: oy / height, immediate: true });
    },
    { from: () => [0, translate.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true }
  );
  const opacity = translate.to((t) => {
    return interpolate(OPACITY.END, OPACITY.START, t);
  });
  const translateY = translate.to((t) => {
    return `${t * 100}%`;
  });
  const zIndices = [50 + modalCountRef.current * 20, 60 + modalCountRef.current * 20];

  useEffect(() => {
    modalCountRef.current = document.getElementsByClassName("active-modal").length;
    if (open) void openModal();
    else void closeModal({});
  }, [open]);

  if (!open) return <></>;

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => {
            void closeModal({ confirmClose: confirmClose });
          }}
        >
          {showBackground ? (
            <div
              className={"data-[state=open]:animate-fadeIn bg-base-content/50 fixed inset-0 z-10 backdrop-blur-md "}
            />
          ) : null}
        </Dialog.Overlay>
        <>
          <Dialog.Content
            className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            asChild
            forceMount
          >
            <Dialog.Description className="z-10 ">
              <a.div ref={ref} style={{ translateY, opacity }}>
                <Dialog.Close className="absolute right-0 top-[-40px] z-20">
                  <button
                    onClick={() => void closeModal({ confirmClose: confirmClose })}
                    className="btn btn-circle btn-sm z-20  "
                  >
                    <BiX className="text-3xl" />
                  </button>
                </Dialog.Close>
                <div
                  className={clsx(
                    "bg-base-100 animate-fadeIn   max-w-screen mx-auto flex max-h-[90vh] w-full max-w-[96vw] flex-col items-center justify-center overflow-x-hidden rounded-lg  duration-100 sm:w-[90%] sm:p-2 md:p-4 md:pt-0",
                    className
                  )}
                >
                  <Dialog.Title
                    {...bind()}
                    className="animate-fadeIn relative z-10 flex  w-full  cursor-pointer flex-col items-center justify-center px-4 pt-2 md:min-h-[32px]"
                  >
                    <div className=" order-base-100 flex w-full cursor-pointer items-center  justify-center pt-1 opacity-50">
                      <div className="h-1 w-24 rounded-full   bg-gray-500 "></div>
                    </div>
                    <div className="flex   w-full items-center justify-start">
                      <div className="w-full  text-start text-lg font-bold">{title}</div>
                    </div>
                  </Dialog.Title>
                  <div
                    className={clsx(
                      "border-base-content/30 scrollbar-none relative  m-2  grid size-full max-h-[70vh] place-items-center overflow-x-hidden overflow-y-scroll border-t-[0.1px] p-4 sm:min-h-[192px] sm:p-4 md:max-h-[90vh] md:min-h-[30vh] md:min-w-[384px]  md:px-8  lg:min-w-[576px] xl:min-w-[768px] ",
                      bodyClassName
                    )}
                  >
                    {children}
                  </div>

                  {action ? <div className="w-full pt-5">{action}</div> : null}
                </div>
              </a.div>
            </Dialog.Description>
          </Dialog.Content>
        </>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface WindowProps {
  open: boolean;
  onCancel: () => void;
  title: ReactNode;
  children: ReactNode;
}

export const Window = ({ open, onCancel, title, children }: WindowProps) => {
  if (!open) return null;

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className="min-w-auto animate-fadeIn fixed left-1/2 top-1/2 z-[2] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-[10px] border-[3px] border-black text-black backdrop-blur-lg md:w-fit"
          style={{
            background: `rgba(255, 255, 255, 0.3)`,
            width: "406px",
          }}
        >
          <Dialog.Title className="height-[36px] relative overflow-hidden rounded-t-[6px] border-b-2 border-black bg-white/60 text-center">
            <h2 className="m-0 text-[22px]">{title}</h2>
            <Dialog.Close
              onClick={() => {
                onCancel();
              }}
              className="absolute right-0 top-0 flex h-[34px] w-[40px] cursor-pointer items-center justify-center border-l-2 border-black"
            >
              <BiX className="text-[32px]" />
            </Dialog.Close>
          </Dialog.Title>
          <Dialog.Description className="overflow-y-hidden rounded-b-[10px] p-2">{children}</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
Modal.Window = Window;
