import { User, usePage } from "@syrs/client";
import { clsx } from "@core/client";
import { cnst } from "../cnst";

interface SummaryViewProps {
  className?: string;
  summary: cnst.Summary;
}

export const General = ({ className, summary }: SummaryViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(className, `mr-12`)}>
      <div className="grid grid-cols-5 gap-4">
        <User.Util.Stat className="col-span-2 " summary={summary} />
      </div>
    </div>
  );
};
