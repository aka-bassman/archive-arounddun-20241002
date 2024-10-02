import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, board }: ModelProps<"board", cnst.LightBoard>) => {
  return <div>{board.name}</div>;
};
