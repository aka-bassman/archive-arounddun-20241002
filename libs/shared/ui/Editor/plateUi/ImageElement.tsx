import { Image, useMediaState } from "@udecode/plate-media";
import { PlateElement, withHOC } from "@udecode/plate-common";
import { ResizableProvider, useResizableStore } from "@udecode/plate-resizable";
import { cn, withRef } from "@udecode/cn";
import React from "react";

import { Caption, CaptionTextarea } from "./Caption";
import { Resizable, ResizeHandle, mediaResizeHandleVariants } from "./Resizable";

export const ImageElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(({ className, children, nodeProps, ...props }, ref) => {
    const { readOnly, focused, selected, align = "center" } = useMediaState();
    const width = useResizableStore().get.width();

    return (
      <PlateElement ref={ref} className={cn("py-2.5", className)} {...props}>
        <figure className="group relative m-0" contentEditable={false}>
          <Resizable
            align={align}
            options={{
              align,
              readOnly,
            }}
          >
            <ResizeHandle
              options={{ direction: "left" }}
              className={mediaResizeHandleVariants({ direction: "left" })}
            />
            <Image
              className={cn(
                "block w-full max-w-full cursor-pointer object-cover px-0",
                "rounded-sm",
                focused && selected && "ring-2 ring-ring ring-offset-2"
              )}
              alt=""
              {...nodeProps}
            />
            <ResizeHandle
              options={{ direction: "right" }}
              className={mediaResizeHandleVariants({ direction: "right" })}
            />
          </Resizable>

          <Caption align={align} style={{ width }}>
            <CaptionTextarea placeholder="Write a caption..." readOnly={readOnly} />
          </Caption>
        </figure>

        {children}
      </PlateElement>
    );
  })
);
