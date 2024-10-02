import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, serviceDesk }: ModelProps<"serviceDesk", cnst.LightServiceDesk>) => {
  return <div>{serviceDesk.id}</div>;
};
