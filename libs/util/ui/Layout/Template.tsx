import { clsx } from "@core/client";

interface TemplateProps {
  className?: string;
  children?: React.ReactNode;
}
export const Template = ({ className, children }: TemplateProps) => {
  return <div className={clsx("flex w-full max-w-screen-lg flex-col gap-6 px-2", className)}>{children}</div>;
};
