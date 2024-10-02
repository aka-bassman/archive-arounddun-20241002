/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";
import { Browser } from "@capacitor/browser";
import { router } from "@core/client";
import type { CsrLinkProps } from "./types";

export default function CsrLink({ className, children, href, replace, ...props }: CsrLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  return (
    <a
      className={className}
      onClick={() => {
        if (isExternal) void Browser.open({ url: href, presentationStyle: "popover" });
        else if (replace) router.replace(href);
        else router.push(href);
      }}
    >
      {children}
    </a>
  );
}
