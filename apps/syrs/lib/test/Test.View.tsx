import { clsx } from "@core/client";
import { cnst } from "@syrs/client";

interface TestViewProps {
  className?: string;
  test: cnst.Test;
  self?: { id?: string } | null;
}

export const General = ({ className, test, self }: TestViewProps) => {
  return (
    <div className={clsx(className, `animate-fadeIn w-full`)}>
      <div>{test.id}</div>
    </div>
  );
};
