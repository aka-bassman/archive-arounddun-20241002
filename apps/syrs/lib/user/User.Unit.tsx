import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, user }: ModelProps<"user", cnst.LightUser>) => {
  return <div>{user.id}</div>;
};
