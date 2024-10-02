import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ keyring }: ModelProps<"keyring", cnst.LightKeyring>) => {
  return <div>{keyring.id}</div>;
};
