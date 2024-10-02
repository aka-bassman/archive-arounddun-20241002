import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, actionLog }: ModelProps<"actionLog", cnst.LightActionLog>) => {
  return <div>{actionLog.id}</div>;
};
