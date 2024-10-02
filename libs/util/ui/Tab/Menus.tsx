"use client";

interface MenusProps {
  className?: string;
  children: any;
}
export const Menus = ({ className, children }: MenusProps) => {
  return <div className={className}>{children}</div>;
};
