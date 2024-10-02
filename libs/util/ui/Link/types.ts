import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";

export type CommonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> &
  Omit<LinkProps, "href"> & { href?: string | null; children?: ReactNode; disabled?: boolean; scrollToTop?: boolean };

export interface CsrLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
  replace?: boolean;
}

export interface NextLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href">,
    LinkProps {
  href: string;
  children?: ReactNode;
  disabled?: boolean;
  scrollToTop?: boolean;
}
