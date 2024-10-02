"use client";
//! 디자인 수정, 테마 적용 안됨
import { BiMessageRoundedError } from "react-icons/bi";
import { animated, useSpring } from "@react-spring/web";
import { clsx } from "@core/client";
import { usePage } from "@util/client";
import React, { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

interface PopconfirmProps {
  title: string;
  description?: ReactNode;
  onConfirm?: () => void;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  okText?: string;
  cancelText?: string;
  children?: ReactNode;
  triggerClassName?: string;
  decoClassName?: string;
}

export const Popconfirm = ({
  title,
  description,
  onConfirm,
  okButtonProps,
  cancelButtonProps,
  okText,
  cancelText,
  children,
  triggerClassName,
  decoClassName,
}: PopconfirmProps) => {
  const { l } = usePage();
  const [isConfirming, setIsConfirming] = useState(false);

  const popconfirmProps = useSpring({
    opacity: isConfirming ? 1 : 0,
    from: {
      opacity: 0,
    },
  });

  // popconfirm 위치 조정 (x 좌표가 음수인 경우)
  useEffect(() => {
    const popconfirm = document.querySelector(".popconfirm");
    const popconfirmRect = popconfirm?.getBoundingClientRect();
    const popconfirmDeco = document.querySelector(".popconfirm-deco");

    // popconfirmRect.x 가 좌측 화면 밖으로 나가는 경우
    if (popconfirmRect && popconfirmRect.x < 0) {
      popconfirm?.classList.add("left-0", "right-auto");
      popconfirmDeco?.classList.add("left-10", "left-auto");
    }
    // popconfirmRect.x 가 우측 화면 밖으로 나가는 경우
    if (popconfirmRect && popconfirmRect.x + popconfirmRect.width > window.innerWidth) {
      popconfirm?.classList.add("left-auto", "right-0");
    }
  }, [isConfirming]);

  const handleConfirm = () => {
    setIsConfirming(false);
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <>
      <div className="relative inline-block">
        <div
          className={clsx("trigger", triggerClassName)}
          onClick={() => {
            setIsConfirming(true);
          }}
        >
          {children}
        </div>
        {isConfirming && (
          <animated.div
            className="popconfirm border-base-300 bg-base-100 absolute -right-2 bottom-0 z-10 translate-y-[106%] rounded-lg border p-4 shadow-xl"
            style={popconfirmProps}
          >
            <div
              className={clsx(
                "bg-base-100 border-base-300 popconfirm-deco absolute -top-2 size-4 rotate-45 rounded border-l border-t",
                { "right-10": !decoClassName },
                decoClassName
              )}
            ></div>
            <div className="flex gap-1">
              <BiMessageRoundedError className="text-orange-500" />
              <div>
                <p className="mb-2 whitespace-nowrap font-bold">{title}</p>
                <div className="mb-2 whitespace-nowrap">{description}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-xs btn-outline" onClick={handleCancel} {...cancelButtonProps}>
                {cancelText ?? l("util.cancel")}
              </button>
              <button className="btn btn-xs" onClick={handleConfirm} {...okButtonProps}>
                {okText ?? l("util.ok")}
              </button>
            </div>
          </animated.div>
        )}
      </div>
      {isConfirming && (
        <div
          className="absolute left-0 top-0 h-screen w-full"
          onClick={() => {
            setIsConfirming(false);
          }}
        ></div>
      )}
    </>
  );
};
