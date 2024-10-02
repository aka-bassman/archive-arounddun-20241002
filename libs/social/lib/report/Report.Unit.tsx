import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, report }: ModelProps<"report", cnst.LightReport>) => {
  return (
    <div>
      {report.type}-{report.title}
    </div>
  );
};
