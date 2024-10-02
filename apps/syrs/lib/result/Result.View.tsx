import { clsx } from "@core/client";
import { cnst } from "@syrs/client";

interface ResultViewProps {
  className?: string;
  result: cnst.Result;
  self?: { id?: string } | null;
}

export const General = ({ className, result, self }: ResultViewProps) => {
  return (
    <div className={clsx(className, `animate-fadeIn w-full`)}>
      <div>{result.id}</div>
    </div>
  );
};
