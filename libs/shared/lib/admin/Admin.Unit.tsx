import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ admin, href }: ModelProps<"admin", cnst.LightAdmin>) => {
  return <div>{admin.accountId}</div>;
};
