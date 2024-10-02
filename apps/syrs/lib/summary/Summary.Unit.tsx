import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, summary }: ModelProps<"summary", cnst.LightSummary>) => {
  return <div>{summary.id}</div>;
};
