import { Image } from "@util/ui";
import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, emoji }: ModelProps<"emoji", cnst.LightEmoji>) => {
  return <Image className={className} alt="file" src={emoji.file.url} />;
};
