import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ file }: ModelProps<"file", cnst.LightFile>) => {
  return (
    <div>
      {file.filename}-{file.createdAt.format("YYYY-MM-DD")}
    </div>
  );
};
