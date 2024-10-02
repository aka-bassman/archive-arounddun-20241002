"use client";
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Logger } from "@core/common";
import { getPathInfo } from "@core/client";
import { st, usePage } from "@util/client";
import NextjsLink from "next/link";
import type { NextLinkProps } from "./types";

export default function NextLink({
  className,
  children,
  disabled,
  href,
  scrollToTop,
  replace,
  ...props
}: NextLinkProps) {
  const prefix = st.use.prefix();
  const { lang } = usePage();
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const { path, pathname } = getPathInfo(href, lang, prefix ?? "");
  return (
    <NextjsLink
      className={className}
      href={isExternal ? href : pathname}
      passHref
      replace={replace}
      onClick={() => {
        Logger.log(`pathChange-start:${path}`);
        window.parent.postMessage({ type: "pathChange", path, pathname }, "*");
        if (scrollToTop) window.scrollTo(0, 0);
      }}
      {...props}
    >
      {children}
    </NextjsLink>
  );
}
