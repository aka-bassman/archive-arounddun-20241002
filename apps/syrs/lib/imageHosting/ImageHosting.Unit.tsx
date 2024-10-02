import { Link } from "@util/ui";
import { cnst, ImageHosting } from "@syrs/client";
import { ModelProps } from "@core/client";

export const Card = ({ imageHosting, href }: ModelProps<"imageHosting", cnst.LightImageHosting>) => {
  return (
    <Link href={href} className="animate-fadeIn w-full h-36 flex rounded-lg shadow hover:shadow-lg duration-300">
      <div>{imageHosting.id}</div>
    </Link>
  );
};
