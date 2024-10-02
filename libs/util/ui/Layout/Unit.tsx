import { Link } from "../Link";
import { clsx } from "@core/client";

interface UnitProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
}
export const Unit = ({ className, children, href }: UnitProps) => {
  return (
    <Link href={href}>
      <div className={clsx("flex w-full flex-col gap-2 p-4", className)}>{children}</div>
    </Link>
  );
};
