import { baseClientEnv } from "@core/base";
import { lazy } from "@core/next";
import Back from "./Back";
import type { CommonLinkProps } from "./types";

const CsrLink = lazy(() => import("./CsrLink"));
const NextLink = lazy(() => import("./NextLink"));

export const Link = ({ className, href, disabled = false, children, ...props }: CommonLinkProps) => {
  if (disabled || !href)
    return (
      <div className={className} {...(props as any)}>
        {children}
      </div>
    );
  if (baseClientEnv.renderMode === "csr")
    return (
      <CsrLink className={className} href={href} {...props}>
        {children}
      </CsrLink>
    );
  return (
    <NextLink className={className} href={href} {...props}>
      {children}
    </NextLink>
  );
};
Link.Back = Back;
